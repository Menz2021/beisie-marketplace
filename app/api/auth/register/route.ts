import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional().default('CUSTOMER')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const { prisma } = await import('@/lib/prisma')
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create the user
    const user = await registerUser(validatedData)
    
    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    
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
