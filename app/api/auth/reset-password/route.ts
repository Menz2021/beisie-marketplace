import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = resetPasswordSchema.parse(body)
    
    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    
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
