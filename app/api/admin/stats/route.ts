import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}

// GET - Fetch admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Skip server-side authentication for now since session is client-side only
    // In production, you'd want to use JWT tokens or cookies for server-side auth
    
    // Get current month and last month dates
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get basic statistics
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      pendingApprovals,
      totalOrders,
      totalRevenue,
      pendingRefunds,
      activeDisputes,
      // Previous month data for comparison
      lastMonthUsers,
      lastMonthSellers,
      lastMonthProducts,
      lastMonthOrders,
      lastMonthRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.product.count(),
      prisma.product.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total: true }
      }).then(result => result._sum.total || 0),
      prisma.refund.count({ where: { status: 'PENDING' } }),
      prisma.refund.count({ where: { status: 'DISPUTED' } }),
      // Previous month data
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'SELLER',
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.product.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        },
        _sum: { total: true }
      }).then(result => result._sum.total || 0)
    ])

    // Calculate commission earned (15% of total revenue)
    const commissionEarned = totalRevenue * 0.15

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const userGrowthPercentage = calculatePercentageChange(totalUsers, lastMonthUsers)
    const sellerGrowthPercentage = calculatePercentageChange(totalSellers, lastMonthSellers)
    const productGrowthPercentage = calculatePercentageChange(totalProducts, lastMonthProducts)
    const orderGrowthPercentage = calculatePercentageChange(totalOrders, lastMonthOrders)
    const revenueGrowthPercentage = calculatePercentageChange(totalRevenue, lastMonthRevenue)

    // Get top sellers by revenue
    const topSellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      include: {
        orders: {
          where: { status: 'DELIVERED' },
          select: { total: true }
        }
      },
      take: 5
    })

    const topSellersWithStats = topSellers.map(seller => {
      const totalSales = seller.orders.reduce((sum, order) => sum + order.total, 0)
      const commission = totalSales * 0.15
      return {
        id: seller.id,
        name: seller.name || 'Unnamed Business',
        sales: seller.orders.length,
        revenue: totalSales,
        commission: commission
      }
    }).sort((a, b) => b.revenue - a.revenue)

    // Get recent activity (last 20 activities)
    const recentActivity: any[] = []
    
    // Recent user registrations
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    recentUsers.forEach(user => {
      recentActivity.push({
        id: `user-${user.id}`,
        type: 'new_user',
        message: `New ${user.role.toLowerCase()} registered: ${user.name || 'Unnamed'} (${user.email})`,
        timestamp: user.createdAt,
        status: 'info'
      })
    })

    // Recent product approvals/rejections
    const recentProducts = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      where: {
        approvalStatus: { in: ['APPROVED', 'REJECTED'] }
      },
      select: {
        id: true,
        name: true,
        approvalStatus: true,
        updatedAt: true
      }
    })

    recentProducts.forEach(product => {
      recentActivity.push({
        id: `product-${product.id}`,
        type: product.approvalStatus === 'APPROVED' ? 'product_approval' : 'product_rejected',
        message: `Product "${product.name}" ${product.approvalStatus.toLowerCase()}`,
        timestamp: product.updatedAt,
        status: product.approvalStatus === 'APPROVED' ? 'success' : 'error'
      })
    })

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true
      }
    })

    recentOrders.forEach(order => {
      recentActivity.push({
        id: `order-${order.id}`,
        type: 'new_order',
        message: `New order #${order.id} - ${new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0
        }).format(order.total)}`,
        timestamp: order.createdAt,
        status: 'info'
      })
    })

    // Recent refunds
    const recentRefunds = await prisma.refund.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderId: true,
        status: true,
        createdAt: true
      }
    })

    recentRefunds.forEach(refund => {
      recentActivity.push({
        id: `refund-${refund.id}`,
        type: 'refund',
        message: `Refund request for Order #${refund.orderId}`,
        timestamp: refund.createdAt,
        status: refund.status === 'PENDING' ? 'warning' : refund.status === 'APPROVED' ? 'success' : 'error'
      })
    })

    // Sort recent activity by timestamp and take the most recent 10
    const sortedRecentActivity = recentActivity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(activity => ({
        ...activity,
        timestamp: getRelativeTime(activity.timestamp)
      }))

    // Get sales data for the last 6 months
    const salesData = []
    for (let i = 5; i >= 0; i--) {
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
      
      salesData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthData._sum.total || 0,
        orders: monthData._count.id || 0
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        pendingApprovals,
        totalOrders,
        totalRevenue,
        pendingRefunds,
        activeDisputes,
        commissionEarned,
        topSellers: topSellersWithStats,
        recentActivity: sortedRecentActivity,
        salesData,
        // Percentage changes
        userGrowthPercentage,
        sellerGrowthPercentage,
        productGrowthPercentage,
        orderGrowthPercentage,
        revenueGrowthPercentage
      }
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
