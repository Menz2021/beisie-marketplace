'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline'
import { couponService, type CartItem } from '@/lib/coupons'
import toast from 'react-hot-toast'

interface CouponInputProps {
  cartItems: CartItem[]
  onCouponApplied: (discount: number, couponCode: string) => void
  onCouponRemoved: () => void
  appliedCoupon?: string
  appliedDiscount?: number
}

export function CouponInput({ 
  cartItems, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon,
  appliedDiscount 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setIsValidating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const result = couponService.validateCoupon(couponCode, cartItems)
      setValidationResult(result)
      
      if (result.isValid) {
        onCouponApplied(result.discount, couponCode)
        couponService.applyCoupon(couponCode)
        toast.success(result.message)
        setCouponCode('')
      } else {
        toast.error(result.message)
      }
      
      setIsValidating(false)
    }, 1000)
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    setValidationResult(null)
    toast.success('Coupon removed')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon()
    }
  }

  return (
    <div className="space-y-4">
      {!appliedCoupon ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have a coupon code?
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code"
                className="input pl-10"
                disabled={isValidating}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponCode.trim()}
              className="btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Coupon Applied: {appliedCoupon}
                </p>
                <p className="text-sm text-green-600">
                  You saved {couponService.formatCurrency(appliedDiscount || 0)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Available Coupons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Available Coupons:</p>
        <div className="space-y-2">
          {couponService.getActiveCoupons().slice(0, 3).map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{coupon.code}</p>
                <p className="text-xs text-gray-600">{coupon.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}% off` : `${couponService.formatCurrency(coupon.value)} off`}
                </p>
                {coupon.minOrderAmount && (
                  <p className="text-xs text-gray-500">
                    Min: {couponService.formatCurrency(coupon.minOrderAmount)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
