import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test DB API called')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    const categories = await prisma.category.findMany({
      take: 3,
      select: { id: true, name: true, slug: true }
    })
    
    const products = await prisma.product.findMany({
      take: 3,
      select: { id: true, name: true }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      data: {
        categoriesCount: categories.length,
        productsCount: products.length,
        sampleCategories: categories,
        sampleProducts: products,
        environment: {
          DATABASE_URL_SET: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      }
    })
  } catch (error) {
    console.error('❌ Test DB Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN',
      environment: {
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}