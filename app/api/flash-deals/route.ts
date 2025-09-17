import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch flash deals (products with discounts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    // Fetch products that have originalPrice > price (indicating a discount)
    const flashDeals = await prisma.product.findMany({
      where: {
        isActive: true,
        approvalStatus: 'APPROVED',
        originalPrice: {
          gt: 0
        },
        price: {
          lt: prisma.product.fields.originalPrice
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
        }
      },
      orderBy: {
        // Order by highest discount percentage
        createdAt: 'desc'
      },
      take: limit
    })

    // Calculate discount percentages and format the data
    const formattedDeals = flashDeals.map(product => {
      const discountPercentage = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: discountPercentage,
        images: product.images,
        category: product.category?.name || 'Uncategorized',
        categorySlug: product.category?.slug,
        slug: product.slug,
        brand: product.brand,
        stock: product.stock,
        vendor: product.vendor?.name
      }
    })

    // Sort by discount percentage (highest first)
    formattedDeals.sort((a, b) => b.discount - a.discount)

    return NextResponse.json({
      success: true,
      data: formattedDeals
    })

  } catch (error) {
    console.error('Error fetching flash deals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
