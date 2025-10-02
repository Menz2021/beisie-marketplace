import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET - Fetch admin financial overview and seller statements
export async function GET(request: NextRequest) {
  try {
    console.log('Admin financials API called')
    
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

    console.log('Admin financials - Starting platform statistics fetch...')
    
    // Get comprehensive platform statistics with error handling
    let totalOrders = 0, totalRevenue = 0, totalCommission = 0, totalSellers = 0
    let activeSellers = 0, totalProducts = 0, activeProducts = 0, pendingOrders = 0
    let totalCustomers = 0, totalRefunds = 0, refundAmount = 0
    
    try {
      const [
        ordersCount,
        revenueResult,
        sellersCount,
        activeSellersCount,
        productsCount,
        activeProductsCount,
        pendingOrdersCount,
        customersCount,
        refundsCount,
        refundAmountResult
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
      
      // Assign the results
      totalOrders = ordersCount
      totalRevenue = revenueResult
      totalCommission = totalRevenue * 0.1
      totalSellers = sellersCount
      activeSellers = activeSellersCount
      totalProducts = productsCount
      activeProducts = activeProductsCount
      pendingOrders = pendingOrdersCount
      totalCustomers = customersCount
      totalRefunds = refundsCount
      refundAmount = refundAmountResult
      
      console.log('Admin financials - Platform stats loaded successfully')
      console.log(`Orders: ${totalOrders}, Revenue: ${totalRevenue}, Sellers: ${totalSellers}`)
      
    } catch (error) {
      console.error('Error fetching platform statistics:', error)
      // Continue with default values (zeros) already set
    }

    // Calculate platform earnings (commission)
    const platformEarnings = totalCommission
    const sellerPayouts = totalRevenue - totalCommission
    const netPlatformRevenue = platformEarnings - refundAmount

    // Get monthly sales data for the last 12 months
    console.log('Admin financials - Fetching monthly sales data...')
    const monthlySales = []
    
    try {
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
      console.log('Admin financials - Monthly sales data loaded successfully')
    } catch (error) {
      console.error('Error fetching monthly sales data:', error)
      // Continue with empty monthlySales array
    }

    console.log('Admin financials - Fetching sellers...')
    
    let sellers: any[] = []
    let allOrders: any[] = []
    
    try {
      // Get all sellers with their basic info and products
      sellers = await prisma.user.findMany({
        where: { role: 'SELLER' },
        include: {
          products: {
            select: {
              id: true,
              isActive: true
            }
          }
        }
      })
      console.log(`Admin financials - Found ${sellers.length} sellers`)
    } catch (error) {
      console.error('Error fetching sellers:', error)
    }
    
    try {
      // Get all delivered orders with their items and vendor information
      allOrders = await prisma.order.findMany({
      where: { 
        status: 'DELIVERED',
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                vendorId: true,
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
      })
      console.log(`Admin financials - Found ${allOrders.length} delivered orders`)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }

    console.log(`Admin financials - Found ${sellers.length} sellers`)
    
    // Calculate financial data for each seller
    const sellerFinancials = sellers.map((seller: any) => {
      // Get orders that contain this seller's products
      const sellerOrders = allOrders.filter((order: any) =>
        order.orderItems.some((item: any) => item.product.vendorId === seller.id)
      )
      
      console.log(`Seller ${seller.name} (${seller.id}): ${sellerOrders.length} orders with their products`)

      // Calculate seller's revenue from their products
      let sellerRevenue = 0
      let sellerCommission = 0
      let sellerPayout = 0
      let orderCount = sellerOrders.length

      for (const order of sellerOrders) {
        const sellerItems = order.orderItems.filter((item: any) => item.product.vendorId === seller.id)
        // Calculate total for seller's items in this order (with VAT included as per user's requirement)
        const sellerOrderTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        
        sellerRevenue += sellerOrderTotal
        sellerCommission += sellerOrderTotal * 0.1
        sellerPayout += sellerOrderTotal * 0.9
      }

      // Get recent transactions for this seller
      const recentTransactions = sellerOrders.slice(0, 5).map((order: any) => {
        const sellerItems = order.orderItems.filter((item: any) => item.product.vendorId === seller.id)
        const sellerOrderTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        
        return {
          id: order.id,
          type: 'sale',
          amount: sellerOrderTotal * 0.9,
          commission: sellerOrderTotal * 0.1,
          date: order.createdAt.toISOString().split('T')[0],
          status: 'paid'
        }
      })
      
      console.log(`Seller ${seller.name}: Revenue=${sellerRevenue}, Commission=${sellerCommission}, Payout=${sellerPayout}`)

      return {
        id: seller.id,
        name: seller.name || 'Unnamed Business',
        email: seller.email || '',
        isActive: seller.isActive || false,
        isVerified: seller.isVerified || false,
        joinDate: seller.createdAt ? seller.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        totalRevenue: sellerRevenue || 0,
        totalCommission: sellerCommission || 0,
        totalPayout: sellerPayout || 0,
        orderCount: orderCount || 0,
        productCount: seller.products ? seller.products.length : 0,
        activeProductCount: seller.products ? seller.products.filter((p: any) => p.isActive).length : 0,
        recentTransactions: recentTransactions || []
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
      // Calculate total from order items since we need the actual total
      const orderTotal = order.orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      
      // Calculate amounts for accurate financial reporting
      const totalCommission = orderTotal * 0.1 // 10% commission on full price with VAT
      const sellerPayout = orderTotal * 0.9 // 90% to seller from full price with VAT
      const orderTotalBeforeVAT = orderTotal / 1.18
      const vatAmount = orderTotal - orderTotalBeforeVAT
      
      return {
        id: order.id,
        type: 'order',
        customer: order.customer?.name || order.customer?.email || 'Unknown Customer',
        totalAmount: orderTotal,
        totalAmountBeforeVAT: orderTotalBeforeVAT,
        commission: totalCommission,
        sellerPayout: sellerPayout,
        vatAmount: vatAmount,
        date: order.createdAt.toISOString().split('T')[0],
        status: 'completed',
        items: order.orderItems.map((item: any) => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity || 0,
          price: item.price || 0,
          priceBeforeVAT: (item.price || 0) / 1.18,
          sellerName: item.product?.vendor?.name || 'Unknown Seller',
          sellerBusinessName: item.product?.vendor?.businessName || item.product?.vendor?.name || 'Unknown Business'
        }))
      }
    })

    // Calculate top performing sellers
    const topSellers = sellerFinancials.slice(0, 10)
    
    console.log('Admin financials - Total sellers found:', sellerFinancials.length)
    console.log('Admin financials - Sample seller data:', sellerFinancials.slice(0, 3))

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
