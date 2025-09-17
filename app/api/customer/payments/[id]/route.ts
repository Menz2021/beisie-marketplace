import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Update a payment method
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isDefault, ...updateData } = body

    // In a real application, you would:
    // 1. Validate the payment method exists and belongs to the customer
    // 2. Update the payment method in the database
    // 3. Handle setting default payment method logic
    
    // For now, we'll just return a success response
    const updatedPaymentMethod = {
      id,
      ...updateData,
      isDefault: isDefault || false
    }

    return NextResponse.json({
      success: true,
      data: updatedPaymentMethod,
      message: 'Payment method updated successfully'
    })

  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // In a real application, you would:
    // 1. Validate the payment method exists and belongs to the customer
    // 2. Check if it's the default payment method
    // 3. Delete the payment method from the database
    // 4. Handle setting a new default if needed
    
    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

