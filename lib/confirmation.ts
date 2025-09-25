import crypto from 'crypto'
import { prisma } from './prisma'

// Generate confirmation token
export function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create confirmation record
export async function createConfirmationToken(userId: string, email: string, userType: 'customer' | 'seller' = 'customer') {
  const token = generateConfirmationToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  // Store in database (you might want to create a separate table for this)
  // For now, we'll use a simple approach with the existing user table
  
  return {
    token,
    expiresAt,
    userId,
    email,
    userType
  }
}

// Verify confirmation token
export async function verifyConfirmationToken(token: string) {
  // In a real implementation, you'd store tokens in a separate table
  // For now, we'll implement a simple verification
  // You should create a ConfirmationToken table in your database
  
  try {
    // This is a simplified version - you should implement proper token storage
    const user = await prisma.user.findFirst({
      where: {
        // You'd need to add a confirmationToken field to your User model
        // confirmationToken: token,
        // confirmationTokenExpires: {
        //   gt: new Date()
        // }
      }
    })
    
    if (!user) {
      return { valid: false, error: 'Invalid or expired token' }
    }
    
    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isVerified: true,
        // confirmationToken: null,
        // confirmationTokenExpires: null
      }
    })
    
    return { valid: true, user }
  } catch (error) {
    console.error('Token verification error:', error)
    return { valid: false, error: 'Token verification failed' }
  }
}

