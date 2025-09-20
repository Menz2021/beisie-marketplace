import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
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
      error: error.message,
      code: error.code,
      environment: {
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}
=======
    // Test database connection
    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        categoryCount,
        productCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      },
      { status: 500 }
    )
  }
}




>>>>>>> 02ab8adf954a04aa079bc69208b552d48ea68815
