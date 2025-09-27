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
    
    // Check if user already exists (email or phone)
    const { prisma } = await import('@/lib/prisma')
    
    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingEmail) {
      return NextResponse.json(
        { 
          error: 'Email already registered',
          message: 'An account with this email address already exists. Please use a different email or try logging in.',
          field: 'email'
        },
        { status: 400 }
      )
    }
    
    // Check for existing phone number (if provided)
    if (validatedData.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: validatedData.phone }
      })
      
      if (existingPhone) {
        return NextResponse.json(
          { 
            error: 'Phone number already registered',
            message: 'An account with this phone number already exists. Please use a different phone number or try logging in.',
            field: 'phone'
          },
          { status: 400 }
        )
      }
    }
    
    // Create the user (initially unverified)
    const user = await registerUser(validatedData)
    
    // Try to generate confirmation token and send welcome email (optional)
    // This is wrapped in try-catch because email service might not be configured
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
        console.log('User created successfully but email confirmation failed')
      } else {
        console.log('Welcome email sent successfully')
      }
    } catch (error) {
      console.error('Email confirmation setup error:', error)
      console.log('User created successfully but email confirmation is disabled')
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    // Return more specific error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: [{ message: errorMessage }], // Make details an array to match frontend expectations
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
