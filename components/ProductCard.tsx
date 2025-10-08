'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

interface Product {
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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, updateQuantity, items } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  const toggleFavorite = async (productId: string) => {
    if (isTogglingWishlist) return
    
    setIsTogglingWishlist(true)
    
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.images,
          slug: product.slug,
          vendorId: product.vendor || ''
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAddingToCart) return
    
    setIsAddingToCart(true)
    
    try {
      let productImages = []
      try {
        productImages = product.images ? JSON.parse(product.images) : []
      } catch (error) {
        console.error('Error parsing product images:', error)
        productImages = []
      }
      
      const success = await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImages.length > 0 ? productImages[0] : '/api/placeholder/200/200',
        vendorId: product.vendor || 'unknown'
      })
      
      if (success) {
        toast.success('Added to cart!')
      } else {
        toast.error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const getCartQuantity = () => {
    const cartItem = items.find(item => item.id === product.id)
    return cartItem ? cartItem.quantity : 0
  }

  const isInCart = () => {
    return items.some(item => item.id === product.id)
  }

  const productImages = product.images ? JSON.parse(product.images) : []
  const mainImage = productImages.length > 0 ? productImages[0] : `/api/placeholder/300/300/${encodeURIComponent(product.name)}`

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="relative bg-gray-100 aspect-square sm:h-[200px]">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              quality={75}
              onError={(e) => {
                console.log('Image failed to load:', mainImage);
                e.currentTarget.src = '/api/placeholder/300/300/Error';
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.daysSinceAdded <= 7 && (
                <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(product.id)
              }}
              disabled={isTogglingWishlist}
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors disabled:opacity-50 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {isInWishlist(product.id) ? (
                <HeartIcon className="h-4 w-4 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="card-content p-3 lg:p-4">
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs lg:text-sm text-gray-600">
                  {product.averageRating} ({product.totalReviews})
                </span>
              </div>
            )}

            <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {product.brand && (
              <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">
                {product.brand}
              </p>
            )}

            <div className="mb-3 lg:mb-4">
              <span className="text-lg lg:text-2xl font-bold text-gray-900">
                Ush {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="text-sm lg:text-lg text-gray-500 line-through mt-1">
                  Ush {product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon */}
            <div className="flex justify-end">
              {!isInCart() ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation shadow-sm relative disabled:opacity-50 disabled:cursor-not-allowed"
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
                      const currentQuantity = getCartQuantity()
                      if (currentQuantity > 1) {
                        handleUpdateQuantity(currentQuantity - 1)
                      }
                    }}
                    className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                  >
                    <MinusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                  </button>
                  <span className="text-xs lg:text-sm font-medium text-gray-900 min-w-[20px] text-center">
                    {getCartQuantity()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const currentQuantity = getCartQuantity()
                      handleUpdateQuantity(currentQuantity + 1)
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
    </Link>
  )
}
