import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/secure-session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        isVerified: session.isVerified,
        isActive: session.isActive
      }
    })
    
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
