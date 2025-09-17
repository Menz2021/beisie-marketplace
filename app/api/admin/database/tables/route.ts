import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all database tables
export async function GET(request: NextRequest) {
  try {
    // Define the tables we know exist in our schema
    const knownTables = [
      { name: 'User', model: prisma.user as any },
      { name: 'Product', model: prisma.product as any },
      { name: 'Category', model: prisma.category as any },
      { name: 'Order', model: prisma.order as any },
      { name: 'OrderItem', model: prisma.orderItem as any },
      { name: 'Review', model: prisma.review as any },
      { name: 'CartItem', model: prisma.cartItem as any },
      { name: 'WishlistItem', model: prisma.wishlistItem as any },
      { name: 'Refund', model: prisma.refund as any },
      { name: 'Address', model: prisma.address as any }
    ]

    const tableInfo = await Promise.all(
      knownTables.map(async (table) => {
        try {
          // Get row count for each table
          const count = await table.model.count()
          
          // Get a sample record to determine columns
          const sampleRecord = await table.model.findFirst()
          const columns = sampleRecord ? Object.keys(sampleRecord) : []

          return {
            name: table.name,
            count: count,
            columns: columns
          }
        } catch (error) {
          console.error(`Error fetching info for table ${table.name}:`, error)
          return {
            name: table.name,
            count: 0,
            columns: []
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      tables: tableInfo
    })

  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database tables' },
      { status: 500 }
    )
  }
}
