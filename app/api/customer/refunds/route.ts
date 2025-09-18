import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Schema for refund request validation
const refundRequestSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  reason: z.string().min(1, 'Refund reason is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  type: z.enum(['FULL', 'PARTIAL']),
  description: z.string().optional()
})

// GET /api/customer/refunds - Get customer's refund requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const refunds = await prisma.refund.findMany({
      where: { requestedBy: customerId },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true
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

    return NextResponse.json({
      success: true,
      data: refunds
    })
  } catch (error) {
    console.error('Error fetching customer refunds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refunds' },
      { status: 500 }
    )
  }
}

// POST /api/customer/refunds - Create a new refund request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = refundRequestSchema.parse(body)

    // Verify order exists and belongs to customer
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if refund amount is valid
    if (validatedData.amount > order.total) {
      return NextResponse.json(
        { success: false, error: 'Refund amount cannot exceed order total' },
        { status: 400 }
      )
    }

    // Check if order is eligible for refund (not already refunded, not too old, etc.)
    const existingRefund = await prisma.refund.findFirst({
      where: { 
        orderId: validatedData.orderId,
        status: { in: ['PENDING', 'APPROVED', 'PROCESSED'] }
      }
    })

    if (existingRefund) {
      return NextResponse.json(
        { success: false, error: 'Refund request already exists for this order' },
        { status: 400 }
      )
    }

    // Check if order is too old (e.g., more than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    if (order.createdAt < thirtyDaysAgo) {
      return NextResponse.json(
        { success: false, error: 'Refund request is too late. Orders must be refunded within 30 days.' },
        { status: 400 }
      )
    }

    // Create refund request
    const refund = await prisma.refund.create({
      data: {
        orderId: validatedData.orderId,
        amount: validatedData.amount,
        reason: validatedData.reason,
        type: validatedData.type,
        description: validatedData.description,
        status: 'PENDING',
        requestedBy: order.customerId
      },
      include: {
        order: {
          include: {
            customer: true,
            orderItems: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: refund,
      message: 'Refund request submitted successfully. We will review it within 2-3 business days.'
    })
  } catch (error) {
    console.error('Error creating refund request:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create refund request' },
      { status: 500 }
    )
  }
}
