const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // First, create categories if they don't exist
    console.log('📂 Creating categories...')
    const categories = [
      {
        name: 'Electronics',
        description: 'Latest gadgets and tech devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
        slug: 'electronics'
      },
      {
        name: 'Mobile Phones',
        description: 'Smartphones and accessories',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        slug: 'mobile-phones'
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        slug: 'fashion'
      },
      {
        name: 'Home & Kitchen',
        description: 'Everything for your home and kitchen',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'home-kitchen'
      },
      {
        name: 'Beauty & Health',
        description: 'Cosmetics, skincare, and health products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        slug: 'beauty-health'
      }
    ]

    const createdCategories = []
    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      })
      
      if (!existingCategory) {
        const newCategory = await prisma.category.create({
          data: category
        })
        createdCategories.push(newCategory)
        console.log(`✅ Created category: ${category.name}`)
      } else {
        createdCategories.push(existingCategory)
        console.log(`📁 Category already exists: ${category.name}`)
      }
    }

    // Create a test vendor/seller
    console.log('👤 Creating test vendor...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    let vendor = await prisma.user.findFirst({
      where: { email: 'vendor@testmarketplace.ug' }
    })
    
    if (!vendor) {
      vendor = await prisma.user.create({
        data: {
          name: 'TechStore Uganda',
          email: 'vendor@testmarketplace.ug',
          password: hashedPassword,
          role: 'SELLER',
          isVerified: true,
          isActive: true
        }
      })
      console.log('✅ Created vendor: TechStore Uganda')
    } else {
      console.log('👤 Vendor already exists: TechStore Uganda')
    }

    // Create products
    console.log('📦 Creating products...')
    const products = [
      {
        name: 'Samsung Galaxy S23 Ultra',
        description: 'The Samsung Galaxy S23 Ultra is the ultimate smartphone for power users. Featuring a massive 6.8-inch Dynamic AMOLED 2X display, the S23 Ultra delivers stunning visuals with its 120Hz refresh rate and HDR10+ support.',
        price: 4500000,
        originalPrice: 5000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'SGS23U-256-BLK',
        brand: 'Samsung',
        weight: 0.234,
        dimensions: JSON.stringify({ length: 16.3, width: 7.8, height: 0.8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-galaxy-s23-ultra',
        categoryId: createdCategories[1].id, // Mobile Phones
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'iPhone 14 Pro',
        description: 'The iPhone 14 Pro features the A16 Bionic chip, a 48MP main camera with ProRAW, and the Dynamic Island. Experience the future of iPhone with advanced camera capabilities and all-day battery life.',
        price: 4200000,
        originalPrice: 4500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'IP14P-256-BLK',
        brand: 'Apple',
        weight: 0.206,
        dimensions: JSON.stringify({ length: 14.76, width: 7.15, height: 0.78 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'iphone-14-pro',
        categoryId: createdCategories[1].id, // Mobile Phones
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'MacBook Air M2',
        description: 'The MacBook Air with M2 chip delivers exceptional performance and all-day battery life. Featuring a stunning 13.6-inch Liquid Retina display and advanced camera and audio.',
        price: 8500000,
        originalPrice: 9000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
        ]),
        stock: 5,
        sku: 'MBA-M2-256-SLV',
        brand: 'Apple',
        weight: 1.24,
        dimensions: JSON.stringify({ length: 30.41, width: 21.5, height: 1.13 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'macbook-air-m2',
        categoryId: createdCategories[0].id, // Electronics
        vendorId: vendor.id,
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },
      {
        name: 'Nike Air Max 270',
        description: 'The Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
        price: 450000,
        originalPrice: 500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
        ]),
        stock: 25,
        sku: 'NAM270-10-BLK',
        brand: 'Nike',
        weight: 0.3,
        dimensions: JSON.stringify({ length: 32, width: 12, height: 8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'nike-air-max-270',
        categoryId: createdCategories[2].id, // Fashion
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        description: 'The Instant Pot Duo 7-in-1 Electric Pressure Cooker is a multi-use cooker for the home. It replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
        price: 350000,
        originalPrice: 400000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
        ]),
        stock: 12,
        sku: 'IP-DUO-6QT',
        brand: 'Instant Pot',
        weight: 5.7,
        dimensions: JSON.stringify({ length: 33, width: 33, height: 30 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'instant-pot-duo-7in1',
        categoryId: createdCategories[3].id, // Home & Kitchen
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Sony WH-1000XM4 Headphones',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charge.',
        price: 650000,
        originalPrice: 750000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]),
        stock: 18,
        sku: 'SWH1000XM4-BLK',
        brand: 'Sony',
        weight: 0.254,
        dimensions: JSON.stringify({ length: 27, width: 20, height: 7 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'sony-wh1000xm4-headphones',
        categoryId: createdCategories[0].id, // Electronics
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'The Adidas Ultraboost 22 running shoes feature responsive Boost midsole technology and Primeknit+ upper for a comfortable, supportive fit. Perfect for daily runs and training.',
        price: 380000,
        originalPrice: 420000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'
        ]),
        stock: 30,
        sku: 'AUB22-10-BLK',
        brand: 'Adidas',
        weight: 0.28,
        dimensions: JSON.stringify({ length: 31, width: 11, height: 7 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'adidas-ultraboost-22',
        categoryId: createdCategories[2].id, // Fashion
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Dyson V15 Detect Vacuum',
        description: 'The Dyson V15 Detect cordless vacuum features laser dust detection, powerful suction, and up to 60 minutes of run time. Advanced filtration captures 99.97% of particles as small as 0.3 microns.',
        price: 1200000,
        originalPrice: 1350000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc8?w=600&h=600&fit=crop'
        ]),
        stock: 6,
        sku: 'DYS-V15-DET',
        brand: 'Dyson',
        weight: 3.0,
        dimensions: JSON.stringify({ length: 126, width: 25, height: 25 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'dyson-v15-detect-vacuum',
        categoryId: createdCategories[3].id, // Home & Kitchen
        vendorId: vendor.id,
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },
      {
        name: 'L\'Oréal Paris Revitalift Anti-Aging Cream',
        description: 'L\'Oréal Paris Revitalift Anti-Aging Face Moisturizer with Pro-Retinol, Hyaluronic Acid & Vitamin C. Reduces wrinkles and fine lines while hydrating skin for a youthful appearance.',
        price: 85000,
        originalPrice: 100000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'
        ]),
        stock: 40,
        sku: 'LOR-REV-50ML',
        brand: 'L\'Oréal Paris',
        weight: 0.15,
        dimensions: JSON.stringify({ length: 8, width: 5, height: 5 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'loreal-revitalift-anti-aging-cream',
        categoryId: createdCategories[4].id, // Beauty & Health
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Samsung 55" QLED 4K Smart TV',
        description: 'Samsung 55-inch QLED 4K Smart TV with Quantum Dot technology, HDR10+, and Smart Hub. Experience stunning picture quality with vibrant colors and deep blacks.',
        price: 3200000,
        originalPrice: 3500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'
        ]),
        stock: 3,
        sku: 'SAMS-55QN85A',
        brand: 'Samsung',
        weight: 18.5,
        dimensions: JSON.stringify({ length: 123, width: 71, height: 5 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-55-qled-4k-smart-tv',
        categoryId: createdCategories[0].id, // Electronics
        vendorId: vendor.id,
        deliveryTimeDays: 7,
        deliveryTimeText: '1 week delivery'
      }
    ]

    for (const product of products) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug }
      })
      
      if (!existingProduct) {
        await prisma.product.create({
          data: product
        })
        console.log(`✅ Created product: ${product.name}`)
      } else {
        console.log(`📦 Product already exists: ${product.name}`)
      }
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Categories: ${createdCategories.length}`)
    console.log(`- Products: ${products.length}`)
    console.log(`- Vendor: TechStore Uganda`)
    console.log('\n🔗 You can now test the products at:')
    console.log('- http://localhost:3000/products')
    console.log('- http://localhost:3000/categories/mobile-phones')
    console.log('- http://localhost:3000/products/samsung-galaxy-s23-ultra')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
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
