import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }
    
    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
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
    
    return NextResponse.json({
      success: true,
      message: 'Reset token is valid'
    })
    
  } catch (error) {
    console.error('Validate reset token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
