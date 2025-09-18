const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedProduction() {
  console.log('🌱 Starting production database seeding...')
  
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.count()
    if (existingCategories > 0) {
      console.log(`✅ Database already has ${existingCategories} categories`)
      return
    }

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Mobile Phones', description: 'Smartphones and accessories', slug: 'mobile-phones' },
      { name: 'Fashion', description: 'Clothing and fashion items', slug: 'fashion' },
      { name: 'Home & Kitchen', description: 'Home and kitchen products', slug: 'home-kitchen' },
      { name: 'Beauty & Health', description: 'Beauty and health products', slug: 'beauty-health' },
      { name: 'Laptops & Computers', description: 'Laptops, desktops and computer accessories', slug: 'laptops-computers' },
      { name: 'Gaming', description: 'Gaming consoles and accessories', slug: 'gaming' },
      { name: 'Cameras & Photography', description: 'Cameras and photography equipment', slug: 'cameras-photography' },
      { name: 'Audio & Headphones', description: 'Audio equipment and headphones', slug: 'audio-headphones' },
      { name: 'Wearables', description: 'Smartwatches and wearable devices', slug: 'wearables' }
    ]

    for (const category of categories) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Created category: ${category.name}`)
    }

    // Create a test vendor
    console.log('👤 Creating test vendor...')
    const vendor = await prisma.user.create({
      data: {
        name: 'TechStore Uganda',
        email: 'vendor@techstore.ug',
        password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJByJ.xsI5q8Q8Q8Q8Q', // password123
        role: 'SELLER',
        isVerified: true,
        isActive: true,
        businessName: 'TechStore Uganda',
        businessType: 'Electronics Retailer',
        district: 'Kampala',
        address: 'Kampala, Uganda'
      }
    })
    console.log(`✅ Created vendor: ${vendor.name}`)

    // Get categories for products
    const electronicsCategory = await prisma.category.findFirst({ where: { slug: 'electronics' } })
    const mobileCategory = await prisma.category.findFirst({ where: { slug: 'mobile-phones' } })
    const fashionCategory = await prisma.category.findFirst({ where: { slug: 'fashion' } })

    // Create sample products
    console.log('📦 Creating products...')
    const products = [
      {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Latest Samsung flagship smartphone with advanced camera system',
        price: 2500000,
        originalPrice: 2800000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500']),
        stock: 10,
        sku: 'SAMSUNG-S23-ULTRA',
        brand: 'Samsung',
        slug: 'samsung-galaxy-s23-ultra',
        categoryId: mobileCategory.id,
        vendorId: vendor.id,
        approvalStatus: 'APPROVED'
      },
      {
        name: 'iPhone 14 Pro',
        description: 'Apple iPhone 14 Pro with ProRAW and ProRes video',
        price: 3200000,
        originalPrice: 3500000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500']),
        stock: 8,
        sku: 'APPLE-IPHONE-14-PRO',
        brand: 'Apple',
        slug: 'iphone-14-pro',
        categoryId: mobileCategory.id,
        vendorId: vendor.id,
        approvalStatus: 'APPROVED'
      },
      {
        name: 'MacBook Air M2',
        description: 'Apple MacBook Air with M2 chip for ultimate performance',
        price: 4500000,
        originalPrice: 4800000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500']),
        stock: 5,
        sku: 'APPLE-MACBOOK-AIR-M2',
        brand: 'Apple',
        slug: 'macbook-air-m2',
        categoryId: electronicsCategory.id,
        vendorId: vendor.id,
        approvalStatus: 'APPROVED'
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Air Max technology',
        price: 350000,
        originalPrice: 400000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']),
        stock: 20,
        sku: 'NIKE-AIR-MAX-270',
        brand: 'Nike',
        slug: 'nike-air-max-270',
        categoryId: fashionCategory.id,
        vendorId: vendor.id,
        approvalStatus: 'APPROVED'
      },
      {
        name: 'Sony WH-1000XM4 Headphones',
        description: 'Industry-leading noise canceling wireless headphones',
        price: 800000,
        originalPrice: 900000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']),
        stock: 15,
        sku: 'SONY-WH-1000XM4',
        brand: 'Sony',
        slug: 'sony-wh-1000xm4-headphones',
        categoryId: electronicsCategory.id,
        vendorId: vendor.id,
        approvalStatus: 'APPROVED'
      }
    ]

    for (const product of products) {
      await prisma.product.create({
        data: product
      })
      console.log(`✅ Created product: ${product.name}`)
    }

    console.log('🎉 Production database seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Products: ${products.length}`)
    console.log(`- Vendor: ${vendor.name}`)

  } catch (error) {
    console.error('❌ Error seeding production database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedProduction()

