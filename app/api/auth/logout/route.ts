import { NextRequest, NextResponse } from 'next/server'
import { clearSecureCookie } from '@/lib/secure-session'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
    // Clear the session cookie
    clearSecureCookie(response, 'session')
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
