const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting real products seeding...')

  try {
    // Get existing categories
    const categories = await prisma.category.findMany()
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run the main seed script first.')
      return
    }

    // Get or create a vendor
    let vendor = await prisma.user.findFirst({
      where: { email: 'noonproducts@testmarketplace.ug' }
    })
    
    if (!vendor) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      vendor = await prisma.user.create({
        data: {
          name: 'Noon Products Uganda',
          email: 'noonproducts@testmarketplace.ug',
          password: hashedPassword,
          role: 'SELLER',
          isVerified: true,
          isActive: true,
          businessName: 'Noon Products Uganda',
          businessType: 'Electronics & General Merchandise',
          district: 'Kampala'
        }
      })
      console.log('✅ Created vendor: Noon Products Uganda')
    } else {
      console.log('👤 Vendor already exists: Noon Products Uganda')
    }

    // Real product data inspired by noon.com but with original content
    const products = [
      // Electronics
      {
        name: 'Samsung Galaxy S24 Ultra 256GB',
        description: 'The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 12GB RAM, and 256GB storage. Includes S Pen, 200MP main camera with 100x Space Zoom, and 5000mAh battery with 45W fast charging.',
        price: 4200000,
        originalPrice: 4500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 25,
        sku: 'SGS24U-256-TIT-NP',
        brand: 'Samsung',
        weight: 0.232,
        dimensions: JSON.stringify({ length: 16.2, width: 7.9, height: 0.88 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-galaxy-s24-ultra-256gb',
        categoryId: categories.find(c => c.name === 'Electronics')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery in Kampala',
        specifications: JSON.stringify({
          'Display': '6.8" Dynamic AMOLED 2X, 120Hz',
          'Processor': 'Snapdragon 8 Gen 3',
          'RAM': '12GB',
          'Storage': '256GB',
          'Camera': '200MP + 50MP + 10MP + 10MP',
          'Battery': '5000mAh',
          'OS': 'Android 14 with One UI 6.1'
        })
      },
      {
        name: 'iPhone 15 Pro Max 256GB',
        description: 'The iPhone 15 Pro Max features a 6.7-inch Super Retina XDR display, A17 Pro chip, 8GB RAM, and 256GB storage. Includes titanium design, 48MP main camera with 5x optical zoom, and USB-C connectivity.',
        price: 4800000,
        originalPrice: 5000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
        ]),
        stock: 18,
        sku: 'IP15PM-256-TIT-NP',
        brand: 'Apple',
        weight: 0.221,
        dimensions: JSON.stringify({ length: 15.9, width: 7.7, height: 0.83 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'iphone-15-pro-max-256gb',
        categoryId: categories.find(c => c.name === 'Mobiles and Accessories')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery',
        specifications: JSON.stringify({
          'Display': '6.7" Super Retina XDR, 120Hz ProMotion',
          'Chip': 'A17 Pro',
          'RAM': '8GB',
          'Storage': '256GB',
          'Camera': '48MP + 12MP + 12MP',
          'Battery': 'Up to 29 hours video playback',
          'OS': 'iOS 17'
        })
      },
      {
        name: 'MacBook Air M3 13-inch 256GB',
        description: 'The MacBook Air M3 features a 13.6-inch Liquid Retina display, M3 chip with 8-core CPU and 8-core GPU, 8GB unified memory, and 256GB SSD storage. Includes 18-hour battery life and MagSafe charging.',
        price: 5500000,
        originalPrice: 5800000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'
        ]),
        stock: 12,
        sku: 'MBA-M3-13-256-NP',
        brand: 'Apple',
        weight: 1.24,
        dimensions: JSON.stringify({ length: 30.4, width: 21.5, height: 1.13 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'macbook-air-m3-13-inch-256gb',
        categoryId: categories.find(c => c.name === 'Electronics')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 business days',
        specifications: JSON.stringify({
          'Display': '13.6" Liquid Retina, 2560x1664',
          'Chip': 'Apple M3',
          'CPU': '8-core',
          'GPU': '8-core',
          'Memory': '8GB unified memory',
          'Storage': '256GB SSD',
          'Battery': 'Up to 18 hours',
          'OS': 'macOS Sonoma'
        })
      },
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charge.',
        price: 750000,
        originalPrice: 850000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]),
        stock: 35,
        sku: 'SWH1000XM5-BLK-NP',
        brand: 'Sony',
        weight: 0.25,
        dimensions: JSON.stringify({ length: 27, width: 20, height: 7 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'sony-wh1000xm5-wireless-headphones',
        categoryId: categories.find(c => c.name === 'Electronics')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery',
        specifications: JSON.stringify({
          'Type': 'Over-ear wireless headphones',
          'Noise Canceling': 'Industry-leading',
          'Battery Life': 'Up to 30 hours',
          'Quick Charge': '3 min = 3 hours playback',
          'Connectivity': 'Bluetooth 5.2',
          'Driver': '30mm dynamic drivers'
        })
      },
      {
        name: 'Samsung 55" QLED 4K Smart TV',
        description: 'Experience stunning 4K UHD picture quality with Quantum Dot technology. Smart TV with Tizen OS, built-in streaming apps, and voice control. Perfect for gaming with low input lag.',
        price: 2800000,
        originalPrice: 3200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1461151304267-b35e2241aad8?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'S55QN85C-4K-NP',
        brand: 'Samsung',
        weight: 18.5,
        dimensions: JSON.stringify({ length: 123.2, width: 70.8, height: 5.9 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-55-qled-4k-smart-tv',
        categoryId: categories.find(c => c.name === 'Electronics')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 business days',
        specifications: JSON.stringify({
          'Screen Size': '55 inches',
          'Resolution': '4K UHD (3840x2160)',
          'Display Technology': 'QLED',
          'Smart Platform': 'Tizen OS',
          'HDR': 'HDR10+',
          'Connectivity': 'WiFi, Bluetooth, 4x HDMI, 2x USB'
        })
      },
      // Fashion
      {
        name: 'Nike Air Max 270 React',
        description: 'The Nike Air Max 270 React combines the iconic Air Max silhouette with React foam technology for ultimate comfort. Features a breathable mesh upper and bold colorways.',
        price: 450000,
        originalPrice: 500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'
        ]),
        stock: 50,
        sku: 'NAM270R-10-BLK-NP',
        brand: 'Nike',
        weight: 0.32,
        dimensions: JSON.stringify({ length: 32, width: 12, height: 8 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'nike-air-max-270-react',
        categoryId: categories.find(c => c.name === 'Fashion')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery',
        specifications: JSON.stringify({
          'Type': 'Running shoes',
          'Upper': 'Mesh and synthetic',
          'Midsole': 'Air Max 270 + React foam',
          'Outsole': 'Rubber',
          'Sizes': 'US 6-12',
          'Colors': 'Black, White, Blue'
        })
      },
      {
        name: 'Adidas Ultraboost 22 Running Shoes',
        description: 'The Adidas Ultraboost 22 features responsive Boost midsole technology and Primeknit+ upper for a comfortable, supportive fit. Perfect for daily runs and training.',
        price: 420000,
        originalPrice: 480000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
        ]),
        stock: 40,
        sku: 'AUB22-10-BLK-NP',
        brand: 'Adidas',
        weight: 0.28,
        dimensions: JSON.stringify({ length: 31, width: 11, height: 7 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'adidas-ultraboost-22-running-shoes',
        categoryId: categories.find(c => c.name === 'Fashion')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery',
        specifications: JSON.stringify({
          'Type': 'Running shoes',
          'Upper': 'Primeknit+',
          'Midsole': 'Boost technology',
          'Outsole': 'Continental rubber',
          'Sizes': 'US 6-13',
          'Colors': 'Black, White, Blue'
        })
      },
      // Home & Kitchen
      {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
        description: 'The Instant Pot Duo 7-in-1 Electric Pressure Cooker is a multi-use cooker for the home. It replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
        price: 380000,
        originalPrice: 420000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
        ]),
        stock: 20,
        sku: 'IP-DUO-6QT-NP',
        brand: 'Instant Pot',
        weight: 5.7,
        dimensions: JSON.stringify({ length: 33, width: 33, height: 30 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'instant-pot-duo-7in1-electric-pressure-cooker',
        categoryId: categories.find(c => c.name === 'Home & Kitchen')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 business days',
        specifications: JSON.stringify({
          'Capacity': '6 Quart',
          'Functions': '7-in-1 (Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté Pan, Yogurt Maker, Warmer)',
          'Material': 'Stainless steel',
          'Power': '1000W',
          'Safety': '14 safety mechanisms',
          'Warranty': '1 year'
        })
      },
      {
        name: 'Dyson V15 Detect Cordless Vacuum',
        description: 'The Dyson V15 Detect features laser dust detection, powerful suction, and intelligent suction adjustment. Includes multiple attachments for versatile cleaning throughout your home.',
        price: 1200000,
        originalPrice: 1350000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'DV15D-BLK-NP',
        brand: 'Dyson',
        weight: 3.0,
        dimensions: JSON.stringify({ length: 126, width: 25, height: 25 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'dyson-v15-detect-cordless-vacuum',
        categoryId: categories.find(c => c.name === 'Home & Kitchen')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 business days',
        specifications: JSON.stringify({
          'Type': 'Cordless vacuum cleaner',
          'Suction': '230 AW',
          'Battery Life': 'Up to 60 minutes',
          'Dustbin': '0.77L',
          'Filtration': 'HEPA filtration',
          'Attachments': 'Laser slim fluffy, Combination tool, Crevice tool'
        })
      },
      // Beauty & Health
      {
        name: 'L\'Oréal Paris Revitalift Anti-Aging Cream',
        description: 'Advanced anti-aging cream with Pro-Retinol and Vitamin C. Reduces fine lines and wrinkles while improving skin texture and firmness. Suitable for all skin types.',
        price: 85000,
        originalPrice: 95000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'
        ]),
        stock: 60,
        sku: 'LPR-REV-50ML-NP',
        brand: 'L\'Oréal Paris',
        weight: 0.15,
        dimensions: JSON.stringify({ length: 6, width: 6, height: 4 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'loreal-paris-revitalift-anti-aging-cream',
        categoryId: categories.find(c => c.name === 'Beauty & Health')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery',
        specifications: JSON.stringify({
          'Volume': '50ml',
          'Type': 'Anti-aging cream',
          'Key Ingredients': 'Pro-Retinol, Vitamin C',
          'Skin Type': 'All skin types',
          'Usage': 'Apply morning and evening',
          'SPF': 'No SPF (night cream)'
        })
      },
      {
        name: 'Philips Sonicare DiamondClean Electric Toothbrush',
        description: 'Advanced electric toothbrush with 5 cleaning modes, pressure sensor, and 2-minute timer. Includes premium travel case and multiple brush heads for optimal oral hygiene.',
        price: 180000,
        originalPrice: 200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=600&fit=crop'
        ]),
        stock: 30,
        sku: 'PSD-HX9352-67-NP',
        brand: 'Philips',
        weight: 0.3,
        dimensions: JSON.stringify({ length: 25, width: 5, height: 5 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'philips-sonicare-diamondclean-electric-toothbrush',
        categoryId: categories.find(c => c.name === 'Beauty & Health')?.id,
        vendorId: vendor.id,
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 business days',
        specifications: JSON.stringify({
          'Type': 'Electric toothbrush',
          'Cleaning Modes': '5 modes (Clean, White+, Polish, Gum Care, Sensitive)',
          'Battery Life': 'Up to 2 weeks',
          'Charging': 'Wireless charging glass',
          'Pressure Sensor': 'Yes',
          'Timer': '2-minute timer with 30-second intervals'
        })
      }
    ]

    // Create products
    console.log('📦 Creating real products...')
    const createdProducts = []
    
    for (const product of products) {
      // Check if product already exists by SKU or slug
      const existingProduct = await prisma.product.findFirst({
        where: { 
          OR: [
            { slug: product.slug },
            { sku: product.sku }
          ]
        }
      })
      
      if (!existingProduct) {
        try {
          const newProduct = await prisma.product.create({
            data: product
          })
          createdProducts.push(newProduct)
          console.log(`✅ Created product: ${product.name}`)
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`📦 Product with SKU ${product.sku} already exists: ${product.name}`)
          } else {
            console.error(`❌ Error creating product ${product.name}:`, error.message)
          }
        }
      } else {
        console.log(`📦 Product already exists: ${product.name}`)
      }
    }

    console.log('🎉 Real products seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`- Products created: ${createdProducts.length}`)
    console.log(`- Total products in database: ${await prisma.product.count()}`)
    console.log(`- Categories used: ${categories.length}`)

  } catch (error) {
    console.error('❌ Error seeding real products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
