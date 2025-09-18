import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch customer payment methods and payment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Get customer's orders with payment information
    const orders = await prisma.order.findMany({
      where: {
        customerId: customerId
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform orders into payment history
    const paymentHistory = orders.map(order => ({
      id: order.id,
      orderNumber: order.id,
      amount: order.total,
      method: order.paymentMethod || 'Unknown',
      status: order.paymentStatus === 'COMPLETED' ? 'completed' : 
              order.paymentStatus === 'PENDING' ? 'pending' : 'failed',
      date: order.createdAt.toISOString().split('T')[0],
      description: `Order payment - ${order.orderItems.map(item => item.product.name).join(', ')}`,
      orderStatus: order.status
    }))

    // For now, we'll return empty payment methods since we don't have a payment methods table
    // In a real application, you would have a separate PaymentMethod model
    const paymentMethods: any[] = []

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods,
        paymentHistory
      }
    })

  } catch (error) {
    console.error('Error fetching customer payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a new payment method (placeholder implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, type, provider, cardNumber, expiryDate, cvv, cardHolderName, phoneNumber, isDefault } = body

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Validate the payment method data
    // 2. Encrypt sensitive information (card numbers, CVV)
    // 3. Store in a PaymentMethod table
    // 4. Integrate with payment processors for validation
    
    // For now, we'll just return a success response
    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type,
      provider,
      lastFour: cardNumber ? cardNumber.slice(-4) : undefined,
      isDefault: isDefault || false,
      expiryDate,
      cardHolderName,
      phoneNumber
    }

    return NextResponse.json({
      success: true,
      data: newPaymentMethod,
      message: 'Payment method added successfully'
    })

  } catch (error) {
    console.error('Error adding payment method:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

