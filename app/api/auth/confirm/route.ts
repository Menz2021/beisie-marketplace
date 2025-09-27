import { NextRequest, NextResponse } from 'next/server'
import { verifyConfirmationToken } from '@/lib/confirmation'
import { z } from 'zod'

// Validation schema
const confirmSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = confirmSchema.parse(body)
    
    // Verify the confirmation token
    const result = await verifyConfirmationToken(validatedData.token)
    
    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        isVerified: result.user?.isVerified
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Email confirmation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid token format', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


