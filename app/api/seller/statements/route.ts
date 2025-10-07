import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')
    const period = searchParams.get('period') || 'all'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching statements for seller ID:', sellerId)

    // Calculate date range based on period
    let dateFilter: any = {}
    const now = new Date()
    
    if (period !== 'all') {
      let start: Date
      
      switch (period) {
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          const quarterStart = Math.floor(now.getMonth() / 3) * 3
          start = new Date(now.getFullYear(), quarterStart, 1)
          break
        case 'year':
          start = new Date(now.getFullYear(), 0, 1)
          break
        default:
          start = new Date(0)
      }
      
      dateFilter = {
        gte: start,
        lte: now
      }
    }

    // If custom date range is provided
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Get seller information including business name
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Get orders for this seller within the date range - EXCLUDE CANCELLED orders
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: sellerId
            }
          }
        },
        status: {
          not: 'CANCELLED' // Exclude cancelled orders
        },
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      include: {
        orderItems: {
          where: {
            product: {
              vendorId: sellerId
            }
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${orders.length} orders for seller ${sellerId}`)

    // Get refunds for this seller within the date range
    const refunds = await prisma.refund.findMany({
      where: {
        order: {
          orderItems: {
            some: {
              product: {
                vendorId: sellerId
              }
            }
          }
        },
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      include: {
        order: {
          include: {
            orderItems: {
              where: {
                product: {
                  vendorId: sellerId
                }
              },
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true
                  }
                }
              }
            },
            customer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate comprehensive financial statistics
    let totalSales = 0
    let totalEarnings = 0
    let totalCommission = 0
    let totalPayouts = 0
    let pendingPayout = 0
    let totalRefunds = 0
    let refundCommission = 0

    const transactions = []

    // Process orders - only credit for DELIVERED orders
    for (const order of orders) {
      const sellerItems = order.orderItems
      // Calculate total revenue from seller's products (full price with VAT)
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const commission = sellerTotal * 0.1 // 10% commission
      const sellerAmount = sellerTotal * 0.9 // 90% to seller
      
      // Only add to totals if order is DELIVERED
      if (order.status === 'DELIVERED') {
        totalSales += sellerTotal
        totalEarnings += sellerTotal
        totalCommission += commission
        totalPayouts += sellerAmount
      } else {
        // For non-delivered orders, only add to pending
        pendingPayout += sellerAmount
      }

      // Determine transaction status based on order status
      let transactionStatus = 'pending'
      if (order.status === 'DELIVERED') {
        transactionStatus = 'completed'
      } else if (order.status === 'CANCELLED') {
        transactionStatus = 'cancelled'
      } else {
        transactionStatus = 'pending'
      }

      // Create transaction record
      transactions.push({
        id: `order-${order.id}`,
        type: 'sale',
        orderNumber: order.id,
        amount: sellerAmount,
        commission: commission,
        status: transactionStatus,
        date: order.createdAt.toISOString().split('T')[0],
        description: `${sellerItems.map(item => item.product.name).join(', ')} sale`,
        orderTotal: sellerTotal,
        customer: order.customer?.name || order.customer?.email || 'Unknown Customer',
        orderStatus: order.status
      })
    }

    // Process refunds
    for (const refund of refunds) {
      const sellerItems = refund.order.orderItems
      const sellerRefundAmount = sellerItems.reduce((sum, item) => {
        // Calculate proportional refund amount
        const itemTotal = item.price * item.quantity
        const refundRatio = refund.amount / refund.order.total
        return sum + (itemTotal * refundRatio * 0.9) // 90% to seller
      }, 0)
      
      const commissionRefund = sellerRefundAmount * 0.1 / 0.9 // Calculate commission portion
      
      // Adjust totals
      totalRefunds += sellerRefundAmount
      refundCommission += commissionRefund
      
      if (refund.status === 'APPROVED' || refund.status === 'PROCESSED') {
        totalPayouts -= sellerRefundAmount
      } else if (refund.status === 'PENDING') {
        pendingPayout -= sellerRefundAmount
      }

      // Add refund transaction
      transactions.push({
        id: `refund-${refund.id}`,
        type: 'refund',
        orderNumber: refund.orderId,
        amount: -sellerRefundAmount,
        commission: -commissionRefund,
        status: refund.status.toLowerCase(),
        date: refund.createdAt.toISOString().split('T')[0],
        description: `Refund - ${sellerItems.map(item => item.product.name).join(', ')}`,
        orderTotal: -sellerRefundAmount / 0.9,
        customer: refund.order.customer?.name || refund.order.customer?.email || 'Unknown Customer',
        refundReason: refund.reason
      })
    }

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate payout dates
    const lastPayoutDate = new Date(now)
    lastPayoutDate.setDate(now.getDate() - 7) // Assume weekly payouts
    
    const nextPayoutDate = new Date(now)
    nextPayoutDate.setDate(now.getDate() + 7) // Next week

    // Calculate period-specific metrics
    const periodStats = {
      totalSales,
      totalEarnings,
      totalCommission,
      totalPayouts,
      pendingPayout,
      totalRefunds,
      refundCommission,
      netEarnings: totalEarnings - totalRefunds,
      netPayouts: totalPayouts - totalRefunds,
      lastPayoutDate: lastPayoutDate.toISOString().split('T')[0],
      nextPayoutDate: nextPayoutDate.toISOString().split('T')[0],
      period: period,
      dateRange: {
        start: Object.keys(dateFilter).length > 0 ? dateFilter.gte : null,
        end: Object.keys(dateFilter).length > 0 ? dateFilter.lte : null
      }
    }

    // Calculate summary by transaction type
    const summaryByType = {
      sales: transactions.filter(t => t.type === 'sale').length,
      refunds: transactions.filter(t => t.type === 'refund').length,
      totalTransactionValue: transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    }

    return NextResponse.json({
      success: true,
      data: {
        periodStats,
        transactions: transactions.slice(0, 100), // Limit to last 100 transactions
        summaryByType,
        seller: {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          businessName: seller.businessName || seller.name
        }
      }
    })

  } catch (error) {
    console.error('Error fetching seller statements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

