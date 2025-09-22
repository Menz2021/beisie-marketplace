const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedLocalData() {
  console.log('🌱 Seeding local database with development data...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.refund.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.deliveryZone.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.address.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Mobile Phones', description: 'Smartphones and mobile accessories', slug: 'mobile-phones' },
      { name: 'Fashion', description: 'Clothing and fashion items', slug: 'fashion' },
      { name: 'Home & Kitchen', description: 'Home and kitchen products', slug: 'home-kitchen' },
      { name: 'Beauty & Health', description: 'Beauty and health products', slug: 'beauty-health' },
      { name: 'Laptops & Computers', description: 'Laptops, desktops and computer accessories', slug: 'laptops-computers' },
      { name: 'Gaming', description: 'Gaming consoles and accessories', slug: 'gaming' },
      { name: 'Cameras & Photography', description: 'Cameras and photography equipment', slug: 'cameras-photography' },
      { name: 'Audio & Headphones', description: 'Audio equipment and headphones', slug: 'audio-headphones' },
      { name: 'Wearables', description: 'Smartwatches and wearable devices', slug: 'wearables' },
      { name: 'Power Banks & Chargers', description: 'Portable chargers and power banks', slug: 'power-banks-chargers' },
      { name: 'Tablets', description: 'Tablets and tablet accessories', slug: 'tablets' },
      { name: 'TVs & Accessories', description: 'Televisions and TV accessories', slug: 'tvs-accessories' },
      { name: 'Automotive', description: 'Car accessories and automotive products', slug: 'automotive' },
      { name: 'Sports & Fitness', description: 'Sports equipment and fitness gear', slug: 'sports-fitness' },
      { name: 'Books & Media', description: 'Books, movies, and media', slug: 'books-media' },
      { name: 'Toys & Games', description: 'Toys and gaming accessories', slug: 'toys-games' },
      { name: 'Furniture', description: 'Home and office furniture', slug: 'furniture' },
      { name: 'Jewelry', description: 'Jewelry and accessories', slug: 'jewelry' },
      { name: 'Watches', description: 'Watches and timepieces', slug: 'watches' }
    ]

    const createdCategories = []
    for (const category of categories) {
      const newCategory = await prisma.category.create({
        data: category
      })
      createdCategories.push(newCategory)
      console.log(`✅ Created category: ${category.name}`)
    }

    // Create test users
    console.log('👤 Creating test users...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const adminPassword = await bcrypt.hash('admin123', 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@beisie.com',
        password: adminPassword,
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
        language: 'en'
      }
    })
    console.log('✅ Created admin user: admin@beisie.com')

    // Create seller user
    const seller = await prisma.user.create({
      data: {
        name: 'Test Seller',
        email: 'seller@testmarketplace.ug',
        password: hashedPassword,
        role: 'SELLER',
        isVerified: true,
        isActive: true,
        businessName: 'Test Store',
        businessType: 'Electronics & General Merchandise',
        district: 'Kampala',
        language: 'en'
      }
    })
    console.log('✅ Created seller user: seller@testmarketplace.ug')

    // Create customer user
    const customer = await prisma.user.create({
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
    console.log('✅ Created customer user: customer@testmarketplace.ug')

    // Create sample products
    console.log('📦 Creating sample products...')
    const products = [
      {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Latest flagship smartphone with advanced camera system and S Pen',
        price: 2500000,
        originalPrice: 2800000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'SGS23U-256-BLK',
        brand: 'Samsung',
        weight: 0.234,
        dimensions: JSON.stringify({ length: 16.3, width: 7.8, height: 0.9 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-galaxy-s23-ultra',
        categoryId: createdCategories.find(c => c.slug === 'mobile-phones').id,
        vendorId: seller.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Apple\'s latest flagship with titanium design and advanced camera system',
        price: 3200000,
        originalPrice: 3500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'IP15P-256-TIT',
        brand: 'Apple',
        weight: 0.187,
        dimensions: JSON.stringify({ length: 14.7, width: 7.1, height: 0.8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'iphone-15-pro',
        categoryId: createdCategories.find(c => c.slug === 'mobile-phones').id,
        vendorId: seller.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Powerful laptop with M3 chip for professionals and creators',
        price: 8500000,
        originalPrice: 9000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'
        ]),
        stock: 5,
        sku: 'MBP14-M3-512',
        brand: 'Apple',
        weight: 1.6,
        dimensions: JSON.stringify({ length: 31.3, width: 22.1, height: 1.6 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'macbook-pro-14-m3',
        categoryId: createdCategories.find(c => c.slug === 'laptops-computers').id,
        vendorId: seller.id,
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      }
    ]

    for (const product of products) {
      await prisma.product.create({
        data: product
      })
      console.log(`✅ Created product: ${product.name}`)
    }

    console.log('🎉 Local database seeded successfully!')
    console.log('📝 Test accounts:')
    console.log('👑 Admin: admin@beisie.com / admin123')
    console.log('🏪 Seller: seller@testmarketplace.ug / password123')
    console.log('👤 Customer: customer@testmarketplace.ug / password123')

  } catch (error) {
    console.error('❌ Error seeding local database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedLocalData()
