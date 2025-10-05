'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 128,
    vendor: 'TechGear Pro',
    vendorId: 'vendor1',
    isNew: true,
    discount: 23
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 89,
    vendor: 'EcoWear',
    vendorId: 'vendor2',
    isNew: false,
    discount: 25
  },
  {
    id: '3',
    name: 'Smart Fitness Tracker',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 203,
    vendor: 'FitTech Solutions',
    vendorId: 'vendor3',
    isNew: true,
    discount: 25
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug Set',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    vendor: 'Home Essentials',
    vendorId: 'vendor4',
    isNew: false,
    discount: 29
  },
  {
    id: '5',
    name: 'Leather Crossbody Bag',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 92,
    vendor: 'StyleCraft',
    vendorId: 'vendor5',
    isNew: true,
    discount: 20
  },
  {
    id: '6',
    name: 'Wireless Phone Charger',
    price: 34.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 167,
    vendor: 'PowerUp Tech',
    vendorId: 'vendor6',
    isNew: false,
    discount: 30
  }
]

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<string[]>([])
  const { addItem, updateQuantity, items } = useCartStore()

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorId: product.vendorId
    })
    toast.success('Added to cart!')
  }

  const handleUpdateQuantity = (product: typeof featuredProducts[0], newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const getCartQuantity = (productId: string) => {
    const cartItem = items.find(item => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of trending products from top vendors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card group hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    {favorites.includes(product.id) ? (
                      <HeartIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartOutlineIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="card-content">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    by {product.vendor}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
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
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn-primary btn-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
