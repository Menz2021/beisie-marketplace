import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Validation schema for product
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  discountedPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  sku: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  vendorId: z.string().min(1, 'Vendor is required'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  deliveryTimeDays: z.number().int().min(0).default(0),
  deliveryTimeText: z.string().optional().nullable(),
  specifications: z.string().optional().nullable()
})

// GET - Fetch seller's products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const vendorId = searchParams.get('vendorId') || ''

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      vendorId: vendorId
    }
    
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
    console.error('Error fetching seller products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract product data from form
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      discountedPrice: formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice') as string) : undefined,
      stock: formData.get('stock') ? parseInt(formData.get('stock') as string) : undefined,
      sku: (formData.get('sku') as string) || null,
      brand: (formData.get('brand') as string) || null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      categoryId: formData.get('categoryId') as string,
      vendorId: formData.get('vendorId') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      deliveryTimeDays: formData.get('deliveryTimeDays') ? parseInt(formData.get('deliveryTimeDays') as string) : 0,
      deliveryTimeText: (formData.get('deliveryTimeText') as string) || null,
      specifications: (formData.get('specifications') as string) || null
    }

    // Validate the product data
    const validatedData = productSchema.parse(productData)
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
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
        approvalStatus: 'PENDING', // Seller products need approval
        isActive: false // Seller products start inactive until approved
      },
      include: {
        category: true,
        vendor: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully and submitted for approval',
      data: newProduct
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating product:', error)
    
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
      sku: (formData.get('sku') as string) || null,
      brand: (formData.get('brand') as string) || null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      categoryId: formData.get('categoryId') as string,
      vendorId: formData.get('vendorId') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      deliveryTimeDays: formData.get('deliveryTimeDays') ? parseInt(formData.get('deliveryTimeDays') as string) : 0,
      deliveryTimeText: (formData.get('deliveryTimeText') as string) || null,
      specifications: (formData.get('specifications') as string) || null
    }

    // Validate the product data
    const validatedData = productSchema.parse(productData)
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
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
        approvalStatus: 'PENDING', // Seller product updates need re-approval
        isActive: false // Seller products become inactive until re-approved
      },
      include: {
        category: true,
        vendor: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully and submitted for re-approval',
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
