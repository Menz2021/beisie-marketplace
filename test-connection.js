require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
    
    const categories = await prisma.category.findMany({
      take: 3,
      select: { id: true, name: true, slug: true }
    });
    
    const products = await prisma.product.findMany({
      take: 3,
      select: { id: true, name: true, price: true }
    });
    
    console.log('✅ Database connection successful!');
    console.log('📊 Categories found:', categories.length);
    console.log('📊 Products found:', products.length);
    console.log('📋 Sample categories:', categories);
    console.log('🛍️  Sample products:', products);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
