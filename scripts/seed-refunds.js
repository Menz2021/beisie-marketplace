const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedRefunds() {
  try {
    console.log('🌱 Seeding refunds...')

    // First, let's get some existing orders to create refunds for
    const orders = await prisma.order.findMany({
      take: 3,
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    if (orders.length === 0) {
      console.log('❌ No orders found. Please seed orders first.')
      return
    }

    // Get admin user for processing refunds
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!admin) {
      console.log('❌ No admin user found. Please seed users first.')
      return
    }

    // Create sample refunds
    const refunds = [
      {
        orderId: orders[0].id,
        amount: orders[0].total * 0.5, // 50% refund
        reason: 'Product damaged during shipping',
        type: 'PARTIAL',
        description: 'Customer received damaged product and wants partial refund',
        status: 'PENDING',
        requestedBy: orders[0].customerId,
        processedBy: null
      },
      {
        orderId: orders[1].id,
        amount: orders[1].total, // Full refund
        reason: 'Wrong item received',
        type: 'FULL',
        description: 'Customer received wrong product and wants full refund',
        status: 'APPROVED',
        requestedBy: orders[1].customerId,
        processedBy: admin.id,
        processedAt: new Date(),
        adminNotes: 'Approved after verifying the wrong item was sent'
      },
      {
        orderId: orders[2].id,
        amount: orders[2].total, // Full refund
        reason: 'Customer changed mind',
        type: 'FULL',
        description: 'Customer no longer wants the product',
        status: 'REJECTED',
        requestedBy: orders[2].customerId,
        processedBy: admin.id,
        processedAt: new Date(),
        adminNotes: 'Rejected - customer changed mind is not a valid refund reason per our policy'
      }
    ]

    // Create refunds in database
    for (const refundData of refunds) {
      const refund = await prisma.refund.create({
        data: refundData
      })
      console.log(`✅ Created refund: ${refund.id} for order ${refund.orderId}`)
    }

    console.log('🎉 Refunds seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding refunds:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedRefunds()
