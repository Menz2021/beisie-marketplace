import { NextRequest, NextResponse } from 'next/server'
import { PaymentFactory, PaymentRequest } from '@/lib/payments'
import { getPaymentConfig, validatePaymentConfig } from '@/lib/payment-config'
import { prisma } from '@/lib/prisma'

// POST - Initiate payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentMethod, amount, currency, customerPhone, customerEmail, description } = body

    // Validate required fields
    if (!orderId || !paymentMethod || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, paymentMethod, amount, currency' },
        { status: 400 }
      )
    }

    // Validate payment configuration
    const configValidation = validatePaymentConfig()
    if (!configValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Payment configuration incomplete', 
          details: configValidation.errors 
        },
        { status: 500 }
      )
    }

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is already paid
    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      )
    }

    // Get payment configuration
    const config = getPaymentConfig()

    // Create payment request
    const paymentRequest: PaymentRequest = {
      amount,
      currency,
      orderId,
      customerPhone: customerPhone || order.customer.phone,
      customerEmail: customerEmail || order.customer.email,
      description: description || `Payment for order ${order.orderNumber}`
    }

    // Initiate payment based on method
    let paymentResponse
    try {
      switch (paymentMethod) {
        case 'MTN_MOBILE_MONEY':
          const mtnProvider = PaymentFactory.createPaymentProvider('MTN_MOBILE_MONEY', config.mtn) as any
          paymentResponse = await mtnProvider.initiatePayment(paymentRequest)
          break
        case 'AIRTEL_MONEY':
          const airtelProvider = PaymentFactory.createPaymentProvider('AIRTEL_MONEY', config.airtel) as any
          paymentResponse = await airtelProvider.initiatePayment(paymentRequest)
          break
        case 'FLUTTERWAVE':
          const flutterwaveProvider = PaymentFactory.createPaymentProvider('FLUTTERWAVE', config.flutterwave) as any
          paymentResponse = await flutterwaveProvider.initiatePayment(paymentRequest)
          break
        case 'VISA':
        case 'MASTERCARD':
          const stripeProvider = PaymentFactory.createPaymentProvider('VISA', config.stripe) as any
          paymentResponse = await stripeProvider.createPaymentIntent(
            paymentRequest.amount,
            paymentRequest.currency,
            paymentRequest.orderId
          )
          break
        default:
          return NextResponse.json(
            { error: 'Unsupported payment method' },
            { status: 400 }
          )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to initialize payment provider' },
        { status: 500 }
      )
    }

    if (!paymentResponse.success) {
      return NextResponse.json(
        { 
          error: 'Payment initiation failed', 
          message: paymentResponse.message 
        },
        { status: 400 }
      )
    }

    // Update order with payment information
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: paymentResponse.transactionId,
        paymentStatus: 'PENDING',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        transactionId: paymentResponse.transactionId,
        status: paymentResponse.status,
        message: paymentResponse.message,
        paymentUrl: paymentResponse.paymentUrl
      }
    })

  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Check payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')
    const orderId = searchParams.get('orderId')

    if (!transactionId && !orderId) {
      return NextResponse.json(
        { error: 'transactionId or orderId is required' },
        { status: 400 }
      )
    }

    // Get order from database
    let order
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId }
      })
    } else if (transactionId) {
      order = await prisma.order.findFirst({
        where: { paymentId: transactionId }
      })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get payment configuration
    const config = getPaymentConfig()

    // Create appropriate payment provider based on payment method
    let paymentProvider
    try {
      switch (order.paymentMethod) {
        case 'MTN_MOBILE_MONEY':
          paymentProvider = PaymentFactory.createPaymentProvider('MTN_MOBILE_MONEY', config.mtn)
          break
        case 'AIRTEL_MONEY':
          paymentProvider = PaymentFactory.createPaymentProvider('AIRTEL_MONEY', config.airtel)
          break
        case 'VISA':
        case 'MASTERCARD':
          paymentProvider = PaymentFactory.createPaymentProvider('VISA', config.stripe)
          break
        default:
          return NextResponse.json(
            { error: 'Unsupported payment method' },
            { status: 400 }
          )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to initialize payment provider' },
        { status: 500 }
      )
    }

    // Check payment status
    const statusResponse = await (paymentProvider as any).checkPaymentStatus(order.paymentId!)

    // Update order status if payment is completed
    if (statusResponse.success && statusResponse.status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
          updatedAt: new Date()
        }
      })
    } else if (statusResponse.status === 'FAILED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: statusResponse.status,
        orderStatus: order.status,
        message: statusResponse.message
      }
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
