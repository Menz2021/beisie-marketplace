// Test the search API endpoint
async function testSearchAPI() {
  try {
    console.log('Testing search API endpoint...')
    
    const searchTerms = ['phone', 'laptop', 'dell']
    
    for (const term of searchTerms) {
      console.log(`\nTesting API search for: "${term}"`)
      
      // Simulate the API call that the frontend makes
      const params = new URLSearchParams({
        page: '1',
        limit: '12',
        sort: 'featured',
        search: term.trim()
      })
      
      console.log(`API URL: /api/products?${params.toString()}`)
      
      // Since we can't make HTTP requests in Node.js easily, let's simulate the query
      const { PrismaClient } = require('@prisma/client')
      require('dotenv').config({ path: '.env.local' })
      
      const prisma = new PrismaClient()
      
      const where = {
        isActive: true,
        approvalStatus: 'APPROVED',
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { brand: { contains: term, mode: 'insensitive' } }
        ]
      }
      
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            vendor: {
              select: {
                id: true,
                name: true,
                email: true,
                businessName: true,
                role: true
              }
            },
            reviews: {
              select: {
                id: true,
                rating: true,
                createdAt: true
              }
            }
          },
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
          skip: 0,
          take: 12
        }),
        prisma.product.count({ where })
      ])
      
      console.log(`Found ${products.length} products (total: ${totalCount})`)
      
      if (products.length > 0) {
        console.log('Sample product:', {
          name: products[0].name,
          brand: products[0].brand,
          category: products[0].category?.name
        })
      }
      
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error('Error testing API:', error)
  }
}

testSearchAPI()
