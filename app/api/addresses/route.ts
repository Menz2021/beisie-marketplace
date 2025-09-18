import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for address
const addressSchema = z.object({
  type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  district: z.string().min(2, 'District must be at least 2 characters'),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false)
})

// GET - Fetch user addresses
export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (you might want to implement proper auth)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: userId
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: addresses
    })

  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
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
    const validatedData = addressSchema.parse(body)

    // If this address is set as default, unset other default addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: userId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Create the address
    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: userId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      data: address
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating address:', error)
    
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
