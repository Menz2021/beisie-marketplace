import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch related products for a given product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    // First, get the current product to understand its category and brand
    const currentProduct = await prisma.product.findFirst({
      where: {
        slug: slug,
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
        }
      }
    })

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find related products based on multiple criteria
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentProduct.id // Exclude the current product
            }
          },
          {
            isActive: true,
            approvalStatus: 'APPROVED'
          },
          {
            OR: [
              // Same category
              {
                categoryId: currentProduct.categoryId
              },
              // Same brand (if available)
              ...(currentProduct.brand ? [{
                brand: currentProduct.brand
              }] : []),
              // Similar price range (±30%)
              {
                price: {
                  gte: currentProduct.price * 0.7,
                  lte: currentProduct.price * 1.3
                }
              }
            ]
          }
        ]
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
            role: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: [
        // Prioritize same category first
        {
          categoryId: 'asc'
        },
        // Then by featured products
        {
          isFeatured: 'desc'
        },
        // Then by newest
        {
          createdAt: 'desc'
        }
      ],
      take: limit
    })

    // Calculate ratings and format products
    const formattedProducts = relatedProducts.map(product => {
      const totalReviews = product.reviews.length
      const averageRating = totalReviews > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        discount: product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0
      }
    })

    return NextResponse.json({
      success: true,
      relatedProducts: formattedProducts,
      currentProduct: {
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category
      }
    })

  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
