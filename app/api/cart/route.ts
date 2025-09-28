import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
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
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend CartItem interface
    const transformedItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images,
      quantity: item.quantity,
      vendorId: item.product.vendorId || ''
    }))

    return NextResponse.json({
      success: true,
      data: transformedItems
    })

  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, quantity = 1 } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId
          }
        },
        data: {
          quantity: existingItem.quantity + quantity
        },
        include: {
          product: {
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
                  email: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: updatedItem.product.id,
          name: updatedItem.product.name,
          price: updatedItem.product.price,
          image: updatedItem.product.images,
          quantity: updatedItem.quantity,
          vendorId: updatedItem.product.vendorId || ''
        }
      })
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
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
                  email: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          image: cartItem.product.images,
          quantity: cartItem.quantity,
          vendorId: cartItem.product.vendorId || ''
        }
      })
    }

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, quantity } = body

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'User ID, Product ID, and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: null
      })
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      },
      data: { quantity },
      include: {
        product: {
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
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedItem.product.id,
        name: updatedItem.product.name,
        price: updatedItem.product.price,
        image: updatedItem.product.images,
        quantity: updatedItem.quantity,
        vendorId: updatedItem.product.vendorId || ''
      }
    })

  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart'
    })

  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
