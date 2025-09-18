import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for address update
const addressUpdateSchema = z.object({
  type: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  city: z.string().min(2, 'City must be at least 2 characters').optional(),
  district: z.string().min(2, 'District must be at least 2 characters').optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional()
})

// GET - Fetch specific address
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: userId
      }
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: address
    })

  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    // Validate the request body
    const validatedData = addressUpdateSchema.parse(body)

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: userId
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If this address is set as default, unset other default addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: userId,
          isDefault: true,
          id: { not: params.id }
        },
        data: {
          isDefault: false
        }
      })
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: {
        id: params.id
      },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    })

  } catch (error) {
    console.error('Error updating address:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: userId
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
