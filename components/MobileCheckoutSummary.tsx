'use client'

import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { formatUgandaCurrency } from '@/lib/payments'

interface MobileCheckoutSummaryProps {
  step: number
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  onNext: () => void
  onPlaceOrder: () => void
  isProcessing: boolean
  className?: string
}

export function MobileCheckoutSummary({ 
  step, 
  total, 
  subtotal, 
  shippingCost, 
  tax, 
  onNext, 
  onPlaceOrder, 
  isProcessing,
  className = '' 
}: MobileCheckoutSummaryProps) {
  const { items } = useCartStore()

  // Don't show if cart is empty
  if (items.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 lg:hidden ${className}`}>
      <div className="px-4 py-3">
        {/* Order Summary */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatUgandaCurrency(total)}
            </div>
            {shippingCost === 0 && (
              <div className="text-xs text-green-600">Free shipping</div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={step < 3 ? onNext : onPlaceOrder}
          disabled={isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          {isProcessing ? 'Processing...' : (
            step < 3 ? 'Continue' : `Place Order - ${formatUgandaCurrency(total)}`
          )}
        </button>
      </div>
    </div>
  )
}
