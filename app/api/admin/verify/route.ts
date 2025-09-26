import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/secure-session'

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdmin(request)
    
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      admin: {
        id: adminSession.id,
        email: adminSession.email,
        name: adminSession.name,
        role: adminSession.role,
        isVerified: adminSession.isVerified,
        isActive: adminSession.isActive,
        permissions: ['manage_users', 'manage_products', 'manage_orders', 'view_analytics']
      }
    })
    
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
