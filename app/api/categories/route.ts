import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Categories API called')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log('📂 Found categories:', categories.length)
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Categories API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN',
        environment: {
          DATABASE_URL_SET: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      },
      { status: 500 }
    )
  }
}
