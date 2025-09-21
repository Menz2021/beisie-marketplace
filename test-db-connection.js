require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Mugoyaronald2020@db.blqarrlpyteuelqwslen.supabase.co:5432/postgres'
    }
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection successful');
    
    // Test categories
    const categories = await prisma.category.findMany({
      take: 3,
      select: { id: true, name: true, slug: true }
    });
    console.log('✅ Categories query successful:', categories.length);
    
    // Test products
    const products = await prisma.product.findMany({
      take: 3,
      select: { id: true, name: true, price: true }
    });
    console.log('✅ Products query successful:', products.length);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
