import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for seller update
const sellerUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['approved', 'pending', 'suspended', 'rejected']).optional(),
  verificationStatus: z.enum(['verified', 'pending', 'rejected']).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional()
})

// GET - Fetch specific seller details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seller = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: 'SELLER'
      },
      include: {
        products: {
          include: {
            category: true,
            reviews: true
          }
        },
        orders: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        },
        reviews: true,
        addresses: true
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Calculate seller statistics
    const totalProducts = seller.products.length
    const activeProducts = seller.products.filter(p => p.isActive).length
    const totalSales = seller.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.total, 0)
    const commissionEarned = totalSales * 0.15 // 15% commission
    
    // Calculate average rating from reviews
    const reviews = seller.reviews
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Get recent orders
    const recentOrders = seller.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    // Get top products by sales
    const productSales = seller.products.map(product => {
      const productOrders = seller.orders.filter(order =>
        order.orderItems.some(item => item.productId === product.id)
      )
      const sales = productOrders.reduce((sum, order) => sum + order.total, 0)
      return { ...product, sales }
    }).sort((a, b) => b.sales - a.sales).slice(0, 5)

    // Determine status based on isActive and isVerified
    let status = 'pending'
    if (seller.isActive && seller.isVerified) {
      status = 'approved'
    } else if (!seller.isActive && !seller.isVerified) {
      status = 'pending'
    } else if (!seller.isActive) {
      status = 'suspended'
    }

    const sellerDetails = {
      id: seller.id,
      businessName: seller.businessName || seller.name || 'Unnamed Business',
      contactPerson: seller.name || 'Unknown',
      email: seller.email,
      phone: seller.phone || 'Not provided',
      status: status,
      verificationStatus: seller.isVerified ? 'verified' : 'pending',
      joinDate: seller.createdAt.toISOString().split('T')[0],
      lastActive: seller.updatedAt.toISOString().split('T')[0],
      isActive: seller.isActive,
      isVerified: seller.isVerified,
      
      // Statistics
      totalProducts,
      activeProducts,
      totalSales,
      commissionEarned,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      
      // Business details
      businessType: seller.businessType || 'Not specified',
      district: seller.district || 'Not specified',
      address: seller.address || 'Not provided',
      
      // Related data
      products: seller.products,
      recentOrders,
      topProducts: productSales,
      addresses: seller.addresses,
      reviews: reviews.slice(0, 10) // Recent reviews
    }

    return NextResponse.json({
      success: true,
      data: sellerDetails
    })

  } catch (error) {
    console.error('Error fetching seller details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update seller information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate the update data
    const validatedData = sellerUpdateSchema.parse(body)

    // Check if seller exists
    const seller = await prisma.user.findFirst({
      where: {
        id: params.id,
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
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Seller updated successfully',
      data: {
        id: updatedSeller.id,
        name: updatedSeller.name,
        email: updatedSeller.email,
        phone: updatedSeller.phone,
        status: 'active', // Default status since User model doesn't have status field
        verificationStatus: updatedSeller.isVerified ? 'verified' : 'pending',
        isActive: updatedSeller.isActive,
        isVerified: updatedSeller.isVerified
      }
    })

  } catch (error) {
    console.error('Error updating seller:', error)
    
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

// DELETE - Deactivate seller (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if seller exists
    const seller = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: 'SELLER'
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Soft delete by deactivating
    const updatedSeller = await prisma.user.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Seller deactivated successfully',
      data: {
        id: updatedSeller.id,
        isActive: updatedSeller.isActive
      }
    })

  } catch (error) {
    console.error('Error deactivating seller:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

