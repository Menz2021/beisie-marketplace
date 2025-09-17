import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all delivery zones
export async function GET(request: NextRequest) {
  try {
    const deliveryZones = await prisma.deliveryZone.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        shippingCost: 'asc'
      }
    })

    // Parse the districts JSON for each zone
    const formattedZones = deliveryZones.map(zone => ({
      id: zone.id,
      name: zone.name,
      districts: JSON.parse(zone.districts),
      shippingCost: zone.shippingCost,
      isActive: zone.isActive
    }))

    return NextResponse.json({
      success: true,
      data: formattedZones
    })

  } catch (error) {
    console.error('Error fetching delivery zones:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new delivery zone (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, districts, shippingCost } = body

    if (!name || !districts || !Array.isArray(districts) || shippingCost === undefined) {
      return NextResponse.json(
        { error: 'Name, districts array, and shipping cost are required' },
        { status: 400 }
      )
    }

    const deliveryZone = await prisma.deliveryZone.create({
      data: {
        name,
        districts: JSON.stringify(districts),
        shippingCost: parseFloat(shippingCost),
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: deliveryZone.id,
        name: deliveryZone.name,
        districts: JSON.parse(deliveryZone.districts),
        shippingCost: deliveryZone.shippingCost,
        isActive: deliveryZone.isActive
      }
    })

  } catch (error) {
    console.error('Error creating delivery zone:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
