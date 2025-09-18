const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestSeller() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const seller = await prisma.user.upsert({
      where: { email: 'seller@test.com' },
      update: {},
      create: {
        name: 'Test Seller Business',
        email: 'seller@test.com',
        password: hashedPassword,
        phone: '+256 700 123 456',
        role: 'SELLER',
        status: 'approved',
        verificationStatus: 'verified',
        isActive: true,
        isVerified: true
      }
    });

    console.log('✅ Test seller created successfully!');
    console.log('📧 Email: seller@test.com');
    console.log('🔑 Password: password123');
    console.log('🆔 Seller ID:', seller.id);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSeller();
