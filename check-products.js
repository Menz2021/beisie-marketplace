require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function checkProducts() {
  const prisma = new PrismaClient()
  
  try {
    // Check total products
    const totalProducts = await prisma.product.count()
    console.log('Total products:', totalProducts)
    
    // Check approved products
    const approvedProducts = await prisma.product.count({
      where: {
        approvalStatus: 'APPROVED',
        isActive: true
      }
    })
    console.log('Approved active products:', approvedProducts)
    
    // Get sample products
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      select: {
        name: true,
        approvalStatus: true,
        isActive: true,
        brand: true
      }
    })
    console.log('Sample products:', JSON.stringify(sampleProducts, null, 2))
    
    // Test search
    const searchResults = await prisma.product.findMany({
      where: {
        isActive: true,
        approvalStatus: 'APPROVED',
        OR: [
          { name: { contains: 'phone' } },
          { description: { contains: 'phone' } },
          { brand: { contains: 'phone' } }
        ]
      },
      take: 3,
      select: {
        name: true,
        brand: true
      }
    })
    console.log('Search results for "phone":', JSON.stringify(searchResults, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
