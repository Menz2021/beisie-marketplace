'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { CouponInput } from '@/components/CouponInput'
import { couponService } from '@/lib/coupons'
import { SwipeToDelete } from '@/components/SwipeToDelete'
import { FloatingCartSummary } from '@/components/FloatingCartSummary'
import { CartItem } from '@/components/CartItem'
import { WishlistReminder } from '@/components/WishlistReminder'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<string>('')
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status using secure cookies
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        })
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/auth/login?redirect=/cart')
    }
  }, [isAuthenticated, router])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }
    
    setIsCheckingOut(true)
    // Navigate to checkout page
    router.push('/checkout')
  }

  const handleCouponApplied = (discount: number, couponCode: string) => {
    setAppliedCoupon(couponCode)
    setAppliedDiscount(discount)
  }

  const handleCouponRemoved = () => {
    setAppliedCoupon('')
    setAppliedDiscount(0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const subtotal = getTotalPrice()
  const shippingCost = subtotal > 100000 ? 0 : 15000
  const tax = (subtotal - appliedDiscount) * 0.18
  const total = subtotal - appliedDiscount + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/products" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 lg:pb-8">
        {/* Mobile-optimized header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors touch-manipulation"
          >
            Clear Cart
          </button>
        </div>

        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({items.length})
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeItem}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Wishlist Reminder */}
            <WishlistReminder className="mt-4 sm:mt-6" />
          </div>

          {/* Order Summary - Mobile optimized */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4 sm:top-8 lg:block hidden">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon})</span>
                    <span className="font-medium">-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mb-4 sm:mb-6">
                <CouponInput
                  cartItems={items.map(item => ({
                    id: item.id,
                    price: item.price,
                    quantity: item.quantity,
                    vendorId: item.vendorId
                  }))}
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                  appliedCoupon={appliedCoupon}
                  appliedDiscount={appliedDiscount}
                />
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[48px] text-sm sm:text-base"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link
                href="/products"
                className="block w-full text-center mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base py-2 rounded-lg hover:bg-purple-50 transition-colors touch-manipulation"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Summary for Mobile */}
      <FloatingCartSummary />
    </div>
  )
}
