import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface User {
  id: string
  email: string
  phone?: string
  name?: string
  role: string
  avatar?: string
  isVerified: boolean
  isActive: boolean
  language: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  phone?: string
  name: string
  password: string
  role?: string
}

export interface SocialLoginData {
  email: string
  name: string
  avatar?: string
  provider: 'google' | 'facebook'
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Register new user
export async function registerUser(data: RegisterData): Promise<User> {
  const hashedPassword = await hashPassword(data.password)
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      password: hashedPassword,
      role: data.role || 'CUSTOMER',
      isVerified: false, // Users need to confirm email
      isActive: true,
      language: 'en'
    }
  })

  return {
    id: user.id,
    email: user.email,
    phone: user.phone || undefined,
    name: user.name || undefined,
    role: user.role,
    avatar: user.avatar || undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
    language: user.language
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  })

  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(credentials.password, user.password)
  
  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    phone: user.phone || undefined,
    name: user.name || undefined,
    role: user.role,
    avatar: user.avatar || undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
    language: user.language
  }
}

// Social login
export async function socialLogin(data: SocialLoginData): Promise<User> {
  let user = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (!user) {
    // Create new user for social login
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: '', // No password for social login
        role: 'CUSTOMER',
        avatar: data.avatar,
        isVerified: true, // Social logins are considered verified
        isActive: true,
        language: 'en'
      }
    })
  } else {
    // Update existing user with social login data
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        avatar: data.avatar || user.avatar,
        isVerified: true
      }
    })
  }

  return {
    id: user.id,
    email: user.email,
    phone: user.phone || undefined,
    name: user.name || undefined,
    role: user.role,
    avatar: user.avatar || undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
    language: user.language
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    phone: user.phone || undefined,
    name: user.name || undefined,
    role: user.role,
    avatar: user.avatar || undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
    language: user.language
  }
}

// Update user profile
export async function updateUserProfile(id: string, data: Partial<User>): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      avatar: data.avatar,
      language: data.language
    }
  })

  return {
    id: user.id,
    email: user.email,
    phone: user.phone || undefined,
    name: user.name || undefined,
    role: user.role,
    avatar: user.avatar || undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
    language: user.language
  }
}

// Check if email exists
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  return !!user
}

// Check if phone exists
export async function phoneExists(phone: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { phone }
  })
  return !!user
}
