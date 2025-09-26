const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProductImages() {
  try {
    console.log('🔍 Checking product images in database...');
    
    // Get all products with their image data
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        images: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📦 Found ${products.length} products:`);
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Created: ${product.createdAt}`);
      console.log(`   Images: ${product.images}`);
      
      // Try to parse images
      try {
        const imageArray = JSON.parse(product.images);
        console.log(`   Parsed images: ${JSON.stringify(imageArray, null, 2)}`);
      } catch (error) {
        console.log(`   ❌ Failed to parse images: ${error.message}`);
      }
    });
    
    // Check if uploads directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    console.log(`\n📁 Checking uploads directory: ${uploadsDir}`);
    console.log(`   Directory exists: ${fs.existsSync(uploadsDir)}`);
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`   Files in directory: ${files.length}`);
      if (files.length > 0) {
        console.log(`   Files: ${files.join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductImages();
