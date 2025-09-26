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

    // For admin products, always use "Beisie" as the vendor
    // Find or create a Beisie vendor
    let beisieVendor = await prisma.user.findFirst({
      where: { 
        role: 'ADMIN',
        name: { contains: 'Beisie' }
      }
    })
    
    // If no Beisie admin exists, create one or use the first admin
    if (!beisieVendor) {
      beisieVendor = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      
      // If still no admin exists, create a default Beisie vendor
      if (!beisieVendor) {
        beisieVendor = await prisma.user.create({
          data: {
            email: 'admin@beisie.com',
            name: 'Beisie Marketplace',
            password: 'default-password',
            role: 'ADMIN',
            isVerified: true,
            isActive: true,
            businessName: 'Beisie Marketplace'
          }
        })
      }
    }
    
    // Return only the Beisie vendor for admin products
    const vendors = [{
      id: beisieVendor.id,
      name: beisieVendor.name || 'Beisie Marketplace',
      email: beisieVendor.email,
      role: beisieVendor.role,
      businessName: beisieVendor.businessName || 'Beisie Marketplace'
    }]

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
