import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentConfig } from '@/lib/payment-config'

// Airtel Money Webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const config = getPaymentConfig()

    // Verify webhook signature (implement based on Airtel's webhook verification)
    // This is a simplified version - implement proper signature verification
    
    const { 
      reference, 
      transaction_id, 
      status, 
      amount, 
      currency,
      subscriber 
    } = body

    if (!reference || !transaction_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find order by reference (order ID)
    const order = await prisma.order.findUnique({
      where: { id: reference }
    })

    if (!order) {
      console.error(`Order not found for reference: ${reference}`)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order based on payment status
    let paymentStatus = 'PENDING'
    let orderStatus = order.status

    switch (status) {
      case 'SUCCESS':
        paymentStatus = 'COMPLETED'
        orderStatus = 'PROCESSING'
        break
      case 'FAILED':
        paymentStatus = 'FAILED'
        break
      case 'PENDING':
        paymentStatus = 'PENDING'
        break
    }

    // Update order in database
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentId: transaction_id,
        updatedAt: new Date()
      }
    })

    // Log payment confirmation
    console.log(`Airtel payment ${status} for order ${order.orderNumber}: ${transaction_id}`)

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Airtel webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
