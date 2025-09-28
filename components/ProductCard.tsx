'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

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
  const { addItem } = useCartStore()
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
    toast.success('Added to cart!')
  }

  const productImages = product.images ? JSON.parse(product.images) : []
  const mainImage = productImages.length > 0 ? productImages[0] : `/api/placeholder/300/300/${encodeURIComponent(product.name)}`

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="relative bg-gray-100" style={{ height: '256px' }}>
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
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
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
              className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors disabled:opacity-50 touch-manipulation"
            >
              {isInWishlist(product.id) ? (
                <HeartIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          <div className="card-content">
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating} ({product.totalReviews})
                </span>
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {product.brand && (
              <p className="text-sm text-gray-600 mb-3">
                {product.brand}
              </p>
            )}

            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                Ush {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="text-lg text-gray-500 line-through mt-1">
                  Ush {product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full btn-primary btn-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
