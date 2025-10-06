require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function testSearch() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing search functionality...')
    
    // Test different search terms
    const searchTerms = ['phone', 'laptop', 'dell', 'sony', 'iphone']
    
    for (const term of searchTerms) {
      console.log(`\nSearching for: "${term}"`)
      
      const results = await prisma.product.findMany({
        where: {
          isActive: true,
          approvalStatus: 'APPROVED',
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { brand: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 3,
        select: {
          name: true,
          brand: true,
          description: true
        }
      })
      
      console.log(`Found ${results.length} results:`)
      results.forEach(product => {
        console.log(`  - ${product.name} (${product.brand || 'No brand'})`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSearch()
