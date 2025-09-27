'use client'

import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface FloatingCartSummaryProps {
  className?: string
}

export function FloatingCartSummary({ className = '' }: FloatingCartSummaryProps) {
  const { items, getTotalPrice } = useCartStore()
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
    router.push('/checkout')
  }

  const subtotal = getTotalPrice()
  const shippingCost = subtotal > 100000 ? 0 : 15000
  const tax = subtotal * 0.18
  const total = subtotal + shippingCost + tax

  // Don't show if cart is empty
  if (items.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 lg:hidden ${className}`}>
      <div className="px-4 py-3">
        {/* Cart Summary */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(total)}
            </div>
            {shippingCost === 0 && (
              <div className="text-xs text-green-600">Free shipping</div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  )
}
