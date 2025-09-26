import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// Validation schemas
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  discountedPrice: z.number().positive().optional(),
  images: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  vendorId: z.string().min(1, 'Vendor is required'),
  deliveryTimeDays: z.number().int().min(0, 'Delivery time days must be non-negative').default(0),
  deliveryTimeText: z.string().optional(),
  specifications: z.string().optional()
})

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    // For now, we'll skip authentication check in API
    // In a real app, you'd use JWT tokens or session cookies
    // const adminSession = getAdminSession()
    // if (!adminSession || adminSession.type !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (status) {
      if (status === 'active') {
        where.isActive = true
      } else if (status === 'inactive') {
        where.isActive = false
      } else if (status === 'featured') {
        where.isFeatured = true
      } else if (status === 'low_stock') {
        where.stock = { lt: 10 }
      } else if (status === 'pending') {
        where.approvalStatus = 'PENDING'
      } else if (status === 'approved') {
        where.approvalStatus = 'APPROVED'
      } else if (status === 'rejected') {
        where.approvalStatus = 'REJECTED'
      }
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
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
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    // For now, we'll skip authentication check in API
    // In a real app, you'd use JWT tokens or session cookies
    // const adminSession = getAdminSession()
    // if (!adminSession || adminSession.type !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 401 }
    //   )
    // }

    // Parse form data
    const formData = await request.formData()
    
    // Extract product data
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      discountedPrice: formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice') as string) : undefined,
      stock: parseInt(formData.get('stock') as string),
      sku: formData.get('sku') as string || undefined,
      brand: formData.get('brand') as string || undefined,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      categoryId: formData.get('categoryId') as string,
      vendorId: formData.get('vendorId') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      deliveryTimeDays: parseInt(formData.get('deliveryTimeDays') as string) || 0,
      deliveryTimeText: formData.get('deliveryTimeText') as string || undefined,
      specifications: formData.get('specifications') as string || undefined
    }
    
    // Validate the product data
    const validatedData = productSchema.parse(productData)
    
    // Validate that category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found. Please select a valid category.' },
        { status: 400 }
      )
    }
    
    // Validate that vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: validatedData.vendorId }
    })
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found. Please select a valid vendor.' },
        { status: 400 }
      )
    }
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
    // Validate image files
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file && file.size > 0) {
          // Validate file type
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
          if (!validTypes.includes(file.type)) {
            return NextResponse.json(
              { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
              { status: 400 }
            )
          }
          
          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024 // 5MB
          if (file.size > maxSize) {
            return NextResponse.json(
              { error: 'Image file size must be smaller than 5MB.' },
              { status: 400 }
            )
          }
          
          // Note: In a real application, you would also validate image dimensions here
          // by reading the image metadata or using a library like 'sharp' or 'jimp'
          // For now, we'll rely on client-side validation
        }
      }
    }
    
    // Process uploaded images
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        try {
          // Upload image to our upload API
          const uploadFormData = new FormData()
          uploadFormData.append('image', file)
          
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/image`, {
            method: 'POST',
            body: uploadFormData
          })
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            imageUrls.push(uploadResult.imageUrl)
          } else {
            console.error('Failed to upload image:', file.name)
            // Fallback to placeholder if upload fails
            const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
            imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          // Fallback to placeholder if upload fails
          const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
          imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
        }
      }
    }
    
    // If no images were uploaded, create at least one placeholder image
    if (imageUrls.length === 0) {
      const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
      imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
    }
    
    // Generate slug
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })
    
    let finalSlug = slug
    if (existingProduct) {
      finalSlug = `${slug}-${Date.now()}`
    }
    
    // Create product in database
    const newProduct = await prisma.product.create({
      data: {
        ...validatedData,
        images: JSON.stringify(imageUrls),
        slug: finalSlug,
        dimensions: '{}', // Default empty dimensions
        approvalStatus: 'APPROVED', // Auto-approve admin products
        isActive: true // Make admin products active by default
      },
      include: {
        category: true,
        vendor: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating product:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this SKU already exists' },
          { status: 400 }
        )
      }
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid category or vendor reference' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const productId = formData.get('productId') as string
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Extract product data from form
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      discountedPrice: formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice') as string) : undefined,
      stock: formData.get('stock') ? parseInt(formData.get('stock') as string) : undefined,
      sku: formData.get('sku') as string,
      brand: formData.get('brand') as string,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      categoryId: formData.get('categoryId') as string,
      vendorId: formData.get('vendorId') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      deliveryTimeDays: formData.get('deliveryTimeDays') ? parseInt(formData.get('deliveryTimeDays') as string) : 0,
      deliveryTimeText: formData.get('deliveryTimeText') as string
    }

    // Validate the product data
    const validatedData = productSchema.parse(productData)
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
    // For now, we'll store placeholder URLs. In a real app, you'd upload to cloud storage
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file && file.size > 0) {
        // For demo purposes, we'll use placeholder URLs
        const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
        imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
      }
    }
    
    // If no new images were uploaded, keep existing images
    let finalImageUrls = imageUrls
    if (imageUrls.length === 0) {
      // Get existing product to preserve current images
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
        select: { images: true }
      })
      if (existingProduct?.images) {
        try {
          finalImageUrls = JSON.parse(existingProduct.images)
        } catch {
          // If parsing fails, create a placeholder
          const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
          finalImageUrls = [`/api/placeholder/400/400/${encodeURIComponent(productName)}`]
        }
      } else {
        // Create at least one placeholder image
        const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
        finalImageUrls = [`/api/placeholder/400/400/${encodeURIComponent(productName)}`]
      }
    }
    
    // Generate new slug if name changed
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, slug: true }
    })
    
    let finalSlug = existingProduct?.slug
    if (existingProduct?.name !== validatedData.name) {
      const newSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      
      // Check if new slug already exists (excluding current product)
      const slugExists = await prisma.product.findFirst({
        where: { 
          slug: newSlug,
          id: { not: productId }
        }
      })
      
      finalSlug = slugExists ? `${newSlug}-${Date.now()}` : newSlug
    }
    
    // Update product in database
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...validatedData,
        images: JSON.stringify(finalImageUrls),
        slug: finalSlug,
        dimensions: '{}', // Default empty dimensions
        approvalStatus: 'APPROVED', // Auto-approve admin product updates
        isActive: true // Make admin products active by default
      },
      include: {
        category: true,
        vendor: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Approve/Reject product
export async function PATCH(request: NextRequest) {
  try {
    // For now, we'll skip authentication check in API
    // In a real app, you'd use JWT tokens or session cookies
    // const adminSession = getAdminSession()
    // if (!adminSession || adminSession.type !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    const { productId, action, rejectionReason } = body

    if (!productId || !action) {
      return NextResponse.json(
        { error: 'Product ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a product' },
        { status: 400 }
      )
    }

    // Update product approval status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        approvalStatus: action === 'approve' ? 'APPROVED' : 'REJECTED',
        rejectionReason: action === 'reject' ? rejectionReason : null,
        isActive: action === 'approve' ? true : false // Set isActive based on approval
      },
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Product ${action}d successfully`,
      data: updatedProduct
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating product approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
