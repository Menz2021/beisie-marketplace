import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order can be cancelled (only pending orders)
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending orders can be cancelled' },
        { status: 400 }
      )
    }

    // Update order status to cancelled
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    // Restore inventory for cancelled items
    for (const item of updatedOrder.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
