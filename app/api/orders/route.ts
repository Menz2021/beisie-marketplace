import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = {
      customerId: userId
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, orderItems, shippingAddress, paymentMethod, couponCode } = body

    if (!customerId || !orderItems || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate totals
    let subtotal = 0
    let shippingCost = 0
    let tax = 0
    let discount = 0

    // Calculate subtotal from order items
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })
      if (product) {
        subtotal += product.price * item.quantity
      }
    }

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      })
      if (coupon && coupon.isActive && new Date() <= coupon.validUntil) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * coupon.value) / 100
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount)
          }
        } else {
          discount = coupon.value
        }
      }
    }

    // Calculate shipping (simplified - you might want to implement zone-based shipping)
    shippingCost = subtotal > 100000 ? 0 : 5000 // Free shipping over 100,000 UGX

    // Calculate tax (18% VAT)
    tax = (subtotal - discount) * 0.18

    const total = subtotal + shippingCost + tax - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
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

    // Clear user's cart after successful order
    await prisma.cartItem.deleteMany({
      where: { userId: customerId }
    })

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
