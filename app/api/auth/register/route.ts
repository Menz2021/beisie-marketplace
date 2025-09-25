import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { emailService } from '@/lib/email'
import { createConfirmationToken } from '@/lib/confirmation'
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
    
    // Create the user (initially unverified)
    const user = await registerUser(validatedData)
    
    // Try to generate confirmation token and send welcome email (optional)
    try {
      const confirmationData = await createConfirmationToken(user.id, user.email, 'customer')
      
      // Send welcome email with confirmation link
      const emailResult = await emailService.sendWelcomeEmail(
        user.email,
        user.name || 'User',
        confirmationData.token,
        'customer'
      )
      
      if (!emailResult.success) {
        console.error('Failed to send welcome email:', emailResult.error)
      }
    } catch (error) {
      console.error('Email confirmation setup error:', error)
      console.log('Email confirmation disabled - user created without email verification')
      // Continue with registration even if email confirmation fails
    }
    
    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
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
