import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, requireAuth } from '@/lib/secure-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const adminSession = requireAdmin(request)
    
    if (!adminSession) {
      // Redirect to admin login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // Protected user routes
  if (pathname.startsWith('/account') || pathname.startsWith('/orders') || pathname.startsWith('/wishlist')) {
    const userSession = requireAuth(request)
    
    if (!userSession) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/orders/:path*',
    '/wishlist/:path*'
  ]
}
