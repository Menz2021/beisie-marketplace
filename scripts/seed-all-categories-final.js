require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categoryProducts = {
  'laptops-computers': [
    { name: 'Dell XPS 13 Plus', price: 1299.99, description: 'Ultra-thin laptop with 13.4" 4K display' },
    { name: 'MacBook Air M2', price: 1099.99, description: 'Apple laptop with M2 chip' },
    { name: 'ASUS ROG Strix G15', price: 1499.99, description: 'Gaming laptop with RTX 4070' }
  ],
  'tablets': [
    { name: 'iPad Pro 12.9"', price: 1099.99, description: 'Apple tablet with M2 chip' },
    { name: 'Samsung Galaxy Tab S9', price: 799.99, description: 'Android tablet with AMOLED display' },
    { name: 'Microsoft Surface Pro 9', price: 999.99, description: '2-in-1 tablet with detachable keyboard' }
  ],
  'gaming': [
    { name: 'PlayStation 5 Console', price: 499.99, description: 'Sony gaming console with 4K gaming' },
    { name: 'Xbox Series X', price: 499.99, description: 'Microsoft gaming console with Game Pass' },
    { name: 'Nintendo Switch OLED', price: 349.99, description: 'Nintendo handheld console' }
  ],
  'cameras-photography': [
    { name: 'Canon EOS R5', price: 3899.99, description: 'Mirrorless camera with 45MP sensor' },
    { name: 'Sony A7 IV', price: 2499.99, description: 'Full-frame mirrorless camera' },
    { name: 'DJI Mini 3 Pro', price: 759.99, description: 'Compact drone with 4K video' }
  ],
  'audio-headphones': [
    { name: 'Bose QuietComfort 45', price: 329.99, description: 'Noise-canceling headphones' },
    { name: 'Sony WH-1000XM5', price: 399.99, description: 'Wireless noise-canceling headphones' },
    { name: 'Apple AirPods Pro 2', price: 249.99, description: 'Wireless earbuds with noise cancellation' }
  ],
  'wearables': [
    { name: 'Apple Watch Series 9', price: 399.99, description: 'Smartwatch with S9 chip' },
    { name: 'Samsung Galaxy Watch 6', price: 349.99, description: 'Android smartwatch' },
    { name: 'Fitbit Versa 4', price: 199.99, description: 'Fitness smartwatch' }
  ],
  'mens-fashion': [
    { name: 'Nike Air Jordan 1', price: 170.00, description: 'Classic basketball sneakers' },
    { name: 'Adidas Ultraboost 23', price: 190.00, description: 'Running shoes with Boost midsole' },
    { name: 'Levi\'s 501 Jeans', price: 98.00, description: 'Classic straight-fit jeans' }
  ],
  'womens-fashion': [
    { name: 'Zara Blazer', price: 79.90, description: 'Classic blazer in wool blend' },
    { name: 'H&M Cotton T-Shirt', price: 9.99, description: 'Basic cotton t-shirt' },
    { name: 'Nike Women\'s Air Force 1', price: 90.00, description: 'Classic white sneakers' }
  ],
  'home-decor': [
    { name: 'IKEA Table Lamp', price: 24.99, description: 'Modern table lamp' },
    { name: 'West Elm Ceramic Vase', price: 89.00, description: 'Hand-glazed ceramic vase' },
    { name: 'Anthropologie Throw Pillow', price: 48.00, description: 'Decorative pillow' }
  ],
  'kitchen-appliances': [
    { name: 'KitchenAid Stand Mixer', price: 329.99, description: '5-quart stand mixer' },
    { name: 'Instant Pot Duo', price: 99.99, description: 'Electric pressure cooker' },
    { name: 'Vitamix Blender', price: 499.99, description: 'High-performance blender' }
  ],
  'beauty': [
    { name: 'L\'Oréal Revitalift', price: 24.99, description: 'Anti-aging night cream' },
    { name: 'The Ordinary Niacinamide', price: 6.20, description: 'Serum with niacinamide' },
    { name: 'Fenty Beauty Foundation', price: 35.00, description: 'Long-wear foundation' }
  ],
  'sports-fitness': [
    { name: 'Nike Training Top', price: 35.00, description: 'Moisture-wicking training shirt' },
    { name: 'Lululemon Leggings', price: 98.00, description: 'High-rise leggings' },
    { name: 'Yoga Mat', price: 45.00, description: 'Non-slip yoga mat' }
  ],
  'books-media': [
    { name: 'The Seven Husbands of Evelyn Hugo', price: 16.99, description: 'Bestselling novel' },
    { name: 'Atomic Habits', price: 18.99, description: 'Self-help book' },
    { name: 'The Midnight Library', price: 15.99, description: 'Fiction novel' }
  ]
};

async function seedAllCategories() {
  try {
    console.log('🌱 Starting comprehensive category and product seeding...');
    
    // Get all categories
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true }
    });
    
    console.log(`📂 Found ${categories.length} categories in database`);
    
    // Get or create vendor
    let vendor = await prisma.user.findFirst({
      where: { role: 'VENDOR' }
    });
    
    if (!vendor) {
      vendor = await prisma.user.create({
        data: {
          email: 'vendor@allproducts.com',
          name: 'AllProducts Store',
          password: 'vendor123',
          role: 'VENDOR'
        }
      });
      console.log('✅ Created vendor: AllProducts Store');
    } else {
      console.log('✅ Using existing vendor:', vendor.name);
    }
    
    let totalProducts = 0;
    
    // Add products to each category
    for (const category of categories) {
      const products = categoryProducts[category.slug] || [
        { name: `${category.name} Premium Item`, price: 49.99, description: `High-quality ${category.name.toLowerCase()} product` },
        { name: `${category.name} Standard Item`, price: 29.99, description: `Standard ${category.name.toLowerCase()} option` },
        { name: `${category.name} Basic Item`, price: 19.99, description: `Budget-friendly ${category.name.toLowerCase()}` }
      ];
      
      let categoryProductCount = 0;
      
      for (const productData of products) {
        try {
          await prisma.product.create({
            data: {
              name: productData.name,
              description: productData.description,
              price: productData.price,
              categoryId: category.id,
              vendorId: vendor.id,
              status: 'APPROVED',
              stock: Math.floor(Math.random() * 100) + 10,
              images: [
                `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=500&h=500&fit=crop`
              ]
            }
          });
          categoryProductCount++;
          totalProducts++;
        } catch (error) {
          // Skip duplicates
        }
      }
      
      console.log(`✅ Added ${categoryProductCount} products to ${category.name}`);
    }
    
    console.log('\n🎉 Comprehensive seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`- Total products created: ${totalProducts}`);
    console.log(`- Categories covered: ${categories.length}`);
    console.log(`- Vendor: ${vendor.name}`);
    
  } catch (error) {
    console.error('❌ Error seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllCategories();
