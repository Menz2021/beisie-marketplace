import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const seller = searchParams.get('seller')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (seller) {
      where.orderItems = {
        some: {
          product: {
            vendor: {
              name: {
                contains: seller,
                mode: 'insensitive'
              }
            }
          }
        }
      }
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } }
      ]
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

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, trackingNumber, estimatedDelivery } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 })
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery)
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        title: 'Order Status Update',
        message: `Your order ${order.orderNumber} status has been updated to ${status}`,
        type: 'ORDER_UPDATE',
        data: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: status
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}