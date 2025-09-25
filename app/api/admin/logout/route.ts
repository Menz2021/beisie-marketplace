import { NextRequest, NextResponse } from 'next/server'
import { clearSecureCookie } from '@/lib/secure-session'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Admin logged out successfully'
    })
    
    // Clear the admin session cookie
    clearSecureCookie(response, 'admin_session')
    
    return response
    
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
