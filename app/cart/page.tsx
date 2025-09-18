'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { CouponInput } from '@/components/CouponInput'
import { couponService } from '@/lib/coupons'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<string>('')
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const userSession = localStorage.getItem('user_session')
      if (userSession) {
        try {
          const user = JSON.parse(userSession)
          setIsAuthenticated(true)
        } catch (error) {
          setIsAuthenticated(false)
        }
      } else {
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products" className="btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({items.length})
                </h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">Vendor ID: {item.vendorId}</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 mt-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
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
                className="w-full btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link
                href="/products"
                className="block w-full text-center mt-3 text-primary-600 hover:text-primary-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
