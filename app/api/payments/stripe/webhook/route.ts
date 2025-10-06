import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentConfig } from '@/lib/payment-config'

// Stripe Webhook for Visa/Mastercard payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const config = getPaymentConfig()
    
    // Verify webhook signature
    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // In a real implementation, you would verify the signature using Stripe's webhook secret
    // const event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret)
    
    // For now, we'll parse the JSON directly
    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.orderId
    if (!orderId) {
      console.error('No order ID in payment intent metadata')
      return
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      console.error(`Order not found: ${orderId}`)
      return
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'PROCESSING',
        paymentId: paymentIntent.id,
        updatedAt: new Date()
      }
    })

    console.log(`Payment succeeded for order ${order.orderNumber}: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.orderId
    if (!orderId) return

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) return

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'FAILED',
        paymentId: paymentIntent.id,
        updatedAt: new Date()
      }
    })

    console.log(`Payment failed for order ${order.orderNumber}: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.orderId
    if (!orderId) return

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) return

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
        paymentId: paymentIntent.id,
        updatedAt: new Date()
      }
    })

    console.log(`Payment canceled for order ${order.orderNumber}: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}
