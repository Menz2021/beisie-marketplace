// Secure session management using HTTP-only cookies and JWT tokens
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export interface SecureSession {
  id: string
  email: string
  name: string
  role: string
  isVerified: boolean
  isActive: boolean
  exp: number
}

// Generate JWT token
export function generateToken(payload: Omit<SecureSession, 'exp'>): string {
  return jwt.sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, // 24 hours
    JWT_SECRET
  )
}

// Verify JWT token
export function verifyToken(token: string): SecureSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SecureSession
    return decoded
  } catch (error) {
    return null
  }
}

// Set secure HTTP-only cookie
export function setSecureCookie(response: NextResponse, token: string, name: string = 'session') {
  response.cookies.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })
}

// Get token from request cookies
export function getTokenFromRequest(request: NextRequest, name: string = 'session'): string | null {
  return request.cookies.get(name)?.value || null
}

// Clear secure cookie
export function clearSecureCookie(response: NextResponse, name: string = 'session') {
  response.cookies.set(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  })
}

// Middleware to check authentication
export function requireAuth(request: NextRequest): SecureSession | null {
  const token = getTokenFromRequest(request)
  if (!token) return null
  
  const session = verifyToken(token)
  if (!session || session.exp < Date.now() / 1000) return null
  
  return session
}

// Middleware to check admin authentication
export function requireAdmin(request: NextRequest): SecureSession | null {
  const session = requireAuth(request)
  if (!session || session.role !== 'ADMIN') return null
  
  return session
}

// Client-side session utilities (for non-sensitive operations)
export const clientSession = {
  // Check if user is logged in (client-side only)
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false
    return document.cookie.includes('session=')
  },
  
  // Logout (clear cookie via API call)
  logout: async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Redirect to login page
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if API call fails
      window.location.href = '/auth/login'
    }
  },
  
  // Admin logout
  adminLogout: async (): Promise<void> => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      // Redirect to admin login page
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Admin logout error:', error)
      // Force redirect even if API call fails
      window.location.href = '/admin/login'
    }
  }
}
