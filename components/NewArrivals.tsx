'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface NewArrival {
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
  businessName?: string
  isFeatured: boolean
  averageRating: number
  totalReviews: number
  discount: number
  daysSinceAdded: number
}

export function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, updateQuantity, items } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    fetchNewArrivals()
  }, [])

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('/api/new-arrivals?limit=8')
      const data = await response.json()
      
      if (data.success) {
        setNewArrivals(data.data)
      } else {
        console.error('Error fetching new arrivals:', data.error)
      }
    } catch (error) {
      console.error('Error fetching new arrivals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (product: NewArrival) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        let productImages = []
        try {
          productImages = product.images ? JSON.parse(product.images) : []
        } catch (error) {
          console.error('Error parsing product images:', error)
          productImages = []
        }
        
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImages.length > 0 ? productImages[0] : '/api/placeholder/200/200',
          slug: product.slug,
          vendorId: product.vendor || ''
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const handleAddToCart = (product: NewArrival) => {
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

  const handleUpdateQuantity = (product: NewArrival, newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const getCartQuantity = (productId: string) => {
    const cartItem = items.find(item => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId)
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {[...Array(4)].map((_, index) => (
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
    <section className="py-12 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          {newArrivals.length > 0 && (
            <Link 
              href="/products?sort=newest" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {newArrivals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No new arrivals available</p>
              <p className="text-sm">Check back later for fresh products!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile horizontal scroll */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                {newArrivals.map((product) => {
                  let productImages = []
                  try {
                    productImages = product.images ? JSON.parse(product.images) : []
                  } catch (error) {
                    console.error('Error parsing product images:', error)
                    productImages = []
                  }
                  const mainImage = productImages.length > 0 ? productImages[0] : `/api/placeholder/300/300/${encodeURIComponent(product.name)}`
                  
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative flex-shrink-0 w-64">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative">
                      {/* Product Image */}
                      <div className="relative bg-gray-100" style={{ height: '300px' }}>
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
                        
                        {/* New Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            New
                          </span>
                        </div>

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
                          <p className="text-xs text-gray-400">
                            Added {product.daysSinceAdded === 0 ? 'today' : `${product.daysSinceAdded} days ago`}
                          </p>
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

                        {/* Shopping Cart Icon */}
                        <div className="flex justify-end">
                          {!isInCart(product.id) ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              className="w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation shadow-sm relative"
                            >
                              <ShoppingCartIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                              <PlusIcon className="h-2 lg:h-3 w-2 lg:w-3 absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-1 py-1 shadow-sm">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const currentQuantity = getCartQuantity(product.id)
                                  if (currentQuantity > 1) {
                                    handleUpdateQuantity(product, currentQuantity - 1)
                                  }
                                }}
                                className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                              >
                                <MinusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                              </button>
                              <span className="text-xs lg:text-sm font-medium text-gray-900 min-w-[20px] text-center">
                                {getCartQuantity(product.id)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const currentQuantity = getCartQuantity(product.id)
                                  handleUpdateQuantity(product, currentQuantity + 1)
                                }}
                                className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                              >
                                <PlusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Desktop grid */}
            <div className="hidden lg:grid grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
              {newArrivals.map((product) => {
                let productImages = []
                try {
                  productImages = product.images ? JSON.parse(product.images) : []
                } catch (error) {
                  console.error('Error parsing product images:', error)
                  productImages = []
                }
                const mainImage = productImages.length > 0 ? productImages[0] : `/api/placeholder/300/300/${encodeURIComponent(product.name)}`
                
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative">
                        {/* Product Image */}
                        <div className="relative bg-gray-100" style={{ height: '300px' }}>
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              New
                            </span>
                            {product.discount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                -{product.discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* Favorite button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleFavorite(product)
                            }}
                            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all group/fav"
                          >
                            {isInWishlist(product.id) ? (
                              <HeartIcon className="h-4 w-4 text-red-500 fill-current" />
                            ) : (
                              <HeartIcon className="h-4 w-4 text-gray-600 group-hover/fav:text-red-500 transition-colors" />
                            )}
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                              {product.category}
                            </span>
                            {product.averageRating > 0 && (
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">
                                  {product.averageRating.toFixed(1)} ({product.totalReviews})
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            {product.stock <= 10 && product.stock > 0 && (
                              <span className="text-xs text-orange-600 font-medium">
                                Only {product.stock} left
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-green-600 font-medium">
                              Added {product.daysSinceAdded} days ago
                            </span>
                          </div>

                          {/* Shopping Cart Icon */}
                          <div className="flex justify-end">
                            {!isInCart(product.id) ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleAddToCart(product)
                                }}
                                className="w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation shadow-sm relative"
                              >
                                <ShoppingCartIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                                <PlusIcon className="h-2 lg:h-3 w-2 lg:w-3 absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5" />
                              </button>
                            ) : (
                              <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-1 py-1 shadow-sm">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const currentQuantity = getCartQuantity(product.id)
                                    if (currentQuantity > 1) {
                                      handleUpdateQuantity(product, currentQuantity - 1)
                                    }
                                  }}
                                  className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                                >
                                  <MinusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                                </button>
                                <span className="text-xs lg:text-sm font-medium text-gray-900 min-w-[20px] text-center">
                                  {getCartQuantity(product.id)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const currentQuantity = getCartQuantity(product.id)
                                    handleUpdateQuantity(product, currentQuantity + 1)
                                  }}
                                  className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                                >
                                  <PlusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}