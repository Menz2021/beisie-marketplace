import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a single product by slug for seller (includes pending products)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        vendorId: vendorId // Only allow seller to view their own products
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
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const totalReviews = product.reviews.length
    const averageRating = totalReviews > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0

    // Format the response
    const formattedProduct = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      discount: product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0
    }

    return NextResponse.json({
      success: true,
      product: formattedProduct
    })

  } catch (error) {
    console.error('Error fetching seller product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
