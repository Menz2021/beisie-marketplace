import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get all users who can be vendors (SELLER or ADMIN role)
    const vendors = await prisma.user.findMany({
      where: {
        role: {
          in: ['SELLER', 'ADMIN']
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessName: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        categories,
        vendors
      }
    })

  } catch (error) {
    console.error('Error fetching product form data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
