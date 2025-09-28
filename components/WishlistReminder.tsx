'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface WishlistReminderProps {
  className?: string
}

export function WishlistReminder({ className = '' }: WishlistReminderProps) {
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [isVisible, setIsVisible] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)

  // Don't show if user dismissed it (but show even if empty for testing)
  if (!isVisible) {
    return null
  }

  // Show empty state if no items
  if (wishlistItems.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-6 ${className}`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Your Wishlist (0)
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors touch-manipulation"
          >
            <XMarkIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          You haven't saved any items yet. Browse products and click the heart icon to add them to your wishlist!
        </p>
        
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors touch-manipulation"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = async (product: any) => {
    if (isAddingToCart) return
    
    setIsAddingToCart(product.id)
    
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendorId: product.vendorId
      })
      
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(null)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Your Wishlist ({wishlistItems.length})
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors touch-manipulation"
        >
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        Don't forget about these items you saved! Add them to your cart to complete your order.
      </p>

      {/* Wishlist Items */}
      <div className="space-y-2 sm:space-y-3">
        {wishlistItems.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
            {/* Product Image */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/64/64/Error'
                }}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link 
                href={`/products/${item.slug}`}
                className="block hover:text-purple-600 transition-colors"
              >
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {item.name}
                </h4>
              </Link>
              <p className="text-xs sm:text-sm font-semibold text-purple-600">
                {formatCurrency(item.price)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={isAddingToCart === item.id}
                className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[32px] sm:min-h-[36px]"
              >
                <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  {isAddingToCart === item.id ? 'Adding...' : 'Add'}
                </span>
                <span className="sm:hidden">
                  {isAddingToCart === item.id ? '...' : '+'}
                </span>
              </button>
              
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-h-[32px] sm:min-h-[36px] flex items-center justify-center"
                title="Remove from wishlist"
              >
                <HeartSolidIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {wishlistItems.length > 3 && (
        <div className="mt-3 sm:mt-4 text-center">
          <Link
            href="/wishlist"
            className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm"
          >
            View all {wishlistItems.length} items in wishlist →
          </Link>
        </div>
      )}
    </div>
  )
}
