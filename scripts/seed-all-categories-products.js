const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function seedAllCategoriesProducts() {
  console.log('🌱 Starting comprehensive product seeding across all categories...')
  
  try {
    // Get all existing categories
    const categories = await prisma.category.findMany()
    console.log(`📂 Found ${categories.length} categories in database`)
    
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run category seeding first.')
      return
    }

    // Create or get a test vendor
    console.log('👤 Setting up vendor...')
    let vendor = await prisma.user.findFirst({
      where: { email: 'vendor@allproducts.ug' }
    })
    
    if (!vendor) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      vendor = await prisma.user.create({
        data: {
          name: 'AllProducts Store',
          email: 'vendor@allproducts.ug',
          password: hashedPassword,
          role: 'SELLER',
          isVerified: true,
          isActive: true,
          businessName: 'AllProducts Store',
          businessType: 'Multi-Category Retailer',
          district: 'Kampala',
          address: 'Kampala, Uganda'
        }
      })
      console.log('✅ Created vendor: AllProducts Store')
    } else {
      console.log('👤 Using existing vendor: AllProducts Store')
    }

    // Comprehensive product data for all categories
    const allProducts = [
      // ELECTRONICS
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'The ultimate Samsung flagship with S Pen, 200MP camera, and AI-powered features. Experience the future of mobile technology with titanium design and advanced photography capabilities.',
        price: 5500000,
        originalPrice: 6000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'SGS24U-512-TIT',
        brand: 'Samsung',
        weight: 0.232,
        dimensions: JSON.stringify({ length: 16.2, width: 7.9, height: 0.8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'samsung-galaxy-s24-ultra',
        categorySlug: 'electronics',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Apple MacBook Pro 16" M3 Max',
        description: 'The most powerful MacBook Pro with M3 Max chip, 16-inch Liquid Retina XDR display, and up to 22 hours of battery life. Perfect for professionals and content creators.',
        price: 12000000,
        originalPrice: 13000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
        ]),
        stock: 3,
        sku: 'MBP16-M3MAX-1TB',
        brand: 'Apple',
        weight: 2.16,
        dimensions: JSON.stringify({ length: 35.57, width: 24.81, height: 1.68 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'macbook-pro-16-m3-max',
        categorySlug: 'electronics',
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling with 30-hour battery life. Features speak-to-chat technology and multipoint connection for seamless audio experience.',
        price: 850000,
        originalPrice: 950000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'SWH1000XM5-BLK',
        brand: 'Sony',
        weight: 0.25,
        dimensions: JSON.stringify({ length: 27, width: 20, height: 7 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'sony-wh-1000xm5-headphones',
        categorySlug: 'electronics',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },

      // MOBILE PHONES
      {
        name: 'iPhone 15 Pro Max',
        description: 'The most advanced iPhone with titanium design, A17 Pro chip, and Action Button. Features a 48MP main camera with 5x optical zoom and USB-C connectivity.',
        price: 6200000,
        originalPrice: 6800000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop'
        ]),
        stock: 6,
        sku: 'IP15PM-256-TIT',
        brand: 'Apple',
        weight: 0.221,
        dimensions: JSON.stringify({ length: 15.9, width: 7.7, height: 0.83 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'iphone-15-pro-max',
        categorySlug: 'mobile-phones',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Google\'s flagship smartphone with Tensor G3 chip, advanced AI features, and exceptional camera system. Includes Magic Eraser and Night Sight capabilities.',
        price: 4800000,
        originalPrice: 5200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 10,
        sku: 'GP8P-256-OBS',
        brand: 'Google',
        weight: 0.213,
        dimensions: JSON.stringify({ length: 16.2, width: 7.6, height: 0.88 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'google-pixel-8-pro',
        categorySlug: 'mobile-phones',
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },
      {
        name: 'OnePlus 12',
        description: 'Flagship killer with Snapdragon 8 Gen 3, 100W SuperVOOC charging, and Hasselblad camera system. Premium design with fast performance and long battery life.',
        price: 4200000,
        originalPrice: 4600000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ]),
        stock: 12,
        sku: 'OP12-256-SIL',
        brand: 'OnePlus',
        weight: 0.22,
        dimensions: JSON.stringify({ length: 16.4, width: 7.6, height: 0.92 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'oneplus-12',
        categorySlug: 'mobile-phones',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },

      // FASHION
      {
        name: 'Nike Air Jordan 1 Retro High',
        description: 'The iconic Air Jordan 1 in classic colorway. Premium leather construction with Air-Sole unit for comfort and style. A must-have for sneaker enthusiasts.',
        price: 650000,
        originalPrice: 750000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
        ]),
        stock: 20,
        sku: 'NAJ1-RH-BLK',
        brand: 'Nike',
        weight: 0.4,
        dimensions: JSON.stringify({ length: 33, width: 12, height: 10 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'nike-air-jordan-1-retro-high',
        categorySlug: 'fashion',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Adidas Ultraboost 23',
        description: 'Latest Ultraboost with responsive Boost midsole and Primeknit+ upper. Perfect for running and daily wear with maximum comfort and energy return.',
        price: 420000,
        originalPrice: 480000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'
        ]),
        stock: 25,
        sku: 'AUB23-10-WHT',
        brand: 'Adidas',
        weight: 0.31,
        dimensions: JSON.stringify({ length: 32, width: 12, height: 8 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'adidas-ultraboost-23',
        categorySlug: 'fashion',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'The original blue jean with straight fit and button fly. Made from 100% cotton denim with classic 5-pocket styling. Timeless style that never goes out of fashion.',
        price: 180000,
        originalPrice: 220000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=600&fit=crop'
        ]),
        stock: 30,
        sku: 'LEV501-32-BLU',
        brand: 'Levi\'s',
        weight: 0.6,
        dimensions: JSON.stringify({ length: 42, width: 32, height: 1 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'levis-501-original-jeans',
        categorySlug: 'fashion',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },

      // HOME & KITCHEN
      {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional-grade stand mixer with 5-quart bowl and 10 speeds. Includes dough hook, flat beater, and wire whip. Perfect for baking enthusiasts and professional kitchens.',
        price: 1200000,
        originalPrice: 1400000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'KA-SM-5QT-RED',
        brand: 'KitchenAid',
        weight: 12.5,
        dimensions: JSON.stringify({ length: 35, width: 25, height: 35 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'kitchenaid-stand-mixer',
        categorySlug: 'home-kitchen',
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },
      {
        name: 'Dyson V15 Detect Vacuum',
        description: 'Cordless vacuum with laser dust detection and powerful suction. Up to 60 minutes of run time with advanced filtration system. Lightweight and versatile for all floor types.',
        price: 1500000,
        originalPrice: 1700000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc8?w=600&h=600&fit=crop'
        ]),
        stock: 5,
        sku: 'DYS-V15-DET',
        brand: 'Dyson',
        weight: 3.0,
        dimensions: JSON.stringify({ length: 126, width: 25, height: 25 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'dyson-v15-detect-vacuum',
        categorySlug: 'home-kitchen',
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Multi-use electric pressure cooker that replaces 7 kitchen appliances. Features pressure cooking, slow cooking, rice cooking, steaming, sautéing, yogurt making, and warming.',
        price: 380000,
        originalPrice: 450000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'IP-DUO-6QT',
        brand: 'Instant Pot',
        weight: 5.7,
        dimensions: JSON.stringify({ length: 33, width: 33, height: 30 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'instant-pot-duo-7in1',
        categorySlug: 'home-kitchen',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },

      // BEAUTY & HEALTH
      {
        name: 'L\'Oréal Paris Revitalift Anti-Aging Cream',
        description: 'Advanced anti-aging face moisturizer with Pro-Retinol, Hyaluronic Acid, and Vitamin C. Reduces wrinkles and fine lines while providing deep hydration for youthful-looking skin.',
        price: 95000,
        originalPrice: 120000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'
        ]),
        stock: 50,
        sku: 'LOR-REV-50ML',
        brand: 'L\'Oréal Paris',
        weight: 0.15,
        dimensions: JSON.stringify({ length: 8, width: 5, height: 5 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'loreal-revitalift-anti-aging-cream',
        categorySlug: 'beauty-health',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        description: 'High-strength vitamin and mineral blemish formula with 10% niacinamide and 1% zinc. Helps reduce the appearance of blemishes and balance visible sebum activity.',
        price: 45000,
        originalPrice: 60000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
        ]),
        stock: 40,
        sku: 'TO-NIA-30ML',
        brand: 'The Ordinary',
        weight: 0.05,
        dimensions: JSON.stringify({ length: 6, width: 3, height: 8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'ordinary-niacinamide-10-zinc-1',
        categorySlug: 'beauty-health',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },
      {
        name: 'Oral-B Pro 1000 Electric Toothbrush',
        description: '3D cleaning action with oscillating-rotating technology. Features pressure sensor and 2-minute timer. Includes 1 brush head and travel case for optimal oral hygiene.',
        price: 180000,
        originalPrice: 220000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1607619056574-7b8d3f5367d1?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop'
        ]),
        stock: 25,
        sku: 'OB-PRO1000-WHT',
        brand: 'Oral-B',
        weight: 0.2,
        dimensions: JSON.stringify({ length: 25, width: 4, height: 4 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'oral-b-pro-1000-electric-toothbrush',
        categorySlug: 'beauty-health',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },

      // LAPTOPS & COMPUTERS
      {
        name: 'Dell XPS 13 Plus',
        description: 'Ultra-thin laptop with 13.4-inch OLED touch display, Intel Core i7 processor, and 16GB RAM. Features edge-to-edge keyboard and premium build quality for professionals.',
        price: 8500000,
        originalPrice: 9500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
        ]),
        stock: 4,
        sku: 'DLL-XPS13P-16GB',
        brand: 'Dell',
        weight: 1.26,
        dimensions: JSON.stringify({ length: 29.5, width: 19.9, height: 1.5 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'dell-xps-13-plus',
        categorySlug: 'laptops-computers',
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },
      {
        name: 'ASUS ROG Strix G15 Gaming Laptop',
        description: 'High-performance gaming laptop with AMD Ryzen 7 processor, NVIDIA RTX 4060 graphics, and 16GB RAM. Features 15.6-inch 144Hz display for smooth gaming experience.',
        price: 7200000,
        originalPrice: 8000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
        ]),
        stock: 6,
        sku: 'ASU-ROG-G15-RTX4060',
        brand: 'ASUS',
        weight: 2.3,
        dimensions: JSON.stringify({ length: 35.4, width: 25.9, height: 2.3 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'asus-rog-strix-g15-gaming-laptop',
        categorySlug: 'laptops-computers',
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },
      {
        name: 'Microsoft Surface Laptop 5',
        description: 'Premium laptop with 13.5-inch PixelSense touchscreen, Intel Core i5 processor, and all-day battery life. Features premium Alcantara keyboard and Windows 11.',
        price: 6500000,
        originalPrice: 7200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
        ]),
        stock: 7,
        sku: 'MS-SL5-13-i5',
        brand: 'Microsoft',
        weight: 1.27,
        dimensions: JSON.stringify({ length: 30.8, width: 22.3, height: 1.4 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'microsoft-surface-laptop-5',
        categorySlug: 'laptops-computers',
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },

      // GAMING
      {
        name: 'PlayStation 5 Console',
        description: 'Next-generation gaming console with ultra-high-speed SSD, 3D audio, and 4K gaming. Includes DualSense wireless controller with haptic feedback and adaptive triggers.',
        price: 4500000,
        originalPrice: 5000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606811841689-23dfddceeee1?w=600&h=600&fit=crop'
        ]),
        stock: 3,
        sku: 'PS5-CONSOLE-825GB',
        brand: 'Sony',
        weight: 4.5,
        dimensions: JSON.stringify({ length: 39, width: 26, height: 9.6 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'playstation-5-console',
        categorySlug: 'gaming',
        deliveryTimeDays: 5,
        deliveryTimeText: '1 week delivery'
      },
      {
        name: 'Xbox Series X Console',
        description: 'Most powerful Xbox console with 12 teraflops of processing power. Features 4K gaming, 120 FPS support, and Quick Resume technology for seamless gaming experience.',
        price: 4200000,
        originalPrice: 4700000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606811841689-23dfddceeee1?w=600&h=600&fit=crop'
        ]),
        stock: 4,
        sku: 'XB-SX-1TB',
        brand: 'Microsoft',
        weight: 4.45,
        dimensions: JSON.stringify({ length: 30.1, width: 15.1, height: 15.1 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'xbox-series-x-console',
        categorySlug: 'gaming',
        deliveryTimeDays: 5,
        deliveryTimeText: '1 week delivery'
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Handheld gaming console with 7-inch OLED screen, 64GB storage, and Joy-Con controllers. Features vibrant colors and crisp contrast for immersive gaming.',
        price: 2800000,
        originalPrice: 3200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606811841689-23dfddceeee1?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'NSW-OLED-64GB',
        brand: 'Nintendo',
        weight: 0.42,
        dimensions: JSON.stringify({ length: 24.2, width: 10.2, height: 1.4 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'nintendo-switch-oled',
        categorySlug: 'gaming',
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },

      // CAMERAS & PHOTOGRAPHY
      {
        name: 'Canon EOS R5 Mirrorless Camera',
        description: 'Professional mirrorless camera with 45MP full-frame sensor, 8K video recording, and advanced autofocus. Features 5-axis image stabilization and weather sealing.',
        price: 8500000,
        originalPrice: 9500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop'
        ]),
        stock: 2,
        sku: 'CAN-EOSR5-BODY',
        brand: 'Canon',
        weight: 0.65,
        dimensions: JSON.stringify({ length: 13.8, width: 9.7, height: 8.8 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'canon-eos-r5-mirrorless-camera',
        categorySlug: 'cameras-photography',
        deliveryTimeDays: 7,
        deliveryTimeText: '1-2 weeks delivery'
      },
      {
        name: 'Sony A7 IV Mirrorless Camera',
        description: 'Full-frame mirrorless camera with 33MP sensor, 4K video, and advanced autofocus. Features 5-axis image stabilization and professional video capabilities.',
        price: 7200000,
        originalPrice: 8000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop'
        ]),
        stock: 3,
        sku: 'SON-A7IV-BODY',
        brand: 'Sony',
        weight: 0.65,
        dimensions: JSON.stringify({ length: 13.1, width: 9.6, height: 8.2 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'sony-a7-iv-mirrorless-camera',
        categorySlug: 'cameras-photography',
        deliveryTimeDays: 5,
        deliveryTimeText: '1 week delivery'
      },
      {
        name: 'DJI Mini 3 Pro Drone',
        description: 'Compact drone with 4K camera, 3-axis gimbal, and 47-minute flight time. Features obstacle avoidance and intelligent flight modes for stunning aerial photography.',
        price: 3200000,
        originalPrice: 3600000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
        ]),
        stock: 5,
        sku: 'DJI-MINI3P-FLY',
        brand: 'DJI',
        weight: 0.249,
        dimensions: JSON.stringify({ length: 14.5, width: 8.2, height: 3.2 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'dji-mini-3-pro-drone',
        categorySlug: 'cameras-photography',
        deliveryTimeDays: 3,
        deliveryTimeText: '3-5 days delivery'
      },

      // AUDIO & HEADPHONES
      {
        name: 'Bose QuietComfort 45 Headphones',
        description: 'Premium noise-canceling headphones with 24-hour battery life and comfortable over-ear design. Features world-class noise cancellation and clear voice pickup.',
        price: 750000,
        originalPrice: 850000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]),
        stock: 12,
        sku: 'BOS-QC45-BLK',
        brand: 'Bose',
        weight: 0.24,
        dimensions: JSON.stringify({ length: 26, width: 20, height: 7 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'bose-quietcomfort-45-headphones',
        categorySlug: 'audio-headphones',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Sennheiser HD 660S Headphones',
        description: 'Open-back audiophile headphones with detailed sound reproduction and comfortable fit. Features 150Ω impedance and premium build quality for music enthusiasts.',
        price: 950000,
        originalPrice: 1100000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'SEN-HD660S',
        brand: 'Sennheiser',
        weight: 0.26,
        dimensions: JSON.stringify({ length: 28, width: 20, height: 8 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'sennheiser-hd-660s-headphones',
        categorySlug: 'audio-headphones',
        deliveryTimeDays: 2,
        deliveryTimeText: '2-3 days delivery'
      },
      {
        name: 'JBL Charge 5 Portable Speaker',
        description: 'Waterproof portable speaker with powerful bass and 20-hour battery life. Features PartyBoost for connecting multiple speakers and USB-C charging.',
        price: 280000,
        originalPrice: 320000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
        ]),
        stock: 20,
        sku: 'JBL-CHG5-BLK',
        brand: 'JBL',
        weight: 0.96,
        dimensions: JSON.stringify({ length: 22, width: 9.6, height: 9.6 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'jbl-charge-5-portable-speaker',
        categorySlug: 'audio-headphones',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      },

      // WEARABLES
      {
        name: 'Apple Watch Series 9',
        description: 'Latest Apple Watch with S9 chip, Always-On Retina display, and advanced health features. Includes ECG, blood oxygen monitoring, and fitness tracking.',
        price: 1800000,
        originalPrice: 2000000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
        ]),
        stock: 10,
        sku: 'AW-S9-45MM-GPS',
        brand: 'Apple',
        weight: 0.039,
        dimensions: JSON.stringify({ length: 4.5, width: 3.8, height: 1.1 }),
        isActive: true,
        isFeatured: true,
        approvalStatus: 'APPROVED',
        slug: 'apple-watch-series-9',
        categorySlug: 'wearables',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic',
        description: 'Premium smartwatch with rotating bezel, advanced health monitoring, and 40-hour battery life. Features sleep tracking, heart rate monitoring, and fitness coaching.',
        price: 1200000,
        originalPrice: 1400000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
        ]),
        stock: 8,
        sku: 'SGW6C-47MM-BLK',
        brand: 'Samsung',
        weight: 0.059,
        dimensions: JSON.stringify({ length: 4.6, width: 4.6, height: 1.1 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'samsung-galaxy-watch-6-classic',
        categorySlug: 'wearables',
        deliveryTimeDays: 1,
        deliveryTimeText: 'Next day delivery'
      },
      {
        name: 'Fitbit Versa 4 Fitness Smartwatch',
        description: 'Advanced fitness smartwatch with built-in GPS, 6+ day battery life, and comprehensive health metrics. Features sleep tracking, stress management, and workout intensity zones.',
        price: 450000,
        originalPrice: 550000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
        ]),
        stock: 15,
        sku: 'FIT-V4-BLK',
        brand: 'Fitbit',
        weight: 0.035,
        dimensions: JSON.stringify({ length: 4.0, width: 4.0, height: 1.2 }),
        isActive: true,
        isFeatured: false,
        approvalStatus: 'APPROVED',
        slug: 'fitbit-versa-4-fitness-smartwatch',
        categorySlug: 'wearables',
        deliveryTimeDays: 0,
        deliveryTimeText: 'Same day delivery'
      }
    ]

    // Create a mapping of category slugs to category IDs
    const categoryMap = {}
    categories.forEach(category => {
      categoryMap[category.slug] = category.id
    })

    console.log('📦 Creating products across all categories...')
    let createdCount = 0
    let skippedCount = 0

    for (const product of allProducts) {
      try {
        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: { 
            OR: [
              { slug: product.slug },
              { sku: product.sku }
            ]
          }
        })
        
        if (!existingProduct) {
          // Get category ID
          const categoryId = categoryMap[product.categorySlug]
          if (!categoryId) {
            console.log(`⚠️  Category not found for product: ${product.name}`)
            continue
          }

          // Remove categorySlug and add categoryId
          const { categorySlug, ...productData } = product
          productData.categoryId = categoryId
          productData.vendorId = vendor.id

          await prisma.product.create({
            data: productData
          })
          createdCount++
          console.log(`✅ Created product: ${product.name} (${product.categorySlug})`)
        } else {
          skippedCount++
          console.log(`📦 Product already exists: ${product.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating product ${product.name}:`, error.message)
      }
    }

    console.log('\n🎉 Comprehensive product seeding completed!')
    console.log(`📊 Summary:`)
    console.log(`- Products created: ${createdCount}`)
    console.log(`- Products skipped: ${skippedCount}`)
    console.log(`- Total products in database: ${await prisma.product.count()}`)
    console.log(`- Categories covered: ${categories.length}`)
    console.log(`- Vendor: ${vendor.name}`)

    console.log('\n🔗 You can now browse products at:')
    console.log('- http://localhost:3000/products')
    console.log('- http://localhost:3000/categories/electronics')
    console.log('- http://localhost:3000/categories/mobile-phones')
    console.log('- http://localhost:3000/categories/fashion')
    console.log('- And all other categories!')

  } catch (error) {
    console.error('❌ Error seeding products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAllCategoriesProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
