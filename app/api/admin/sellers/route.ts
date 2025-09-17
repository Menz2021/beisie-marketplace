import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for seller status update
const sellerStatusSchema = z.object({
  status: z.enum(['approved', 'pending', 'suspended', 'rejected']),
  verificationStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  reason: z.string().optional()
})

// GET - Fetch all sellers with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const verificationStatus = searchParams.get('verification')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      role: 'SELLER'
    }

    // Note: We'll filter by status after fetching since status is computed
    // For now, we'll filter by isActive and isVerified directly
    if (status && status !== 'All Status') {
      if (status === 'approved') {
        where.isActive = true
        where.isVerified = true
      } else if (status === 'pending') {
        where.isActive = false
        where.isVerified = false
      } else if (status === 'suspended') {
        where.isActive = false
      }
    }

    if (verificationStatus && verificationStatus !== 'All Verification') {
      if (verificationStatus === 'verified') {
        where.isVerified = true
      } else if (verificationStatus === 'pending') {
        where.isVerified = false
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get sellers with pagination
    const [sellers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          products: {
            select: {
              id: true,
              isActive: true
            }
          },
          orders: {
            select: {
              id: true,
              total: true,
              status: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Transform data to match frontend expectations
    const transformedSellers = sellers.map(seller => {
      const totalProducts = seller.products.length
      const activeProducts = seller.products.filter(p => p.isActive).length
      const totalSales = seller.orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.total, 0)
      const commissionEarned = totalSales * 0.15 // 15% commission

      // Determine status based on isActive and isVerified
      let status = 'pending'
      if (seller.isActive && seller.isVerified) {
        status = 'approved'
      } else if (!seller.isActive && !seller.isVerified) {
        status = 'pending'
      } else if (!seller.isActive) {
        status = 'suspended'
      }

      return {
        id: seller.id,
        businessName: seller.businessName || seller.name || 'Unnamed Business',
        contactPerson: seller.name || 'Unknown',
        email: seller.email,
        phone: seller.phone || 'Not provided',
        status: status,
        verificationStatus: seller.isVerified ? 'verified' : 'pending',
        joinDate: seller.createdAt.toISOString().split('T')[0],
        totalProducts: activeProducts,
        totalSales: totalSales,
        commissionEarned: commissionEarned,
        rating: 4.5, // Mock rating - in real app, calculate from reviews
        businessType: seller.businessType || 'Not specified',
        district: seller.district || 'Not specified',
        isActive: seller.isActive,
        isVerified: seller.isVerified
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        sellers: transformedSellers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching sellers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update seller status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, ...updateData } = body

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Validate the update data
    const validatedData = sellerStatusSchema.parse(updateData)

    // Check if seller exists
    const seller = await prisma.user.findUnique({
      where: { 
        id: sellerId,
        role: 'SELLER'
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Update seller
    const updatedSeller = await prisma.user.update({
      where: { id: sellerId },
      data: {
        isActive: validatedData.status === 'approved',
        isVerified: validatedData.verificationStatus === 'verified',
        updatedAt: new Date()
      }
    })

    // Log the status change (in a real app, you might want to store this in an audit log)
    console.log(`Seller ${sellerId} status changed to ${validatedData.status} by admin`)

    return NextResponse.json({
      success: true,
      message: 'Seller status updated successfully',
      data: {
        id: updatedSeller.id,
        status: 'active', // Default status since User model doesn't have status field
        verificationStatus: updatedSeller.isVerified ? 'verified' : 'pending',
        isActive: updatedSeller.isActive,
        isVerified: updatedSeller.isVerified
      }
    })

  } catch (error) {
    console.error('Error updating seller status:', error)
    
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

