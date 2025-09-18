import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch featured products for hero banner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')

    // Get featured products with good ratings and recent activity
    const heroProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        approvalStatus: 'APPROVED',
        isFeatured: true
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
        createdAt: 'desc'
      },
      take: limit
    })

    // If we don't have enough featured products, get some popular ones
    if (heroProducts.length < limit) {
      const additionalProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          approvalStatus: 'APPROVED',
          id: {
            notIn: heroProducts.map(p => p.id)
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
          },
          orderItems: {
            select: {
              id: true,
              quantity: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit - heroProducts.length
      })

      heroProducts.push(...additionalProducts)
    }

    // Format the response
    const formattedProducts = heroProducts.map(product => {
      const totalReviews = product.reviews.length
      const averageRating = totalReviews > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      const productImages = product.images ? JSON.parse(product.images) : []
      const mainImage = productImages[0] || '/api/placeholder/1200/400'

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        mainImage,
        category: product.category?.name || 'Uncategorized',
        categorySlug: product.category?.slug,
        slug: product.slug,
        brand: product.brand,
        stock: product.stock,
        vendor: product.vendor?.name,
        isFeatured: product.isFeatured,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        discount: product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0,
        // Create hero banner content
        title: product.name,
        description: `Discover ${product.name} - ${product.brand ? `by ${product.brand}` : ''} ${product.category ? `in ${product.category}` : ''}`,
        buttonText: "View Product",
        buttonLink: `/products/${product.slug}`,
        backgroundImage: mainImage,
        textColor: "text-white"
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedProducts
    })

  } catch (error) {
    console.error('Error fetching hero products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
