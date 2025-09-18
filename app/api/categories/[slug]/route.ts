import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categories } from '@/lib/categories'

// GET - Fetch category and its products
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // First, check if it's a subcategory in the static categories
    let category = null
    let isSubcategory = false

    // Search through main categories and their subcategories
    for (const mainCategory of categories) {
      if (mainCategory.slug === slug) {
        category = mainCategory
        break
      }
      
      // Check subcategories
      if (mainCategory.subcategories) {
        for (const subcategory of mainCategory.subcategories) {
          if (subcategory.slug === slug) {
            category = subcategory
            isSubcategory = true
            break
          }
        }
      }
      
      if (category) break
    }

    // If not found in static categories, check database
    if (!category) {
      const dbCategory = await prisma.category.findFirst({
        where: {
          slug: slug
        }
      })

      if (dbCategory) {
        category = dbCategory
      }
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // For subcategories, we need to find products that match the subcategory name
    // Since subcategories don't exist in the database, we'll filter by product name/description
    let products: any[] = []

    if (isSubcategory) {
      // For subcategories, search products by name/description containing subcategory keywords
      const searchTerms = category.name.toLowerCase().split(' ')
      
      // Build OR conditions for search terms (SQLite doesn't support case-insensitive mode)
      const orConditions = [
        {
          name: {
            contains: category.name
          }
        },
        {
          description: {
            contains: category.name
          }
        }
      ]
      
      // Add individual term searches
      searchTerms.forEach(term => {
        if (term.length > 2) { // Only search for terms longer than 2 characters
          orConditions.push(
            {
              name: {
                contains: term
              }
            },
            {
              description: {
                contains: term
              }
            }
          )
        }
      })
      
      products = await prisma.product.findMany({
        where: {
          OR: orConditions,
          isActive: true,
          approvalStatus: 'APPROVED'
        },
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
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // For main categories, find by category name or slug in database
      // First try to find a matching category in the database
      const dbCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: slug },
            { name: category.name }
          ]
        }
      })

      if (dbCategory) {
        // If we found a matching category in the database, use its ID
        products = await prisma.product.findMany({
          where: {
            categoryId: dbCategory.id,
            isActive: true,
            approvalStatus: 'APPROVED'
          },
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
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      } else {
        // If no exact match found, search products by category name in product data
        // This handles cases where products might have category names in their data
        products = await prisma.product.findMany({
          where: {
            OR: [
              {
                category: {
                  name: {
                    contains: category.name
                  }
                }
              },
              {
                name: {
                  contains: category.name
                }
              },
              {
                description: {
                  contains: category.name
                }
              }
            ],
            isActive: true,
            approvalStatus: 'APPROVED'
          },
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
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      category,
      products,
      isSubcategory
    })

  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
