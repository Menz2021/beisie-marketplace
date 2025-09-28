'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { SwipeToDelete } from '@/components/SwipeToDelete'
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
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 sm:p-6 mx-2 sm:mx-0 ${className}`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
              Your Wishlist (0)
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <XMarkIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="mb-4">
            <HeartSolidIcon className="h-12 w-12 text-purple-300 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-600 mb-2 leading-relaxed">
              You haven't saved any items yet.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Browse products and click the heart icon to add them to your wishlist!
            </p>
          </div>
          
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors touch-manipulation min-h-[48px] w-full sm:w-auto"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-6 mx-2 sm:mx-0 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
            Your Wishlist ({wishlistItems.length})
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
        Don't forget about these items you saved! Add them to your cart to complete your order.
      </p>

      {/* Wishlist Items */}
      <div className="space-y-2 sm:space-y-3">
        {wishlistItems.slice(0, 3).map((item) => (
          <SwipeToDelete
            key={item.id}
            onDelete={() => handleRemoveFromWishlist(item.id)}
            deleteText="Remove"
            className="rounded-lg"
          >
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Product Image */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.log('WishlistReminder image error:', item.image)
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
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-tight">
                    {item.name}
                  </h4>
                </Link>
                <p className="text-sm font-semibold text-purple-600">
                  {formatCurrency(item.price)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={isAddingToCart === item.id}
                  className="flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[40px] min-w-[80px]"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span className="text-xs">
                    {isAddingToCart === item.id ? 'Adding...' : 'Add'}
                  </span>
                </button>
                
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Remove from wishlist"
                >
                  <HeartSolidIcon className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </SwipeToDelete>
        ))}
      </div>

      {/* View All Link */}
      {wishlistItems.length > 3 && (
        <div className="mt-4 text-center">
          <Link
            href="/wishlist"
            className="inline-flex items-center px-4 py-2 bg-white border border-purple-300 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm rounded-lg transition-colors touch-manipulation min-h-[44px]"
          >
            View all {wishlistItems.length} items in wishlist
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
