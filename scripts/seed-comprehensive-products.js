require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productData = {
  'laptops-computers': [
    { name: 'Dell XPS 13 Plus', price: 1299.99, description: 'Ultra-thin laptop with 13.4" 4K display, Intel i7, 16GB RAM, 512GB SSD' },
    { name: 'ASUS ROG Strix G15', price: 1499.99, description: 'Gaming laptop with RTX 4070, AMD Ryzen 7, 16GB RAM, 1TB SSD' },
    { name: 'Microsoft Surface Laptop 5', price: 1199.99, description: 'Premium laptop with 13.5" touchscreen, Intel i5, 8GB RAM, 256GB SSD' },
    { name: 'MacBook Air M2', price: 1099.99, description: 'Apple laptop with M2 chip, 13.6" Liquid Retina display, 8GB RAM, 256GB SSD' },
    { name: 'HP Pavilion 15', price: 699.99, description: 'Budget laptop with Intel i5, 8GB RAM, 256GB SSD, Windows 11' }
  ],
  'tablets': [
    { name: 'iPad Pro 12.9"', price: 1099.99, description: 'Apple tablet with M2 chip, 12.9" Liquid Retina XDR display, 128GB storage' },
    { name: 'Samsung Galaxy Tab S9', price: 799.99, description: 'Android tablet with 11" AMOLED display, Snapdragon 8 Gen 2, 8GB RAM' },
    { name: 'Microsoft Surface Pro 9', price: 999.99, description: '2-in-1 tablet with Intel i5, 8GB RAM, 256GB SSD, detachable keyboard' },
    { name: 'iPad Air 5th Gen', price: 599.99, description: 'Apple tablet with M1 chip, 10.9" Liquid Retina display, 64GB storage' },
    { name: 'Amazon Fire HD 10', price: 149.99, description: 'Budget tablet with 10.1" HD display, 32GB storage, Alexa built-in' }
  ],
  'gaming': [
    { name: 'PlayStation 5 Console', price: 499.99, description: 'Sony gaming console with 825GB SSD, DualSense controller, 4K gaming' },
    { name: 'Xbox Series X', price: 499.99, description: 'Microsoft gaming console with 1TB SSD, 4K gaming, Game Pass included' },
    { name: 'Nintendo Switch OLED', price: 349.99, description: 'Nintendo handheld console with 7" OLED screen, 64GB storage' },
    { name: 'Steam Deck 512GB', price: 649.99, description: 'Portable gaming PC with AMD APU, 7" touchscreen, 512GB NVMe SSD' },
    { name: 'Gaming PC RTX 4070', price: 1299.99, description: 'Pre-built gaming PC with RTX 4070, Intel i5, 16GB RAM, 1TB SSD' }
  ],
  'cameras-photography': [
    { name: 'Canon EOS R5', price: 3899.99, description: 'Mirrorless camera with 45MP sensor, 8K video, 5-axis stabilization' },
    { name: 'Sony A7 IV', price: 2499.99, description: 'Full-frame mirrorless camera with 33MP sensor, 4K video, 5-axis IBIS' },
    { name: 'DJI Mini 3 Pro', price: 759.99, description: 'Compact drone with 4K video, 48MP camera, 34-minute flight time' },
    { name: 'GoPro Hero 11 Black', price: 399.99, description: 'Action camera with 5.3K video, 27MP photos, waterproof to 10m' },
    { name: 'Fujifilm X-T5', price: 1699.99, description: 'Mirrorless camera with 40MP sensor, 6.2K video, weather-sealed body' }
  ],
  'audio-headphones': [
    { name: 'Bose QuietComfort 45', price: 329.99, description: 'Noise-canceling headphones with 24-hour battery, premium sound' },
    { name: 'Sony WH-1000XM5', price: 399.99, description: 'Wireless noise-canceling headphones with 30-hour battery, LDAC' },
    { name: 'Apple AirPods Pro 2', price: 249.99, description: 'Wireless earbuds with active noise cancellation, spatial audio' },
    { name: 'Sennheiser HD 660S', price: 499.99, description: 'Open-back audiophile headphones with dynamic drivers' },
    { name: 'JBL Charge 5', price: 179.99, description: 'Portable Bluetooth speaker with 20-hour battery, waterproof' }
  ],
  'wearables': [
    { name: 'Apple Watch Series 9', price: 399.99, description: 'Smartwatch with S9 chip, 45mm display, GPS, health monitoring' },
    { name: 'Samsung Galaxy Watch 6 Classic', price: 349.99, description: 'Android smartwatch with rotating bezel, 47mm, LTE option' },
    { name: 'Fitbit Versa 4', price: 199.99, description: 'Fitness smartwatch with 6-day battery, GPS, health tracking' },
    { name: 'Garmin Fenix 7', price: 699.99, description: 'Premium multisport GPS watch with solar charging, maps' },
    { name: 'Amazfit GTR 4', price: 199.99, description: 'Smartwatch with 14-day battery, GPS, heart rate monitoring' }
  ],
  'mens-fashion': [
    { name: 'Nike Air Jordan 1 Retro', price: 170.00, description: 'Classic basketball sneakers in original colorway, leather upper' },
    { name: 'Adidas Ultraboost 23', price: 190.00, description: 'Running shoes with Boost midsole, Primeknit upper, Continental rubber' },
    { name: 'Levi\'s 501 Original Jeans', price: 98.00, description: 'Classic straight-fit jeans in rigid denim, button fly' },
    { name: 'Patagonia Better Sweater', price: 99.00, description: 'Fleece jacket made from recycled polyester, full-zip' },
    { name: 'Uniqlo Heattech Crew Neck', price: 19.90, description: 'Thermal base layer with moisture-wicking technology' }
  ],
  'womens-fashion': [
    { name: 'Zara Blazer with Pockets', price: 79.90, description: 'Classic blazer in wool blend, two-button closure, side pockets' },
    { name: 'H&M Cotton T-Shirt', price: 9.99, description: 'Basic cotton t-shirt in various colors, regular fit' },
    { name: 'Nike Women\'s Air Force 1', price: 90.00, description: 'Classic white sneakers with leather upper, rubber sole' },
    { name: 'Levi\'s Women\'s 501 Jeans', price: 98.00, description: 'Straight-fit jeans in stretch denim, high-rise waist' },
    { name: 'Everlane The Cashmere Crew', price: 98.00, description: 'Cashmere sweater in classic crew neck, machine washable' }
  ],
  'home-decor': [
    { name: 'IKEA FADO Table Lamp', price: 24.99, description: 'Modern table lamp with glass shade, dimmable LED bulb' },
    { name: 'West Elm Ceramic Vase', price: 89.00, description: 'Hand-glazed ceramic vase in neutral tones, 12" height' },
    { name: 'Anthropologie Throw Pillow', price: 48.00, description: 'Decorative pillow with botanical print, 18x18 inches' },
    { name: 'CB2 Wall Mirror', price: 199.00, description: 'Round wall mirror with brass frame, 24" diameter' },
    { name: 'Pottery Barn Candle Set', price: 39.00, description: 'Set of 3 scented candles in glass jars, various fragrances' }
  ],
  'kitchen-appliances': [
    { name: 'KitchenAid Stand Mixer', price: 329.99, description: '5-quart stand mixer with dough hook, whisk, and paddle attachments' },
    { name: 'Instant Pot Duo 7-in-1', price: 99.99, description: 'Electric pressure cooker with 6-quart capacity, 7 cooking functions' },
    { name: 'Vitamix A3500 Blender', price: 499.99, description: 'High-performance blender with 64-oz container, variable speed' },
    { name: 'Breville Smart Oven', price: 249.99, description: 'Convection toaster oven with 6 cooking functions, 1800W' },
    { name: 'Cuisinart Coffee Maker', price: 89.99, description: '12-cup programmable coffee maker with thermal carafe' }
  ],
  'beauty': [
    { name: 'L\'Oréal Paris Revitalift', price: 24.99, description: 'Anti-aging night cream with retinol, 1.7 fl oz' },
    { name: 'The Ordinary Niacinamide 10%', price: 6.20, description: 'Serum with niacinamide and zinc, 30ml' },
    { name: 'Fenty Beauty Pro Filt\'r Foundation', price: 35.00, description: 'Long-wear foundation with 50 shades, 1 fl oz' },
    { name: 'Glossier Boy Brow', price: 16.00, description: 'Tinted brow gel with fibers, 0.1 fl oz' },
    { name: 'Drunk Elephant C-Firma Serum', price: 78.00, description: 'Vitamin C serum with L-ascorbic acid, 1 fl oz' }
  ],
  'sports-fitness': [
    { name: 'Nike Dri-FIT Training Top', price: 35.00, description: 'Moisture-wicking training shirt with breathable fabric' },
    { name: 'Lululemon Align Leggings', price: 98.00, description: 'High-rise leggings with Nulu fabric, 25" inseam' },
    { name: 'Under Armour Training Shoes', price: 80.00, description: 'Cross-training shoes with responsive cushioning' },
    { name: 'Yoga Mat Premium', price: 45.00, description: 'Non-slip yoga mat with carrying strap, 72" x 24"' },
    { name: 'Resistance Bands Set', price: 19.99, description: 'Set of 5 resistance bands with door anchor and handles' }
  ],
  'books-media': [
    { name: 'The Seven Husbands of Evelyn Hugo', price: 16.99, description: 'Bestselling novel by Taylor Jenkins Reid, paperback' },
    { name: 'Atomic Habits', price: 18.99, description: 'Self-help book by James Clear on building good habits' },
    { name: 'The Midnight Library', price: 15.99, description: 'Fiction novel by Matt Haig, paperback edition' },
    { name: 'Educated', price: 17.99, description: 'Memoir by Tara Westover, New York Times bestseller' },
    { name: 'Sapiens', price: 19.99, description: 'Non-fiction book by Yuval Noah Harari on human history' }
  ]
};

async function seedComprehensiveProducts() {
  try {
    console.log('🌱 Starting comprehensive product seeding...');
    
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
      const products = productData[category.slug] || [];
      
      if (products.length === 0) {
        // Create generic products for categories without specific data
        products.push(
          { name: `${category.name} Item 1`, price: 29.99, description: `High-quality ${category.name.toLowerCase()} product` },
          { name: `${category.name} Item 2`, price: 49.99, description: `Premium ${category.name.toLowerCase()} with advanced features` },
          { name: `${category.name} Item 3`, price: 19.99, description: `Budget-friendly ${category.name.toLowerCase()} option` }
        );
      }
      
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
                `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=500&h=500&fit=crop`,
                `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=500&h=500&fit=crop`
              ]
            }
          });
          totalProducts++;
        } catch (error) {
          console.log(`⚠️  Skipped duplicate product: ${productData.name}`);
        }
      }
      
      console.log(`✅ Added ${products.length} products to ${category.name}`);
    }
    
    console.log('\n🎉 Comprehensive product seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`- Total products created: ${totalProducts}`);
    console.log(`- Categories covered: ${categories.length}`);
    console.log(`- Vendor: ${vendor.name}`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensiveProducts();
