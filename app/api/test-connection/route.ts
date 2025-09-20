import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const databaseUrl = process.env.DATABASE_URL
    const nodeEnv = process.env.NODE_ENV
    const nextAuthUrl = process.env.NEXTAUTH_URL
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      data: {
        hasDatabaseUrl: !!databaseUrl,
        databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
        nodeEnv,
        nextAuthUrl,
        // Don't expose the full URL for security
        databaseUrlPreview: databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'Not set'
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
