'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HeartIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  createdAt: string
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    stock: number
    sku?: string
    brand?: string
    weight?: number
    dimensions?: string
    isActive: boolean
    isFeatured: boolean
    approvalStatus: string
    slug: string
    category?: {
      id: string
      name: string
      slug: string
    }
    vendor?: {
      id: string
      name: string
      email: string
    }
    discount: number
  }
}

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { addItem } = useCartStore()
  const { syncWithBackend } = useWishlistStore()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_session')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Redirect sellers to seller dashboard
      if (parsedUser.role === 'SELLER') {
        router.push('/seller/dashboard')
        return
      }
      setUser(parsedUser)
      fetchWishlist(parsedUser.id)
      // Sync wishlist store with backend
      syncWithBackend(parsedUser.id)
    } else {
      setIsLoading(false)
    }
  }, [syncWithBackend, router])

  const fetchWishlist = async (userId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/wishlist?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(data.data)
      } else {
        console.error('Error fetching wishlist:', data.error)
        toast.error('Failed to load wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}&productId=${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
        toast.success('Removed from wishlist')
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const addToCart = (product: WishlistItem['product']) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/api/placeholder/200/200',
      vendorId: product.vendor?.id || ''
    })
    toast.success(`${product.name} added to cart!`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your wishlist.</p>
          <Link
            href="/auth/login"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to your wishlist and they'll appear here.</p>
            <Link
              href="/products"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <Link href={`/products/${item.product.slug}`} className="block">
                  <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square relative">
                      <Image
                        src={item.product.images[0] || '/api/placeholder/300/300'}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Discount Badge */}
                      {item.product.discount > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{item.product.discount}%
                          </span>
                        </div>
                      )}

                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeFromWishlist(item.product.id)
                        }}
                        className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <HeartSolidIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.product.name}
                        </h3>
                        {item.product.brand && (
                          <p className="text-xs text-gray-500">{item.product.brand}</p>
                        )}
                        {item.product.category && (
                          <p className="text-xs text-purple-600">{item.product.category.name}</p>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-1 mb-3">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(item.product.price)}
                        </p>
                        {item.product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(item.product.originalPrice)}
                          </p>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">
                        {item.product.stock > 0 ? (
                          <span className="text-green-600 text-sm font-medium">
                            ✓ In Stock
                          </span>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">✗ Out of Stock</span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(item.product)
                        }}
                        disabled={item.product.stock === 0}
                        className="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                        {item.product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

