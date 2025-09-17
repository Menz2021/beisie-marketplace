import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Validation schema for seller registration
const sellerRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters').optional(),
  businessType: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional()
})

// POST - Register a new seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the registration data
    const validatedData = sellerRegistrationSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create the seller
    const seller = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: 'SELLER',
        isActive: false, // Sellers need approval to be active
        isVerified: false,
        // Store additional seller information
        businessName: validatedData.businessName,
        businessType: validatedData.businessType,
        district: validatedData.district,
        address: validatedData.address
      }
    })
    
    // In a real application, you might want to:
    // 1. Send a welcome email
    // 2. Send notification to admin about new seller application
    // 3. Create seller profile with additional business information
    
    return NextResponse.json({
      success: true,
      message: 'Seller registration successful. Your application is pending approval.',
      data: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        status: 'pending', // Default status since User model doesn't have status field
        verificationStatus: seller.isVerified ? 'verified' : 'pending'
      }
    })
    
  } catch (error) {
    console.error('Error registering seller:', error)
    
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

