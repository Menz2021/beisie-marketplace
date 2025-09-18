const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting additional categories seeding...')

  try {
    // Additional categories to make the marketplace more comprehensive
    const additionalCategories = [
      {
        name: 'Laptops & Computers',
        description: 'Laptops, desktops, and computer accessories',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        slug: 'laptops-computers'
      },
      {
        name: 'Tablets',
        description: 'iPads, Android tablets, and tablet accessories',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        slug: 'tablets'
      },
      {
        name: 'Gaming',
        description: 'Gaming consoles, games, and gaming accessories',
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
        slug: 'gaming'
      },
      {
        name: 'Cameras & Photography',
        description: 'Digital cameras, lenses, and photography equipment',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        slug: 'cameras-photography'
      },
      {
        name: 'Audio & Headphones',
        description: 'Headphones, speakers, and audio equipment',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        slug: 'audio-headphones'
      },
      {
        name: 'Wearables',
        description: 'Smartwatches, fitness trackers, and wearable devices',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        slug: 'wearables'
      },
      {
        name: 'Power Banks & Chargers',
        description: 'Portable chargers, power banks, and charging accessories',
        image: 'https://images.unsplash.com/photo-1609592807909-0d0b5a8b8b8b?w=400&h=300&fit=crop',
        slug: 'power-banks-chargers'
      },
      {
        name: 'TVs & Accessories',
        description: 'Televisions, streaming devices, and TV accessories',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
        slug: 'tvs-accessories'
      },
      {
        name: 'Men\'s Fashion',
        description: 'Men\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        slug: 'mens-fashion'
      },
      {
        name: 'Women\'s Fashion',
        description: 'Women\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        slug: 'womens-fashion'
      },
      {
        name: 'Kids Fashion',
        description: 'Children\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        slug: 'kids-fashion'
      },
      {
        name: 'Watches',
        description: 'Men\'s and women\'s watches, smartwatches',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        slug: 'watches'
      },
      {
        name: 'Jewelry',
        description: 'Rings, necklaces, earrings, and jewelry accessories',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
        slug: 'jewelry'
      },
      {
        name: 'Bags & Luggage',
        description: 'Handbags, backpacks, suitcases, and travel bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        slug: 'bags-luggage'
      },
      {
        name: 'Furniture',
        description: 'Home furniture, office furniture, and decor',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'furniture'
      },
      {
        name: 'Home Decor',
        description: 'Wall art, decorative items, and home accessories',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'home-decor'
      },
      {
        name: 'Kitchen Appliances',
        description: 'Kitchen gadgets, appliances, and cooking tools',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        slug: 'kitchen-appliances'
      },
      {
        name: 'Bedding & Bath',
        description: 'Bed sheets, towels, bath accessories, and linens',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'bedding-bath'
      },
      {
        name: 'Lighting',
        description: 'Lamps, light fixtures, and lighting accessories',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'lighting'
      },
      {
        name: 'Storage & Organization',
        description: 'Storage solutions, organizers, and containers',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        slug: 'storage-organization'
      },
      {
        name: 'Makeup',
        description: 'Cosmetics, makeup tools, and beauty products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        slug: 'makeup'
      },
      {
        name: 'Skincare',
        description: 'Face creams, serums, and skincare products',
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
        slug: 'skincare'
      },
      {
        name: 'Haircare',
        description: 'Shampoos, conditioners, and hair styling products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        slug: 'haircare'
      },
      {
        name: 'Fragrance',
        description: 'Perfumes, colognes, and body sprays',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        slug: 'fragrance'
      },
      {
        name: 'Personal Care',
        description: 'Personal hygiene, grooming, and care products',
        image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
        slug: 'personal-care'
      },
      {
        name: 'Baby Care',
        description: 'Baby products, diapers, and infant care items',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
        slug: 'baby-care'
      },
      {
        name: 'Sports & Fitness',
        description: 'Sports equipment, fitness gear, and athletic wear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        slug: 'sports-fitness'
      },
      {
        name: 'Outdoor & Camping',
        description: 'Camping gear, outdoor equipment, and adventure supplies',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
        slug: 'outdoor-camping'
      },
      {
        name: 'Automotive',
        description: 'Car accessories, tools, and automotive supplies',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        slug: 'automotive'
      },
      {
        name: 'Books & Media',
        description: 'Books, magazines, movies, and educational materials',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        slug: 'books-media'
      },
      {
        name: 'Stationery & Office',
        description: 'Office supplies, stationery, and school materials',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        slug: 'stationery-office'
      },
      {
        name: 'Toys & Games',
        description: 'Children\'s toys, board games, and educational toys',
        image: 'https://images.unsplash.com/photo-1558060370-9b7d3b8b8b8b?w=400&h=300&fit=crop',
        slug: 'toys-games'
      },
      {
        name: 'Pet Supplies',
        description: 'Pet food, toys, accessories, and care products',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
        slug: 'pet-supplies'
      },
      {
        name: 'Garden & Outdoor',
        description: 'Gardening tools, plants, and outdoor living items',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        slug: 'garden-outdoor'
      },
      {
        name: 'Tools & Hardware',
        description: 'Hand tools, power tools, and hardware supplies',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
        slug: 'tools-hardware'
      },
      {
        name: 'Health & Wellness',
        description: 'Health supplements, medical devices, and wellness products',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        slug: 'health-wellness'
      },
      {
        name: 'Eyewear',
        description: 'Sunglasses, prescription glasses, and eye care',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop',
        slug: 'eyewear'
      },
      {
        name: 'Groceries',
        description: 'Food items, beverages, and household essentials',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        slug: 'groceries'
      }
    ]

    console.log('📂 Creating additional categories...')
    const createdCategories = []
    
    for (const category of additionalCategories) {
      // Check if category already exists
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
        console.log(`📁 Category already exists: ${category.name}`)
      }
    }

    console.log('🎉 Additional categories seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`- New categories created: ${createdCategories.length}`)
    console.log(`- Total categories in database: ${await prisma.category.count()}`)

  } catch (error) {
    console.error('❌ Error seeding additional categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
