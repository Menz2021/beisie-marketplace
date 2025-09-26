import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/secure-session'
import { z } from 'zod'

// Schema for updating seller profile
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().optional(),
  businessRegistration: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  bankAccount: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountName: z.string().optional()
  }).optional()
})

// Schema for notification settings
const notificationSettingsSchema = z.object({
  emailNotifications: z.object({
    newOrders: z.boolean(),
    lowStock: z.boolean(),
    payments: z.boolean(),
    promotions: z.boolean(),
    marketing: z.boolean()
  }),
  pushNotifications: z.object({
    newOrders: z.boolean(),
    lowStock: z.boolean(),
    payments: z.boolean(),
    promotions: z.boolean(),
    marketing: z.boolean()
  }),
  smsNotifications: z.object({
    newOrders: z.boolean(),
    lowStock: z.boolean(),
    payments: z.boolean(),
    promotions: z.boolean(),
    marketing: z.boolean()
  })
})

// Schema for security settings
const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean(),
  loginAlerts: z.boolean(),
  sessionTimeout: z.number().min(5).max(480), // 5 minutes to 8 hours
  lastPasswordChange: z.string().optional()
})

// Schema for holiday mode settings
const holidayModeSchema = z.object({
  isEnabled: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  message: z.string().optional(),
  autoDisable: z.boolean(),
  hideProducts: z.boolean(),
  showMessage: z.boolean()
})

// GET - Fetch seller settings
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get seller profile
    const seller = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        isVerified: true,
        isActive: true
      }
    })

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    // Get seller-specific data (if you have a separate seller table)
    // For now, we'll use the user table and add seller-specific fields
    const sellerProfile = {
      id: seller.id,
      name: seller.name || '',
      email: seller.email,
      phone: seller.phone || '',
      avatar: '', // You can add avatar field to user table later
      businessName: '', // You can add these fields to user table or create a seller profile table
      businessType: '',
      businessRegistration: '',
      address: '',
      city: '',
      country: '',
      website: '',
      description: '',
      joinedDate: seller.createdAt.toISOString().split('T')[0],
      verificationStatus: seller.isVerified ? 'verified' : 'pending',
      bankAccount: {
        bankName: '',
        accountNumber: '',
        accountName: ''
      }
    }

    // Default notification settings
    const notificationSettings = {
      emailNotifications: {
        newOrders: true,
        lowStock: true,
        payments: true,
        promotions: false,
        marketing: false
      },
      pushNotifications: {
        newOrders: true,
        lowStock: true,
        payments: true,
        promotions: true,
        marketing: false
      },
      smsNotifications: {
        newOrders: false,
        lowStock: true,
        payments: true,
        promotions: false,
        marketing: false
      }
    }

    // Default security settings
    const securitySettings = {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
      lastPasswordChange: '',
      activeSessions: 1
    }

    // Default holiday mode settings
    const holidayModeSettings = {
      isEnabled: false,
      startDate: '',
      endDate: '',
      message: 'We are currently on holiday and will be back soon. Thank you for your patience!',
      autoDisable: true,
      hideProducts: true,
      showMessage: true,
      previousHolidays: []
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: sellerProfile,
        notifications: notificationSettings,
        security: securitySettings,
        holidayMode: holidayModeSettings
      }
    })

  } catch (error) {
    console.error('Error fetching seller settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update seller settings
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'profile':
        const profileData = updateProfileSchema.parse(data)
        
        // Update user profile
        await prisma.user.update({
          where: { id: session.id },
          data: {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully'
        })

      case 'notifications':
        const notificationData = notificationSettingsSchema.parse(data)
        
        // Store notification settings (you might want to create a separate table for this)
        // For now, we'll just return success
        console.log('Notification settings updated:', notificationData)
        
        return NextResponse.json({
          success: true,
          message: 'Notification settings updated successfully'
        })

      case 'security':
        const securityData = securitySettingsSchema.parse(data)
        
        // Store security settings (you might want to create a separate table for this)
        console.log('Security settings updated:', securityData)
        
        return NextResponse.json({
          success: true,
          message: 'Security settings updated successfully'
        })

      case 'holidayMode':
        const holidayData = holidayModeSchema.parse(data)
        
        // Store holiday mode settings (you might want to create a separate table for this)
        console.log('Holiday mode settings updated:', holidayData)
        
        return NextResponse.json({
          success: true,
          message: 'Holiday mode settings updated successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid settings type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error updating seller settings:', error)
    
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
