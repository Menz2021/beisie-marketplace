import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify admin authentication
    // 2. Query your database for refunds
    // 3. Apply filters, pagination, etc.
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const date = searchParams.get('date')
    const seller = searchParams.get('seller')

    // Build where clause for filtering
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { order: { customer: { name: { contains: search, mode: 'insensitive' } } } },
        { order: { customer: { email: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    // Date filter
    if (date && date !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (date) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
          break
        default:
          startDate = new Date(0)
      }
      
      where.createdAt = {
        gte: startDate
      }
    }

    // Seller filter
    if (seller && seller !== 'all') {
      where.order = {
        ...where.order,
        orderItems: {
          some: {
            product: {
              vendor: {
                name: { contains: seller, mode: 'insensitive' }
              }
            }
          }
        }
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.refund.count({ where })

    // Fetch refunds with pagination
    const refunds = await prisma.refund.findMany({
      where,
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
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
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Transform data to match expected format
    const transformedRefunds = refunds.map(refund => ({
      id: refund.id,
      orderId: refund.orderId,
      customer: {
        id: refund.order.customer.id,
        name: refund.order.customer.name,
        email: refund.order.customer.email,
        phone: refund.order.customer.phone
      },
      amount: refund.amount,
      reason: refund.reason,
      type: refund.type,
      status: refund.status,
      createdAt: refund.createdAt.toISOString(),
      updatedAt: refund.updatedAt?.toISOString(),
      adminNotes: refund.adminNotes || '',
      order: {
        id: refund.order.id,
        totalAmount: refund.order.total,
        items: refund.order.orderItems.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.images?.[0] || '/images/placeholder.jpg'
          },
          quantity: item.quantity,
          price: item.price
        })),
        seller: refund.order.orderItems[0]?.product.vendor ? {
          id: refund.order.orderItems[0].product.vendor.id,
          name: refund.order.orderItems[0].product.vendor.name,
          email: refund.order.orderItems[0].product.vendor.email
        } : null
      },
      attachments: [] // TODO: Add attachments support if needed
    }))

    return NextResponse.json({
      success: true,
      data: transformedRefunds,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching refunds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refunds' },
      { status: 500 }
    )
  }
}