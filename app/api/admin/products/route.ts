import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } }
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
    console.log('🚀 Admin product creation started')
    
    // Parse form data
    const formData = await request.formData()
    console.log('📝 Form data parsed successfully')
    
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
    console.log('🔍 Validating product data...')
    const validatedData = productSchema.parse(productData)
    console.log('✅ Product data validated')
    
    // Validate that category exists
    console.log('🔍 Checking category exists...')
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })
    console.log('✅ Category check completed')
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found. Please select a valid category.' },
        { status: 400 }
      )
    }
    
    // For admin-created products, use "Beisie" as the vendor
    console.log('🔍 Finding Beisie vendor...')
    let vendor = await prisma.user.findFirst({
      where: { 
        role: 'ADMIN',
        name: { contains: 'Beisie' }
      }
    })
    console.log('✅ Vendor search completed')
    
    // If no Beisie admin exists, create one or use the first admin
    if (!vendor) {
      vendor = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      
      // If still no admin exists, create a default Beisie vendor
      if (!vendor) {
        vendor = await prisma.user.create({
          data: {
            email: 'admin@beisie.com',
            name: 'Beisie Marketplace',
            password: 'default-password', // This will be hashed if needed
            role: 'ADMIN',
            isVerified: true,
            isActive: true,
            businessName: 'Beisie Marketplace'
          }
        })
      }
    }
    
    // Override the vendorId with the Beisie vendor
    validatedData.vendorId = vendor.id
    console.log('✅ Vendor ID set:', vendor.id)
    
    // Handle image uploads
    console.log('🔍 Processing image uploads...')
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
    console.log('📸 Image upload debug:')
    console.log('  - Total image files received:', imageFiles.length)
    console.log('  - Image files:', imageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })))
    
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
    
    // Process uploaded images directly (no HTTP call needed)
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        try {
          console.log(`📁 Processing image: ${file.name} (${file.size} bytes)`)
          
          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
          console.log(`📁 Uploads directory: ${uploadsDir}`)
          
          if (!existsSync(uploadsDir)) {
            console.log('📁 Creating uploads directory...')
            await mkdir(uploadsDir, { recursive: true })
          }

          // Generate unique filename
          const timestamp = Date.now()
          const randomString = Math.random().toString(36).substring(2, 15)
          const fileExtension = file.name.split('.').pop() || 'jpg'
          const fileName = `${timestamp}-${randomString}.${fileExtension}`
          
          console.log(`📁 Generated filename: ${fileName}`)
          
          // Convert file to buffer
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          console.log(`📁 Buffer size: ${buffer.length} bytes`)

          // Write file to uploads directory
          const filePath = join(uploadsDir, fileName)
          console.log(`📁 Writing to: ${filePath}`)
          await writeFile(filePath, buffer)
          console.log(`✅ File written successfully`)

          // Add the public URL
          const imageUrl = `/uploads/products/${fileName}`
          imageUrls.push(imageUrl)
          
          console.log('✅ Successfully uploaded image:', imageUrl)
        } catch (error) {
          console.error('❌ Error uploading image:', error)
          console.error('❌ Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          })
          // Fallback to placeholder if upload fails
          const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
          imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
        }
      } else {
        console.log(`⚠️ Skipping empty file: ${file?.name || 'unknown'}`)
      }
    }
    
    // If no images were uploaded, create at least one placeholder image
    if (imageUrls.length === 0) {
      console.log('⚠️ No images uploaded, creating placeholder')
      const productName = validatedData.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 20)
      imageUrls.push(`/api/placeholder/400/400/${encodeURIComponent(productName)}`)
    }
    
    console.log('📸 Final image URLs:', imageUrls)
    
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
    console.log('💾 Creating product in database...')
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
    console.log('✅ Product created successfully:', newProduct.id)
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    console.error('❌ Error details:', {
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
