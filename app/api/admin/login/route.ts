import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { generateToken, setSecureCookie } from '@/lib/secure-session'
import { z } from 'zod'

// Validation schema
const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = adminLoginSchema.parse(body)
    
    // Attempt to login the user
    const user = await loginUser(validatedData)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }
    
    // Generate secure JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive
    })
    
    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        permissions: ['manage_users', 'manage_products', 'manage_orders', 'view_analytics']
      }
    }, { status: 200 })
    
    // Set secure HTTP-only cookie
    setSecureCookie(response, token, 'admin_session')
    
    return response
    
  } catch (error) {
    console.error('Admin login error:', error)
    
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
