import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch seller statistics
export async function GET(request: NextRequest) {
  try {
    // Get basic counts
    const [
      totalSellers,
      verifiedSellers,
      activeSellers,
      inactiveSellers
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.user.count({ where: { role: 'SELLER', isVerified: true } }),
      prisma.user.count({ where: { role: 'SELLER', isActive: true } }),
      prisma.user.count({ where: { role: 'SELLER', isActive: false } })
    ])

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentRegistrations = await prisma.user.count({
      where: {
        role: 'SELLER',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get top performing sellers by sales
    const topSellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      select: {
        id: true,
        name: true,
        businessName: true,
        email: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        orders: {
          where: { status: 'DELIVERED' },
          select: { total: true }
        },
        products: {
          select: { id: true, isActive: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    const topSellersWithStats = topSellers.map(seller => {
      const totalSales = seller.orders.reduce((sum, order) => sum + order.total, 0)
      const commissionEarned = totalSales * 0.15
      const activeProducts = seller.products.filter(p => p.isActive).length
      
      return {
        id: seller.id,
        name: seller.businessName || seller.name || 'Unnamed Business',
        email: seller.email,
        totalSales,
        commissionEarned,
        activeProducts,
        isActive: seller.isActive,
        isVerified: seller.isVerified,
        joinDate: seller.createdAt.toISOString().split('T')[0]
      }
    }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 5)

    // Get registration trends (last 7 days)
    const registrationTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))
      
      const count = await prisma.user.count({
        where: {
          role: 'SELLER',
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
      
      registrationTrends.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      })
    }

    // Get seller performance metrics
    const allSellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      select: {
        id: true,
        orders: {
          where: { status: 'DELIVERED' },
          select: { total: true }
        },
        products: {
          select: { id: true, isActive: true }
        }
      }
    })

    const totalRevenue = allSellers.reduce((sum, seller) => {
      return sum + seller.orders.reduce((orderSum, order) => orderSum + order.total, 0)
    }, 0)

    const totalCommission = totalRevenue * 0.15
    const averageSellerRevenue = allSellers.length > 0 ? totalRevenue / allSellers.length : 0

    const stats = {
      overview: {
        totalSellers,
        verifiedSellers,
        activeSellers,
        inactiveSellers,
        recentRegistrations
      },
      performance: {
        totalRevenue,
        totalCommission,
        averageSellerRevenue,
        topSellers: topSellersWithStats
      },
      trends: {
        registrationTrends
      }
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching seller statistics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

