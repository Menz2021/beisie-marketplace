import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Fetch refunds for orders that contain products from this vendor
    const refunds = await prisma.refund.findMany({
      where: {
        order: {
          orderItems: {
            some: {
              product: {
                vendorId: vendorId
              }
            }
          }
        }
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include only relevant order items for this vendor
    const transformedRefunds = refunds.map(refund => ({
      id: refund.id,
      orderId: refund.orderId,
      amount: refund.amount,
      reason: refund.reason,
      type: refund.type,
      description: refund.description,
      status: refund.status,
      adminNotes: refund.adminNotes,
      requestedBy: refund.requestedBy,
      processedBy: refund.processedBy,
      processedAt: refund.processedAt,
      createdAt: refund.createdAt,
      updatedAt: refund.updatedAt,
      order: {
        id: refund.order.id,
        totalAmount: refund.order.total,
        customer: refund.order.customer,
        orderItems: refund.order.orderItems.filter(item => 
          item.product.vendor.id === vendorId
        ).map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.images?.[0] || '/images/placeholder.jpg'
          },
          quantity: item.quantity,
          price: item.price
        }))
      }
    }))

    return NextResponse.json({
      success: true,
      data: transformedRefunds
    })

  } catch (error) {
    console.error('Error fetching seller refunds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refunds' },
      { status: 500 }
    )
  }
}
