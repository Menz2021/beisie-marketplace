import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch data from a specific table
export async function GET(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const { tableName } = params

    // Map table names to Prisma models
    const modelMap: { [key: string]: any } = {
      'User': prisma.user,
      'Product': prisma.product,
      'Category': prisma.category,
      'Order': prisma.order,
      'OrderItem': prisma.orderItem,
      'Review': prisma.review,
      'CartItem': prisma.cartItem,
      'WishlistItem': prisma.wishlistItem,
      'Refund': prisma.refund,
      'Address': prisma.address
    }

    const model = modelMap[tableName]
    if (!model) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      )
    }

    // Fetch data from the table with appropriate includes
    let data
    switch (tableName) {
      case 'Product':
        data = await model.findMany({
          take: 1000,
          include: {
            category: true,
            vendor: true,
            reviews: true
          }
        })
        break
      case 'Order':
        data = await model.findMany({
          take: 1000,
          include: {
            user: true,
            items: true
          }
        })
        break
      case 'OrderItem':
        data = await model.findMany({
          take: 1000,
          include: {
            product: true,
            order: true
          }
        })
        break
      case 'Review':
        data = await model.findMany({
          take: 1000,
          include: {
            user: true,
            product: true
          }
        })
        break
      case 'CartItem':
        data = await model.findMany({
          take: 1000,
          include: {
            user: true,
            product: true
          }
        })
        break
      case 'WishlistItem':
        data = await model.findMany({
          take: 1000,
          include: {
            user: true,
            product: true
          }
        })
        break
      case 'Refund':
        data = await model.findMany({
          take: 1000,
          include: {
            order: true,
            user: true
          }
        })
        break
      case 'Address':
        data = await model.findMany({
          take: 1000,
          include: {
            user: true
          }
        })
        break
      default:
        data = await model.findMany({
          take: 1000
        })
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('Error fetching table data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch table data' },
      { status: 500 }
    )
  }
}
