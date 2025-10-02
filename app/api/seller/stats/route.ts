import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch seller dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query params (in a real app, this would come from authentication)
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')
    
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Get seller's products count
    const totalProducts = await prisma.product.count({
      where: { vendorId: sellerId }
    })

    // Get seller's orders count (this week)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weeklyOrders = await prisma.order.count({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: sellerId
            }
          }
        },
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })

    // Get seller's revenue (this week)
    const weeklyOrdersData = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: sellerId
            }
          }
        },
        createdAt: {
          gte: oneWeekAgo
        }
      },
      include: {
        orderItems: {
          where: {
            product: {
              vendorId: sellerId
            }
          }
        }
      }
    })

    const weeklyRevenue = weeklyOrdersData.reduce((total, order) => {
      const sellerItems = order.orderItems
      // Calculate total revenue from seller's products (full price with VAT)
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return total + sellerTotal
    }, 0)

    // Calculate amount to be paid (90% after 10% commission)
    const amountToBePaid = weeklyRevenue * 0.9

    // Get pending orders
    const pendingOrders = await prisma.order.count({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: sellerId
            }
          }
        },
        status: {
          in: ['PENDING', 'PROCESSING']
        }
      }
    })

    // Get low stock products (stock < 10)
    const lowStockProducts = await prisma.product.count({
      where: {
        vendorId: sellerId,
        stock: {
          lt: 10
        },
        isActive: true
      }
    })

    // Get recent products for the seller
    const recentProducts = await prisma.product.findMany({
      where: { vendorId: sellerId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        images: true,
        createdAt: true,
        _count: {
          select: {
            orderItems: {
              where: {
                order: {
                  status: 'DELIVERED'
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Get recent orders for the seller
    const recentOrders = await prisma.order.findMany({
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
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Calculate total sales count for each product
    const productsWithSales = recentProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      sales: product._count.orderItems,
      status: product.stock < 10 ? 'low_stock' : product.isActive ? 'active' : 'inactive',
      image: product.images ? JSON.parse(product.images)[0] : '/api/placeholder/100/100',
      createdAt: product.createdAt
    }))

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => {
      const sellerItems = order.orderItems
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        id: order.id,
        orderNumber: order.id,
        customer: order.customer?.name || 'Unknown Customer',
        total: sellerTotal,
        status: order.status.toLowerCase(),
        date: order.createdAt.toISOString().split('T')[0],
        items: sellerItems.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        }))
      }
    })

    // Get sales data for the last 6 months
    const salesData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthOrders = await prisma.order.findMany({
        where: {
          orderItems: {
            some: {
              product: {
                vendorId: sellerId
              }
            }
          },
          status: 'DELIVERED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        include: {
          orderItems: {
            where: {
              product: {
                vendorId: sellerId
              }
            }
          }
        }
      })

      const monthRevenue = monthOrders.reduce((total, order) => {
        const sellerItems = order.orderItems
        const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        return total + sellerTotal
      }, 0)

      const monthOrderCount = monthOrders.length

      salesData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
        orders: monthOrderCount
      })
    }

    const stats = {
      totalProducts,
      weeklyOrders,
      weeklyRevenue,
      amountToBePaid,
      pendingOrders,
      lowStockProducts,
      recentProducts: productsWithSales,
      recentOrders: formattedRecentOrders,
      salesData
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching seller stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
