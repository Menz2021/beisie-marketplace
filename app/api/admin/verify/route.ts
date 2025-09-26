import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/secure-session'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin verify called')
    console.log('Cookies:', request.cookies.getAll())
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    const adminSession = await requireAdmin(request)
    console.log('Admin session:', adminSession)
    
    if (!adminSession) {
      console.log('❌ No admin session found - checking individual steps:')
      
      // Check if admin_session cookie exists
      const adminCookie = request.cookies.get('admin_session')
      console.log('Admin cookie:', adminCookie)
      
      if (!adminCookie) {
        console.log('❌ No admin_session cookie found')
      } else {
        console.log('✅ Admin cookie found, checking token verification...')
        // Try to verify the token manually
        const { verifyToken } = await import('@/lib/secure-session')
        const session = await verifyToken(adminCookie.value)
        console.log('Manual token verification result:', session)
      }
      
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
