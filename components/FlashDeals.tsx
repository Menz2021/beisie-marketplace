'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface FlashDeal {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  images: string
  category: string
  categorySlug?: string
  slug: string
  brand?: string
  stock: number
  vendor?: string
  businessName?: string
}

export function FlashDeals() {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    fetchFlashDeals()
  }, [])

  const fetchFlashDeals = async () => {
    try {
      const response = await fetch('/api/flash-deals?limit=6')
      const data = await response.json()
      
      if (data.success) {
        setFlashDeals(data.data)
      } else {
        console.error('Error fetching flash deals:', data.error)
      }
    } catch (error) {
      console.error('Error fetching flash deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (product: FlashDeal) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      let productImages = []
      try {
        productImages = product.images ? JSON.parse(product.images) : []
      } catch (error) {
        console.error('Error parsing product images:', error)
        productImages = []
      }
      
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImages.length > 0 ? productImages[0] : '/api/placeholder/200/200',
        slug: product.slug,
        vendorId: product.vendor || ''
      })
      toast.success('Added to wishlist')
    }
  }

  const handleAddToCart = (product: FlashDeal) => {
    let productImages = []
    try {
      productImages = product.images ? JSON.parse(product.images) : []
    } catch (error) {
      console.error('Error parsing product images:', error)
      productImages = []
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages.length > 0 ? productImages[0] : '/api/placeholder/200/200',
      vendorId: product.vendor || 'unknown'
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
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
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
          </div>
          {flashDeals.length > 0 && (
            <Link 
              href="/categories" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Deals →
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {flashDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No flash deals available</p>
              <p className="text-sm">Check back later for amazing discounts!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {flashDeals.map((product) => {
              let productImages = []
              try {
                productImages = product.images ? JSON.parse(product.images) : []
              } catch (error) {
                console.error('Error parsing product images:', error)
                productImages = []
              }
              const mainImage = productImages.length > 0 ? productImages[0] : `/api/placeholder/300/300/${encodeURIComponent(product.name)}`
              console.log('FlashDeals - Product:', product.name, 'Image URL:', mainImage)
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative">
                      {/* Product Image */}
                      <div className="relative bg-gray-100" style={{ height: '200px' }}>
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.log('Image failed to load:', mainImage);
                            e.currentTarget.src = '/api/placeholder/300/300/Error';
                          }}
                          onLoad={() => console.log('Image loaded:', mainImage)}
                        />
                        
                        {/* Discount Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{product.discount}%
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(product)
                          }}
                          className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                        >
                          {isInWishlist(product.id) ? (
                            <HeartSolidIcon className="h-4 w-4 text-red-500" />
                          ) : (
                            <HeartIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          )}
                          <p className="text-xs text-purple-600">{product.category}</p>
                        </div>
                        
                        {/* Price */}
                        <div className="space-y-1 mb-3">
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </p>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToCart(product)
                          }}
                          className="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
