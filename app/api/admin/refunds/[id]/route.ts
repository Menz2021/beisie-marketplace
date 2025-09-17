import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you would:
    // 1. Verify admin authentication
    // 2. Validate the request body
    // 3. Update the refund in your database
    // 4. Send notifications to customer and seller
    // 5. Log the action for audit purposes

    const { id } = params
    const body = await request.json()
    const { status, adminNotes } = body

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find and update the refund
    const updatedRefund = await prisma.refund.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || undefined,
        updatedAt: new Date()
      },
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
      }
    })

    // Transform data to match expected format
    const transformedRefund = {
      id: updatedRefund.id,
      orderId: updatedRefund.orderId,
      customer: {
        id: updatedRefund.order.customer.id,
        name: updatedRefund.order.customer.name,
        email: updatedRefund.order.customer.email,
        phone: updatedRefund.order.customer.phone
      },
      amount: updatedRefund.amount,
      reason: updatedRefund.reason,
      type: updatedRefund.type,
      status: updatedRefund.status,
      createdAt: updatedRefund.createdAt.toISOString(),
      updatedAt: updatedRefund.updatedAt?.toISOString(),
      adminNotes: updatedRefund.adminNotes || '',
      order: {
        id: updatedRefund.order.id,
        totalAmount: updatedRefund.order.total,
        items: updatedRefund.order.orderItems.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.images?.[0] || '/images/placeholder.jpg'
          },
          quantity: item.quantity,
          price: item.price
        })),
        seller: updatedRefund.order.orderItems[0]?.product.vendor ? {
          id: updatedRefund.order.orderItems[0].product.vendor.id,
          name: updatedRefund.order.orderItems[0].product.vendor.name,
          email: updatedRefund.order.orderItems[0].product.vendor.email
        } : null
      },
      attachments: [] // TODO: Add attachments support if needed
    }

    // In a real app, you would also:
    // - Send email notification to customer
    // - Send notification to seller
    // - Update order status if needed
    // - Process payment refund if approved
    // - Log the action

    return NextResponse.json({
      success: true,
      data: transformedRefund,
      message: 'Refund status updated successfully'
    })
  } catch (error) {
    console.error('Error updating refund:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update refund' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you would:
    // 1. Verify admin authentication
    // 2. Query your database for the specific refund

    const { id } = params
    const refund = await prisma.refund.findUnique({
      where: { id },
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
      }
    })

    if (!refund) {
      return NextResponse.json(
        { success: false, error: 'Refund not found' },
        { status: 404 }
      )
    }

    // Transform data to match expected format
    const transformedRefund = {
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
    }

    return NextResponse.json({
      success: true,
      data: transformedRefund
    })
  } catch (error) {
    console.error('Error fetching refund:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refund' },
      { status: 500 }
    )
  }
}