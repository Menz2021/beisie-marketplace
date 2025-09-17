import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 })
    }

    // Get orders that contain products from this vendor
    const where: any = {
      orderItems: {
        some: {
          product: {
            vendorId: vendorId
          }
        }
      }
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  vendor: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            },
            where: {
              product: {
                vendorId: vendorId
              }
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    // Filter order items to only show items from this vendor
    const filteredOrders = orders.map(order => ({
      ...order,
      orderItems: order.orderItems.filter(item => item.product.vendorId === vendorId)
    }))

    return NextResponse.json({
      success: true,
      data: filteredOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, vendorId, notes } = body

    if (!orderId || !status || !vendorId) {
      return NextResponse.json(
        { error: 'Order ID, status, and vendor ID are required' },
        { status: 400 }
      )
    }

    // Validate status - sellers can only update to READY_TO_SHIP or CANCEL
    const validStatuses = ['READY_TO_SHIP', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Sellers can only update to READY_TO_SHIP or CANCELLED' },
        { status: 400 }
      )
    }

    // First, verify that this order contains items from this vendor
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        orderItems: {
          some: {
            product: {
              vendorId: vendorId
            }
          }
        }
      },
      include: {
        orderItems: {
          where: {
            product: {
              vendorId: vendorId
            }
          },
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or does not contain items from this vendor' },
        { status: 404 }
      )
    }

    // Check if order is in a valid state for seller updates
    const validCurrentStatuses = ['PENDING', 'PROCESSING']
    if (!validCurrentStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot update order status from ${order.status}. Only PENDING and PROCESSING orders can be updated by sellers.` },
        { status: 400 }
      )
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        updatedAt: new Date()
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                vendor: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          where: {
            product: {
              vendorId: vendorId
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    // If status is CANCELLED, we might want to handle inventory updates
    if (status === 'CANCELLED') {
      // Restore inventory for cancelled items
      for (const item of updatedOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
    }

    // Transform the response to match the expected format
    const transformedOrder = {
      ...updatedOrder,
      orderItems: updatedOrder.orderItems.filter(item => item.product.vendorId === vendorId)
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder,
      message: `Order status updated to ${status}`
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}