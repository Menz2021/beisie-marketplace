import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentConfig } from '@/lib/payment-config'

// MTN Mobile Money Webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const config = getPaymentConfig()

    // Verify webhook signature (implement based on MTN's webhook verification)
    // This is a simplified version - implement proper signature verification
    
    const { 
      externalId, 
      financialTransactionId, 
      status, 
      amount, 
      currency,
      payer 
    } = body

    if (!externalId || !financialTransactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find order by external ID (order ID)
    const order = await prisma.order.findUnique({
      where: { id: externalId }
    })

    if (!order) {
      console.error(`Order not found for external ID: ${externalId}`)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order based on payment status
    let paymentStatus = 'PENDING'
    let orderStatus = order.status

    switch (status) {
      case 'SUCCESSFUL':
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
        paymentId: financialTransactionId,
        updatedAt: new Date()
      }
    })

    // Log payment confirmation
    console.log(`Payment ${status} for order ${order.orderNumber}: ${financialTransactionId}`)

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('MTN webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
