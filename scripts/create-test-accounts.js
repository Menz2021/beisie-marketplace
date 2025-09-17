const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Creating test accounts...')

  try {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create Admin Account
    console.log('👑 Creating admin account...')
    let admin = await prisma.user.findFirst({
      where: { email: 'admin@testmarketplace.ug' }
    })
    
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@testmarketplace.ug',
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true,
          isActive: true,
          language: 'en'
        }
      })
      console.log('✅ Created admin account')
    } else {
      console.log('👑 Admin account already exists')
    }

    // Create Seller Account
    console.log('🏪 Creating seller account...')
    let seller = await prisma.user.findFirst({
      where: { email: 'seller@testmarketplace.ug' }
    })
    
    if (!seller) {
      seller = await prisma.user.create({
        data: {
          name: 'Test Seller',
          email: 'seller@testmarketplace.ug',
          password: hashedPassword,
          role: 'SELLER',
          isVerified: true,
          isActive: true,
          language: 'en'
        }
      })
      console.log('✅ Created seller account')
    } else {
      console.log('🏪 Seller account already exists')
    }

    // Create Customer Account
    console.log('👤 Creating customer account...')
    let customer = await prisma.user.findFirst({
      where: { email: 'customer@testmarketplace.ug' }
    })
    
    if (!customer) {
      customer = await prisma.user.create({
        data: {
          name: 'Test Customer',
          email: 'customer@testmarketplace.ug',
          password: hashedPassword,
          role: 'CUSTOMER',
          isVerified: true,
          isActive: true,
          language: 'en'
        }
      })
      console.log('✅ Created customer account')
    } else {
      console.log('👤 Customer account already exists')
    }

    console.log('\n🎉 Test accounts created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    console.log('│                    TEST ACCOUNTS                        │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ 👑 ADMIN:                                               │')
    console.log('│    Email: admin@testmarketplace.ug                      │')
    console.log('│    Password: password123                                │')
    console.log('│    URL: http://localhost:3000/admin/login               │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ 🏪 SELLER:                                              │')
    console.log('│    Email: seller@testmarketplace.ug                     │')
    console.log('│    Password: password123                                │')
    console.log('│    URL: http://localhost:3000/seller/auth/login         │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log('│ 👤 CUSTOMER:                                            │')
    console.log('│    Email: customer@testmarketplace.ug                   │')
    console.log('│    Password: password123                                │')
    console.log('│    URL: http://localhost:3000/auth/login                │')
    console.log('└─────────────────────────────────────────────────────────┘')

  } catch (error) {
    console.error('❌ Error creating test accounts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
