import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch new arrivals (recently added products, not restocks)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    // Get recently added products (within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newArrivals = await prisma.product.findMany({
      where: {
        isActive: true,
        approvalStatus: 'APPROVED',
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      take: limit
    })

    // Format the response
    const formattedProducts = newArrivals.map(product => {
      const totalReviews = product.reviews.length
      const averageRating = totalReviews > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: product.category?.name || 'Uncategorized',
        categorySlug: product.category?.slug,
        slug: product.slug,
        brand: product.brand,
        stock: product.stock,
        vendor: product.vendor?.name,
        isFeatured: product.isFeatured,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        discount: product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0,
        daysSinceAdded: Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedProducts
    })

  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
