import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    // For now, we'll skip authentication check in API
    // In a real app, you'd use JWT tokens or session cookies
    // const adminSession = getAdminSession()
    // if (!adminSession || adminSession.type !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status) {
      if (status === 'active') {
        where.isActive = true
      } else if (status === 'inactive') {
        where.isActive = false
      } else if (status === 'verified') {
        where.isVerified = true
      } else if (status === 'unverified') {
        where.isVerified = false
      }
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isVerified: true,
          isActive: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
              orders: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
