const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedOrders() {
  try {
    console.log('🌱 Seeding orders...')

    // Get a customer and some products
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' }
    })

    const products = await prisma.product.findMany({
      take: 3
    })

    if (!customer) {
      console.log('❌ No customer found. Please seed users first.')
      return
    }

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.')
      return
    }

    // Create sample orders
    const orders = [
      {
        orderNumber: 'ORD-001',
        total: 150000,
        subtotal: 140000,
        shippingCost: 10000,
        tax: 0,
        discount: 0,
        status: 'DELIVERED',
        paymentMethod: 'MTN_MOBILE_MONEY',
        paymentStatus: 'COMPLETED',
        shippingAddress: 'Kampala, Uganda',
        customerId: customer.id,
        orderItems: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price
          }
        ]
      },
      {
        orderNumber: 'ORD-002',
        total: 320000,
        subtotal: 300000,
        shippingCost: 20000,
        tax: 0,
        discount: 0,
        status: 'DELIVERED',
        paymentMethod: 'AIRTEL_MONEY',
        paymentStatus: 'COMPLETED',
        shippingAddress: 'Entebbe, Uganda',
        customerId: customer.id,
        orderItems: [
          {
            productId: products[1].id,
            quantity: 1,
            price: products[1].price
          }
        ]
      },
      {
        orderNumber: 'ORD-003',
        total: 850000,
        subtotal: 800000,
        shippingCost: 50000,
        tax: 0,
        discount: 0,
        status: 'DELIVERED',
        paymentMethod: 'VISA',
        paymentStatus: 'COMPLETED',
        shippingAddress: 'Jinja, Uganda',
        customerId: customer.id,
        orderItems: [
          {
            productId: products[2].id,
            quantity: 1,
            price: products[2].price
          }
        ]
      }
    ]

    // Create orders in database
    for (const orderData of orders) {
      const { orderItems, ...orderInfo } = orderData
      
      const order = await prisma.order.create({
        data: {
          ...orderInfo,
          orderItems: {
            create: orderItems
          }
        }
      })
      console.log(`✅ Created order: ${order.orderNumber}`)
    }

    console.log('🎉 Orders seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedOrders()
