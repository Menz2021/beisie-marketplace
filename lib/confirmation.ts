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
  
  // Store token in database
  const confirmationToken = await prisma.confirmationToken.create({
    data: {
      token,
      userId,
      email,
      type: 'EMAIL_CONFIRMATION',
      expiresAt
    }
  })
  
  return {
    token: confirmationToken.token,
    expiresAt: confirmationToken.expiresAt,
    userId: confirmationToken.userId,
    email: confirmationToken.email,
    userType
  }
}

// Verify confirmation token
export async function verifyConfirmationToken(token: string) {
  try {
    // Find the token in database
    const confirmationToken = await prisma.confirmationToken.findUnique({
      where: { token },
      include: { user: true }
    })
    
    if (!confirmationToken) {
      return { valid: false, error: 'Invalid token' }
    }
    
    // Check if token is expired
    if (confirmationToken.expiresAt < new Date()) {
      return { valid: false, error: 'Token has expired' }
    }
    
    // Check if token is already used
    if (confirmationToken.used) {
      return { valid: false, error: 'Token has already been used' }
    }
    
    // Mark token as used
    await prisma.confirmationToken.update({
      where: { id: confirmationToken.id },
      data: { used: true }
    })
    
    // Mark user as verified
    await prisma.user.update({
      where: { id: confirmationToken.userId },
      data: { isVerified: true }
    })
    
    return { valid: true, user: confirmationToken.user }
  } catch (error) {
    console.error('Token verification error:', error)
    return { valid: false, error: 'Token verification failed' }
  }
}

// Clean up expired tokens (can be run as a cron job)
export async function cleanupExpiredTokens() {
  try {
    const result = await prisma.confirmationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    console.log(`Cleaned up ${result.count} expired tokens`)
    return result.count
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
    return 0
  }
}

