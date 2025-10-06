import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Flutterwave Payment Callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tx_ref = searchParams.get('tx_ref')
    const transaction_id = searchParams.get('transaction_id')

    if (!tx_ref) {
      return NextResponse.redirect(new URL('/checkout?error=missing_transaction_reference', request.url))
    }

    // Find order by transaction reference
    const order = await prisma.order.findFirst({
      where: {
        paymentId: tx_ref
      }
    })

    if (!order) {
      return NextResponse.redirect(new URL('/checkout?error=order_not_found', request.url))
    }

    if (status === 'successful') {
      // Update order status to completed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
          paymentId: transaction_id || tx_ref,
          updatedAt: new Date()
        }
      })

      return NextResponse.redirect(new URL('/orders?payment=success', request.url))
    } else {
      // Payment failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          updatedAt: new Date()
        }
      })

      return NextResponse.redirect(new URL('/checkout?payment=failed', request.url))
    }

  } catch (error) {
    console.error('Flutterwave callback error:', error)
    return NextResponse.redirect(new URL('/checkout?error=payment_error', request.url))
  }
}
