const { PrismaClient } = require('@prisma/client');

async function testPooler() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres.blqarrlpyteuelqwslen:Mugoyaronald2020@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
      }
    }
  });

  try {
    console.log('🔍 Testing Supabase Connection Pooler...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Pooler connection successful:', result);
    
    // Test categories
    const categories = await prisma.category.findMany({
      take: 3,
      select: { id: true, name: true, slug: true }
    });
    console.log('✅ Categories query successful:', categories.length);
    console.log('📋 Sample categories:', categories);
    
    // Test products
    const products = await prisma.product.findMany({
      take: 3,
      select: { id: true, name: true, price: true }
    });
    console.log('✅ Products query successful:', products.length);
    
    console.log('🎉 Connection pooler works perfectly!');
    
  } catch (error) {
    console.error('❌ Pooler connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

testPooler();
