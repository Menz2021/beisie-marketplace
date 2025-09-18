const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestSeller() {
  try {
    // Check if test seller already exists
    const existingSeller = await prisma.user.findUnique({
      where: { email: 'seller@test.com' }
    })

    if (existingSeller) {
      console.log('✅ Test seller already exists!')
      console.log('📧 Email: seller@test.com')
      console.log('🔑 Password: password123')
      console.log('🆔 Seller ID:', existingSeller.id)
      console.log('📊 Status: Active & Verified')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create test seller with correct User model fields
    const seller = await prisma.user.create({
      data: {
        name: 'Test Seller Business',
        email: 'seller@test.com',
        password: hashedPassword,
        phone: '+256 700 123 456',
        role: 'SELLER',
        isActive: true,
        isVerified: true
      }
    })

    console.log('✅ Test seller created successfully!')
    console.log('📧 Email: seller@test.com')
    console.log('🔑 Password: password123')
    console.log('🆔 Seller ID:', seller.id)
    console.log('📊 Status: Active & Verified')
    console.log('')
    console.log('You can now login to the seller dashboard with these credentials.')

  } catch (error) {
    console.error('❌ Error creating test seller:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestSeller()
