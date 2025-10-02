import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET - Fetch admin financial overview and seller statements
export async function GET(request: NextRequest) {
  try {
    // Skip server-side authentication for now since session is client-side only
    // In production, you'd want to use JWT tokens or cookies for server-side auth

    // Get period filter from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all'

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

    // Get comprehensive platform statistics
    const [
      totalOrders,
      totalRevenue,
      totalCommission,
      totalSellers,
      activeSellers,
      totalProducts,
      activeProducts,
      pendingOrders,
      totalCustomers,
      totalRefunds,
      refundAmount
    ] = await Promise.all([
      prisma.order.count({
        where: { 
          status: 'DELIVERED',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      }),
      prisma.order.aggregate({
        where: { 
          status: 'DELIVERED',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _sum: { total: true }
      }).then((result: any) => result._sum.total || 0),
      prisma.order.aggregate({
        where: { 
          status: 'DELIVERED',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _sum: { total: true }
      }).then((result: any) => (result._sum.total || 0) * 0.1), // 10% commission
      prisma.user.count({
        where: { role: 'SELLER' }
      }),
      prisma.user.count({
        where: { 
          role: 'SELLER',
          isActive: true
        }
      }),
      prisma.product.count(),
      prisma.product.count({
        where: { isActive: true }
      }),
      prisma.order.count({
        where: { 
          status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      prisma.refund.count({
        where: { 
          status: 'APPROVED',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      }),
      prisma.refund.aggregate({
        where: { 
          status: 'APPROVED',
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _sum: { amount: true }
      }).then((result: any) => result._sum.amount || 0)
    ])

    // Calculate platform earnings (commission)
    const platformEarnings = totalCommission
    const sellerPayouts = totalRevenue - totalCommission
    const netPlatformRevenue = platformEarnings - refundAmount

    // Get monthly sales data for the last 12 months
    const monthlySales = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthData = await prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { total: true },
        _count: { id: true }
      })
      
      // Calculate revenue before VAT for accurate seller calculations
      const monthRevenueBeforeVAT = (monthData._sum.total || 0) / 1.18
      const monthCommission = monthRevenueBeforeVAT * 0.1
      const monthSellerPayouts = monthRevenueBeforeVAT * 0.9
      
      monthlySales.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: monthData._sum.total || 0,
        revenueBeforeVAT: monthRevenueBeforeVAT,
        orders: monthData._count.id || 0,
        commission: monthCommission,
        sellerPayouts: monthSellerPayouts,
        vatAmount: (monthData._sum.total || 0) - monthRevenueBeforeVAT
      })
    }

    // Get all sellers with their financial data
    const sellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      include: {
        orders: {
          where: { status: 'DELIVERED' },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    vendorId: true
                  }
                }
              }
            }
          }
        },
        products: {
          select: {
            id: true,
            isActive: true
          }
        }
      }
    })

    // Calculate financial data for each seller
    const sellerFinancials = sellers.map((seller: any) => {
      // Get orders where this seller's products were sold
      const sellerOrders = seller.orders.filter((order: any) =>
        order.orderItems.some((item: any) => item.product.vendorId === seller.id)
      )

      // Calculate seller's revenue from their products
      let sellerRevenue = 0
      let sellerCommission = 0
      let sellerPayout = 0
      let orderCount = 0

      for (const order of sellerOrders) {
        const sellerItems = order.orderItems.filter((item: any) => item.product.vendorId === seller.id)
        // Calculate price before VAT (VAT is 18%, so price with VAT = price * 1.18)
        // Therefore, price before VAT = price / 1.18
        const sellerOrderTotalBeforeVAT = sellerItems.reduce((sum: number, item: any) => sum + ((item.price / 1.18) * item.quantity), 0)
        
        sellerRevenue += sellerOrderTotalBeforeVAT
        sellerCommission += sellerOrderTotalBeforeVAT * 0.1
        sellerPayout += sellerOrderTotalBeforeVAT * 0.9
        orderCount++
      }

      // Get recent transactions for this seller
      const recentTransactions = sellerOrders.slice(0, 5).map((order: any) => {
        const sellerItems = order.orderItems.filter((item: any) => item.product.vendorId === seller.id)
        // Calculate price before VAT (VAT is 18%, so price with VAT = price * 1.18)
        // Therefore, price before VAT = price / 1.18
        const sellerOrderTotalBeforeVAT = sellerItems.reduce((sum: number, item: any) => sum + ((item.price / 1.18) * item.quantity), 0)
        
        return {
          id: order.id,
          type: 'sale',
          amount: sellerOrderTotalBeforeVAT * 0.9,
          commission: sellerOrderTotalBeforeVAT * 0.1,
          date: order.createdAt.toISOString().split('T')[0],
          status: 'paid'
        }
      })

      return {
        id: seller.id,
        name: seller.name || 'Unnamed Business',
        email: seller.email,
        isActive: seller.isActive,
        isVerified: seller.isVerified,
        joinDate: seller.createdAt.toISOString().split('T')[0],
        totalRevenue: sellerRevenue,
        totalCommission: sellerCommission,
        totalPayout: sellerPayout,
        orderCount: orderCount,
        productCount: seller.products.length,
        activeProductCount: seller.products.filter((p: any) => p.isActive).length,
        recentTransactions: recentTransactions
      }
    }).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue) // Sort by revenue

    // Get recent platform transactions (last 20 orders)
    const recentPlatformOrders = await prisma.order.findMany({
      where: { 
        status: 'DELIVERED',
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                vendorId: true
              },
              include: {
                vendor: {
                  select: {
                    name: true,
                    businessName: true
                  }
                }
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
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const recentTransactions = recentPlatformOrders.map((order: any) => {
      // Calculate amounts before VAT for accurate financial reporting
      const orderTotalBeforeVAT = order.total / 1.18
      const totalCommission = orderTotalBeforeVAT * 0.1
      const sellerPayout = orderTotalBeforeVAT * 0.9
      const vatAmount = order.total - orderTotalBeforeVAT
      
      return {
        id: order.id,
        type: 'order',
        customer: order.customer?.name || order.customer?.email || 'Unknown Customer',
        totalAmount: order.total,
        totalAmountBeforeVAT: orderTotalBeforeVAT,
        commission: totalCommission,
        sellerPayout: sellerPayout,
        vatAmount: vatAmount,
        date: order.createdAt.toISOString().split('T')[0],
        status: 'completed',
        items: order.orderItems.map((item: any) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          priceBeforeVAT: item.price / 1.18,
          sellerName: item.product.vendor?.name || 'Unknown Seller',
          sellerBusinessName: item.product.vendor?.businessName || item.product.vendor?.name || 'Unknown Business'
        }))
      }
    })

    // Calculate top performing sellers
    const topSellers = sellerFinancials.slice(0, 10)

    // Calculate platform metrics
    const totalRevenueBeforeVAT = totalRevenue / 1.18
    const platformMetrics = {
      totalOrders,
      totalRevenue,
      totalRevenueBeforeVAT,
      totalCommission,
      sellerPayouts,
      netPlatformRevenue,
      totalSellers,
      activeSellers,
      totalProducts,
      activeProducts,
      pendingOrders,
      totalCustomers,
      totalRefunds,
      refundAmount,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      averageOrderValueBeforeVAT: totalOrders > 0 ? totalRevenueBeforeVAT / totalOrders : 0,
      averageSellerRevenue: sellerFinancials.length > 0 ? 
        sellerFinancials.reduce((sum: number, seller: any) => sum + seller.totalRevenue, 0) / sellerFinancials.length : 0,
      commissionRate: 0.1, // 10%
      vatRate: 0.18, // 18%
      sellerPayoutRate: 0.9 // 90%
    }

    return NextResponse.json({
      success: true,
      data: {
        platformMetrics,
        monthlySales,
        sellerFinancials,
        recentTransactions,
        topSellers
      }
    })

  } catch (error) {
    console.error('Error fetching admin financials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
