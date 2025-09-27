import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch trending products based on popularity and demand
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // Get products with popularity metrics
    const trendingProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        approvalStatus: 'APPROVED'
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
            email: true,
            businessName: true,
            role: true
          }
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            createdAt: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true
          }
        },
        wishlistItems: {
          select: {
            id: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate trending score for each product
    const productsWithScore = trendingProducts.map(product => {
      // Calculate various popularity metrics
      const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const recentSales = product.orderItems.filter(item => {
        const daysSinceOrder = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceOrder <= 30 // Last 30 days
      }).reduce((sum, item) => sum + item.quantity, 0)

      const totalReviews = product.reviews.length
      const averageRating = totalReviews > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      const recentReviews = product.reviews.filter(review => {
        const daysSinceReview = (Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceReview <= 30 // Last 30 days
      }).length

      const wishlistCount = product.wishlistItems.length
      const recentWishlist = product.wishlistItems.filter(item => {
        const daysSinceWishlist = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceWishlist <= 7 // Last 7 days
      }).length

      // Calculate trending score (higher is more trending)
      // Weighted scoring system:
      const trendingScore = 
        (totalSales * 2) +                    // Total sales (weight: 2)
        (recentSales * 5) +                   // Recent sales (weight: 5)
        (averageRating * 10) +                // Average rating (weight: 10)
        (totalReviews * 3) +                  // Total reviews (weight: 3)
        (recentReviews * 8) +                 // Recent reviews (weight: 8)
        (wishlistCount * 1) +                 // Wishlist count (weight: 1)
        (recentWishlist * 4) +                // Recent wishlist (weight: 4)
        (product.isFeatured ? 20 : 0) +       // Featured bonus (weight: 20)
        (product.originalPrice ? 5 : 0)       // Has discount (weight: 5)

      return {
        ...product,
        trendingScore,
        totalSales,
        recentSales,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        recentReviews,
        wishlistCount,
        recentWishlist,
        businessName: product.vendor?.businessName || (product.vendor?.role === 'ADMIN' ? 'Beisie' : product.vendor?.name)
      }
    })

    // Sort by trending score (highest first) and take the limit
    const sortedProducts = productsWithScore
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)

    // Format the response
    const formattedProducts = sortedProducts.map(product => {
      const productImages = product.images ? JSON.parse(product.images) : []
      
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
        trendingScore: product.trendingScore,
        totalSales: product.totalSales,
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        wishlistCount: product.wishlistCount,
        discount: product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedProducts
    })

  } catch (error) {
    console.error('Error fetching trending products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
