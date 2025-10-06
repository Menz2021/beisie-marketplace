import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all products with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'featured'
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
      approvalStatus: 'APPROVED'
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseInt(minPrice)
      if (maxPrice) where.price.lte = parseInt(maxPrice)
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        break
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
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
          reviews: {
            select: {
              id: true,
              rating: true,
              createdAt: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Format the response
    const formattedProducts = products.map(product => {
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
        businessName: product.vendor?.businessName || (product.vendor?.role === 'ADMIN' ? 'Beisie' : product.vendor?.name),
        isFeatured: product.isFeatured,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        discount: product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0,
        daysSinceAdded: Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }
    })

    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
