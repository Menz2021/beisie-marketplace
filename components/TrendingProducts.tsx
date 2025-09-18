'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface TrendingProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string
  category: string
  categorySlug?: string
  slug: string
  brand?: string
  stock: number
  vendor?: string
  isFeatured: boolean
  trendingScore: number
  totalSales: number
  averageRating: number
  totalReviews: number
  wishlistCount: number
  discount: number
}

export function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('/api/trending-products?limit=5')
      const data = await response.json()
      
      if (data.success) {
        setTrendingProducts(data.data)
      } else {
        console.error('Error fetching trending products:', data.error)
      }
    } catch (error) {
      console.error('Error fetching trending products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (product: TrendingProduct) => {
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

  const handleAddToCart = (product: TrendingProduct) => {
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
      <section className="py-12 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
          </div>
          {trendingProducts.length > 0 && (
            <Link 
              href="/products" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {trendingProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-lg font-medium">No trending products available</p>
              <p className="text-sm">Check back later for popular products!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {trendingProducts.map((product, index) => {
              let productImages = []
              try {
                productImages = product.images ? JSON.parse(product.images) : []
              } catch (error) {
                console.error('Error parsing product images:', error)
                productImages = []
              }
              const mainImage = productImages.length > 0 ? productImages[0] : '/api/placeholder/300/300'
              
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative"
                >

                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-square relative">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{product.discount}%
                            </span>
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(product)
                          }}
                          className="absolute bottom-2 right-2 p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
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
                        </div>
                        
                        {/* Rating */}
                        {product.totalReviews > 0 && (
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.averageRating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.totalReviews})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="space-y-1 mb-3">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </p>
                          )}
                        </div>

                        {/* Popularity Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{product.totalSales} sold</span>
                          <div className="flex items-center space-x-1">
                            <HeartSolidIcon className="h-3 w-3 text-red-500" />
                            <span>{product.wishlistCount}</span>
                          </div>
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
