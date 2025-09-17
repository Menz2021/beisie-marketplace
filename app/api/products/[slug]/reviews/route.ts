import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})

// GET - Fetch reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Find the product first
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true,
        approvalStatus: 'APPROVED'
      },
      select: { id: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const skip = (page - 1) * limit

    // Fetch reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId: product.id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: {
          productId: product.id
        }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    
    // Validate the review data
    const validatedData = reviewSchema.parse(body)
    
    // Get user from session (for now, we'll use a mock user ID)
    // In a real app, you'd get this from JWT token or session
    const userId = body.userId // This should come from authentication
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      )
    }

    // Find the product
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true,
        approvalStatus: 'APPROVED'
      },
      select: { id: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: product.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        userId: userId,
        productId: product.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    })

  } catch (error) {
    console.error('Error creating review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
