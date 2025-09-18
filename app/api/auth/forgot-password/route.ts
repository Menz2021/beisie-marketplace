import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = forgotPasswordSchema.parse(body)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Store reset token in database
    // Note: In a real application, you might want to create a separate PasswordResetToken model
    // For now, we'll store it in a simple way
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // We'll need to add these fields to the User model
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry
      }
    })
    
    // In a real application, you would send an email here
    // For demo purposes, we'll just log the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
    
    console.log('Password reset link for', user.email, ':', resetLink)
    
    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetLink)
    
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    
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
