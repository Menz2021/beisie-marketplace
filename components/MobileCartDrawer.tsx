'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MinusIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { SwipeToDelete } from './SwipeToDelete'

interface MobileCartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }
    
    setIsCheckingOut(true)
    onClose() // Close drawer first
    router.push('/checkout')
  }

  const handleViewCart = () => {
    onClose()
    router.push('/cart')
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-600 mb-4">Add some items to get started</p>
                <Link 
                  href="/products" 
                  onClick={onClose}
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors touch-manipulation"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <SwipeToDelete
                    key={item.id}
                    onDelete={() => removeItem(item.id)}
                    deleteText="Remove"
                    className="rounded-lg"
                  >
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Vendor ID: {item.vendorId}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button - Hidden on mobile since swipe is available */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="hidden p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </SwipeToDelete>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
                
                <button
                  onClick={handleViewCart}
                  className="w-full text-purple-600 hover:text-purple-700 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors touch-manipulation"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
