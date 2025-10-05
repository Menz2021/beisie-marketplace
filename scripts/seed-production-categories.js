const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedProductionCategories() {
  console.log('🌱 Starting production categories seeding...')
  
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.count()
    console.log(`📂 Found ${existingCategories} existing categories`)
    
    if (existingCategories > 0) {
      console.log('✅ Categories already exist in production database')
      return
    }

    // Create comprehensive categories list
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Mobiles and Accessories', description: 'Smartphones and accessories', slug: 'mobile-phones' },
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
      { name: 'Watches', description: 'Watches and timepieces', slug: 'watches' },
      { name: 'Baby Care', description: 'Baby products and care essentials', slug: 'baby-care' },
      { name: 'Groceries', description: 'Food items and daily essentials', slug: 'groceries' },
      { name: 'Eyewear', description: 'Sunglasses, prescription glasses, and frames', slug: 'eyewear' },
      { name: 'Stationery', description: 'Office supplies and stationery items', slug: 'stationery' }
    ]

    for (const category of categories) {
      try {
        await prisma.category.create({
          data: category
        })
        console.log(`✅ Created category: ${category.name}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`📁 Category already exists: ${category.name}`)
        } else {
          console.error(`❌ Error creating category ${category.name}:`, error.message)
        }
      }
    }

    // Verify categories were created
    const finalCount = await prisma.category.count()
    console.log(`🎉 Successfully seeded ${finalCount} categories`)

  } catch (error) {
    console.error('❌ Error seeding production categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedProductionCategories()
  .then(() => {
    console.log('✅ Production categories seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Production categories seeding failed:', error)
    process.exit(1)
  })
