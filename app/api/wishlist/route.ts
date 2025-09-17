import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: userId
      },
      include: {
        product: {
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedItems = wishlistItems.map(item => {
      let productImages = []
      try {
        productImages = item.product.images ? JSON.parse(item.product.images) : []
      } catch (error) {
        console.error('Error parsing product images:', error)
        productImages = []
      }

      return {
        id: item.id,
        createdAt: item.createdAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          images: productImages,
          stock: item.product.stock,
          sku: item.product.sku,
          brand: item.product.brand,
          weight: item.product.weight,
          dimensions: item.product.dimensions,
          isActive: item.product.isActive,
          isFeatured: item.product.isFeatured,
          approvalStatus: item.product.approvalStatus,
          slug: item.product.slug,
          category: item.product.category,
          vendor: item.product.vendor,
          discount: item.product.originalPrice 
            ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
            : 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedItems
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      )
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: userId,
        productId: productId
      },
      include: {
        product: {
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
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: wishlistItem
    })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist'
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

