import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch seller financial data and transactions
export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query params
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')
    
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Get all orders for this seller
    const allOrders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: sellerId
            }
          }
        }
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
                name: true
              }
            }
          }
        },
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate financial statistics
    let totalEarnings = 0
    let totalPayouts = 0
    let pendingPayout = 0
    let commissionPaid = 0

    // Process each order to calculate financial data
    const transactions = []
    
    for (const order of allOrders) {
      const sellerItems = order.orderItems
      // Calculate price before VAT (VAT is 18%, so price with VAT = price * 1.18)
      // Therefore, price before VAT = price / 1.18
      const sellerTotalBeforeVAT = sellerItems.reduce((sum, item) => sum + ((item.price / 1.18) * item.quantity), 0)
      const commission = sellerTotalBeforeVAT * 0.1 // 10% commission
      const sellerAmount = sellerTotalBeforeVAT * 0.9 // 90% to seller
      
      totalEarnings += sellerTotalBeforeVAT
      commissionPaid += commission

      // Determine transaction status based on order status
      let transactionStatus = 'pending'
      if (order.status === 'DELIVERED') {
        transactionStatus = 'paid'
        totalPayouts += sellerAmount
      } else if (order.status === 'PENDING' || order.status === 'PROCESSING') {
        pendingPayout += sellerAmount
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
        orderTotal: sellerTotalBeforeVAT,
        customer: order.customer?.name || order.customer?.email || 'Unknown Customer'
      })
    }

    // Get refunds for this seller
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
        }
      },
      include: {
        order: {
          include: {
            customer: {
              select: {
                name: true,
                email: true
              }
            },
            orderItems: {
              where: {
                product: {
                  vendorId: sellerId
                }
              },
              include: {
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

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
      totalEarnings -= sellerRefundAmount / 0.9 // Original order amount
      commissionPaid -= commissionRefund
      
      if (refund.status === 'APPROVED') {
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
        customer: refund.order.customer?.name || refund.order.customer?.email || 'Unknown Customer'
      })
    }

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate payout dates
    const now = new Date()
    const lastPayoutDate = new Date(now)
    lastPayoutDate.setDate(now.getDate() - 7) // Assume weekly payouts
    
    const nextPayoutDate = new Date(now)
    nextPayoutDate.setDate(now.getDate() + 7) // Next week

    const financialStats = {
      totalEarnings,
      totalPayouts,
      pendingPayout,
      commissionPaid,
      lastPayoutDate: lastPayoutDate.toISOString().split('T')[0],
      nextPayoutDate: nextPayoutDate.toISOString().split('T')[0]
    }

    return NextResponse.json({
      success: true,
      data: {
        financialStats,
        transactions: transactions.slice(0, 50) // Limit to last 50 transactions
      }
    })

  } catch (error) {
    console.error('Error fetching seller financials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
