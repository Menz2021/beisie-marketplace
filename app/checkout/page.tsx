'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { formatUgandaCurrency, validateUgandaPhoneNumber, formatUgandaPhoneNumber } from '@/lib/payments'
import { MobileCheckoutSummary } from '@/components/MobileCheckoutSummary'

interface DeliveryZone {
  id: string
  name: string
  districts: string[]
  shippingCost: number
  isActive: boolean
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    
    // Payment Information
    paymentMethod: 'FLUTTERWAVE',
    phoneNumber: '',
    
    // Card Information (for Visa/Mastercard)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch delivery zones on component mount
  useEffect(() => {
    fetchDeliveryZones()
  }, [])

  // Update selected zone when district changes
  useEffect(() => {
    if (formData.district && deliveryZones.length > 0) {
      const zone = deliveryZones.find(zone => 
        zone.districts.includes(formData.district)
      )
      setSelectedZone(zone || null)
    } else {
      setSelectedZone(null)
    }
  }, [formData.district, deliveryZones])

  const fetchDeliveryZones = async () => {
    try {
      const response = await fetch('/api/delivery-zones')
      const data = await response.json()
      
      if (data.success) {
        setDeliveryZones(data.data)
      } else {
        console.error('Error fetching delivery zones:', data.error)
      }
    } catch (error) {
      console.error('Error fetching delivery zones:', error)
    }
  }

  const subtotal = getTotalPrice()
  // Calculate shipping cost based on selected zone and order value
  const baseShippingCost = selectedZone?.shippingCost || 15000
  const shippingCost = subtotal > 100000 ? 0 : baseShippingCost // Free shipping over UGX 100,000
  const tax = subtotal * 0.18 // 18% VAT
  const total = subtotal + shippingCost + tax

  const paymentMethods = [
    {
      id: 'FLUTTERWAVE',
      name: 'Flutterwave',
      icon: DevicePhoneMobileIcon,
      description: 'Pay with Mobile Money, Cards, or Bank Transfer',
      color: 'text-blue-600'
    },
    {
      id: 'MTN_MOBILE_MONEY',
      name: 'MTN Mobile Money',
      icon: DevicePhoneMobileIcon,
      description: 'Pay with your MTN Mobile Money account',
      color: 'text-yellow-600'
    },
    {
      id: 'AIRTEL_MONEY',
      name: 'Airtel Money',
      icon: DevicePhoneMobileIcon,
      description: 'Pay with your Airtel Money account',
      color: 'text-red-600'
    },
    {
      id: 'VISA',
      name: 'Visa Card',
      icon: CreditCardIcon,
      description: 'Pay with your Visa card',
      color: 'text-blue-600'
    },
    {
      id: 'MASTERCARD',
      name: 'Mastercard',
      icon: CreditCardIcon,
      description: 'Pay with your Mastercard',
      color: 'text-red-600'
    }
  ]

  // All Uganda districts organized by region
  const allDistricts = [
    // Central Region
    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Masaka', 'Mpigi', 'Buikwe', 'Kayunga', 'Luweero', 'Nakaseke', 'Nakasongola',
    // Eastern Region  
    'Mbale', 'Soroti', 'Kumi', 'Pallisa', 'Tororo', 'Busia', 'Iganga', 'Kamuli', 'Kaliro', 'Mayuge', 'Namayingo', 'Namutumba', 'Bugiri', 'Bugweri', 'Butaleja', 'Buyende', 'Kibuku', 'Luuka', 'Manafwa', 'Namisindwa', 'Serere', 'Sironko',
    // Northern Region
    'Gulu', 'Lira', 'Arua', 'Kitgum', 'Pader', 'Apac', 'Oyam', 'Kole', 'Dokolo', 'Amolatar', 'Alebtong', 'Amuru', 'Nwoya', 'Omoro', 'Agago', 'Lamwo', 'Koboko', 'Maracha', 'Terego', 'Yumbe', 'Madi-Okollo', 'Obongi', 'Pakwach', 'Nebbi', 'Zombo',
    // Western Region
    'Mbarara', 'Kasese', 'Hoima', 'Fort Portal', 'Masindi', 'Kibaale', 'Kabarole', 'Bundibugyo', 'Ntoroko', 'Kyenjojo', 'Kamwenge', 'Kyegegwa', 'Kakumiro', 'Kagadi', 'Kikuube', 'Kiryandongo', 'Buliisa', 'Bushenyi', 'Ibanda', 'Isingiro', 'Kazo', 'Kiruhura', 'Ntungamo', 'Rubirizi', 'Rukungiri', 'Sheema', 'Mitooma', 'Rubanda', 'Rukiga', 'Kanungu', 'Kisoro',
    // Remote Areas
    'Kaabong', 'Kotido', 'Moroto', 'Napak', 'Abim', 'Amudat', 'Nabilatuk', 'Karenga', 'Kwania', 'Otuke'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate shipping information
      if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.district) {
        alert('Please fill in all required fields')
        return
      }
      
      if (!validateUgandaPhoneNumber(formData.phone)) {
        alert('Please enter a valid Uganda phone number')
        return
      }
    }
    
    if (step === 2) {
      // Validate payment information
      if (formData.paymentMethod === 'MTN_MOBILE_MONEY' || formData.paymentMethod === 'AIRTEL_MONEY') {
        if (!formData.phoneNumber || !validateUgandaPhoneNumber(formData.phoneNumber)) {
          alert('Please enter a valid phone number for mobile money')
          return
        }
      } else if (formData.paymentMethod === 'VISA' || formData.paymentMethod === 'MASTERCARD') {
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
          alert('Please fill in all card details')
          return
        }
      }
      // Flutterwave doesn't require additional validation - it will redirect to their payment page
    }
    
    setStep(step + 1)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    try {
      // Get user session
      const userData = localStorage.getItem('user_session')
      if (!userData) {
        alert('Please log in to place an order')
        window.location.href = '/auth/login'
        return
      }

      const user = JSON.parse(userData)
      
      // Prepare order data
      const orderData = {
        customerId: user.id,
        orderItems: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      }

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        // If payment method is mobile money or Flutterwave, initiate payment
        if (formData.paymentMethod === 'MTN_MOBILE_MONEY' || formData.paymentMethod === 'AIRTEL_MONEY' || formData.paymentMethod === 'FLUTTERWAVE') {
          try {
            // Get selected Flutterwave method
            const flutterwaveMethod = formData.paymentMethod === 'FLUTTERWAVE' 
              ? (document.querySelector('input[name="flutterwaveMethod"]:checked') as HTMLInputElement)?.value || 'mobile_money'
              : undefined

            const paymentResponse = await fetch('/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: result.data.id,
                paymentMethod: formData.paymentMethod,
                amount: getTotalPrice(),
                currency: 'UGX',
                customerPhone: formData.phoneNumber,
                customerEmail: user.email,
                description: `Payment for order ${result.data.orderNumber}`,
                flutterwaveMethod: flutterwaveMethod
              })
            })

            const paymentResult = await paymentResponse.json()
            
            if (paymentResult.success) {
              setIsProcessing(false)
              clearCart()
              
              if (formData.paymentMethod === 'FLUTTERWAVE' && paymentResult.data.paymentUrl) {
                // Redirect to Flutterwave payment page
                window.location.href = paymentResult.data.paymentUrl
              } else {
                alert(paymentResult.message || 'Payment request sent! Please check your phone and enter your MoMo PIN to complete the payment.')
                window.location.href = '/orders'
              }
            } else {
              console.error('Payment initiation failed:', paymentResult)
              throw new Error(paymentResult.error || paymentResult.message || 'Failed to initiate payment')
            }
          } catch (paymentError) {
            console.error('Error initiating payment:', paymentError)
            setIsProcessing(false)
            const errorMessage = paymentError instanceof Error ? paymentError.message : 'Unknown error'
            alert(`Order created but payment initiation failed: ${errorMessage}. Please contact support.`)
            window.location.href = '/orders'
          }
        } else {
          // For card payments or other methods, just show success
          setIsProcessing(false)
          clearCart()
          alert('Order placed successfully! You will receive a confirmation SMS shortly.')
          window.location.href = '/orders'
        }
      } else {
        throw new Error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setIsProcessing(false)
      alert('Failed to place order. Please try again.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <a href="/products" className="btn-primary btn-lg">
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 lg:pb-8">
        {/* Mobile-optimized Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Complete your order</p>
        </div>

        {/* Mobile Back Button */}
        {step > 1 && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center text-purple-600 hover:text-purple-700 font-medium touch-manipulation min-h-[44px]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        )}

        {/* Mobile Progress Steps */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-8">
            {[
              { number: 1, title: 'Shipping', active: step >= 1 },
              { number: 2, title: 'Payment', active: step >= 2 },
              { number: 3, title: 'Review', active: step >= 3 }
            ].map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                  stepItem.active 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <span className="text-xs sm:text-sm">
                    {stepItem.active ? '✓' : stepItem.number}
                  </span>
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                  stepItem.active ? 'text-purple-600' : 'text-gray-500'
                } hidden sm:block`}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={`w-4 sm:w-16 h-0.5 ml-1 sm:ml-4 ${
                    stepItem.active ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 lg:mb-0">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                </div>
                <div className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+256 700 000 000"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                        required
                      >
                        <option value="">Select District</option>
                        {allDistricts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      
                      {/* Shipping Information Display */}
                      {selectedZone && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center">
                            <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                Delivery Zone: {selectedZone.name}
                              </p>
                              <p className="text-sm text-blue-700">
                                Shipping Cost: {selectedZone.shippingCost === 0 ? 'Free' : formatUgandaCurrency(selectedZone.shippingCost)}
                                {subtotal > 100000 && selectedZone.shippingCost > 0 && (
                                  <span className="ml-2 text-green-600 font-medium">
                                    (Free over UGX 100,000)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-sm touch-manipulation min-h-[48px]"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 lg:mb-0">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                </div>
                <div className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="space-y-3">
                        <label className={`flex items-center p-4 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 touch-manipulation min-h-[72px] sm:min-h-[80px] ${
                          formData.paymentMethod === method.id 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:border-gray-400'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleInputChange}
                            className="h-6 w-6 sm:h-5 sm:w-5 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 border-gray-300 touch-manipulation"
                          />
                          <div className={`p-2 rounded-lg ml-4 ${method.id === 'MTN_MOBILE_MONEY' ? 'bg-yellow-100' : method.id === 'AIRTEL_MONEY' ? 'bg-red-100' : 'bg-blue-100'}`}>
                            <method.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${method.color}`} />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-base sm:text-sm font-semibold text-gray-900">{method.name}</div>
                            <div className="text-sm sm:text-xs text-gray-600 mt-1">{method.description}</div>
                            {method.id === 'MTN_MOBILE_MONEY' || method.id === 'AIRTEL_MONEY' ? (
                              <div className="text-xs text-green-600 mt-2 flex items-center">
                                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                <span className="font-medium">Instant & Secure</span>
                              </div>
                            ) : (
                              <div className="text-xs text-blue-600 mt-2 flex items-center">
                                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                <span className="font-medium">PCI DSS Compliant</span>
                              </div>
                            )}
                          </div>
                          {formData.paymentMethod === method.id && (
                            <div className="ml-3">
                              <CheckCircleIcon className="h-6 w-6 sm:h-5 sm:w-5 text-purple-600" />
                            </div>
                          )}
                        </label>

                        {/* Inline Payment Form - Mobile Money */}
                        {formData.paymentMethod === method.id && (method.id === 'MTN_MOBILE_MONEY' || method.id === 'AIRTEL_MONEY') && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-5 ml-6 sm:ml-8">
                            <div className="flex items-start mb-3">
                              <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-green-900 mb-1">
                                  {method.id === 'MTN_MOBILE_MONEY' ? 'MTN' : 'Airtel'} Mobile Money
                                </h4>
                                <p className="text-xs text-green-700 leading-relaxed">
                                  You'll receive a payment request on your phone. Check your phone and enter your MoMo PIN to complete the transaction.
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 border border-green-200">
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Mobile Money Phone Number *
                              </label>
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+256 700 000 000"
                                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm touch-manipulation min-h-[48px] transition-all duration-200"
                                required
                              />
                              <div className="mt-2 flex items-start">
                                <div className="p-1 bg-blue-100 rounded mr-2 mt-0.5">
                                  <DevicePhoneMobileIcon className="h-3 w-3 text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Enter the phone number linked to your {method.id === 'MTN_MOBILE_MONEY' ? 'MTN' : 'Airtel'} Mobile Money account
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inline Payment Form - Flutterwave */}
                        {formData.paymentMethod === method.id && method.id === 'FLUTTERWAVE' && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 ml-6 sm:ml-8">
                            <div className="flex items-start mb-3">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                  Choose Payment Method
                                </h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                  Select your preferred payment option below.
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Mobile Money Options */}
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <h5 className="text-sm font-semibold text-gray-800 mb-2">Mobile Money</h5>
                                <div className="space-y-2">
                                  <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="flutterwaveMethod"
                                      value="mobile_money"
                                      className="mr-3"
                                      defaultChecked
                                    />
                                    <div className="flex items-center">
                                      <DevicePhoneMobileIcon className="h-5 w-5 text-green-600 mr-2" />
                                      <span className="text-sm font-medium">MTN Mobile Money</span>
                                    </div>
                                  </label>
                                  <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="flutterwaveMethod"
                                      value="mobile_money"
                                      className="mr-3"
                                    />
                                    <div className="flex items-center">
                                      <DevicePhoneMobileIcon className="h-5 w-5 text-red-600 mr-2" />
                                      <span className="text-sm font-medium">Airtel Money</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              
                              {/* Card Payment Option */}
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <h5 className="text-sm font-semibold text-gray-800 mb-2">Card Payment</h5>
                                <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="flutterwaveMethod"
                                    value="card"
                                    className="mr-3"
                                  />
                                  <div className="flex items-center">
                                    <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium">Visa / Mastercard</span>
                                  </div>
                                </label>
                              </div>
                              
                              {/* Bank Transfer Option */}
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <h5 className="text-sm font-semibold text-gray-800 mb-2">Bank Transfer</h5>
                                <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="flutterwaveMethod"
                                    value="bank_transfer"
                                    className="mr-3"
                                  />
                                  <div className="flex items-center">
                                    <BuildingOfficeIcon className="h-5 w-5 text-purple-600 mr-2" />
                                    <span className="text-sm font-medium">Bank Transfer</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inline Payment Form - Card Payment */}
                        {formData.paymentMethod === method.id && (method.id === 'VISA' || method.id === 'MASTERCARD') && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 ml-6 sm:ml-8">
                            <div className="flex items-start mb-3">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                  Secure Card Payment
                                </h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                  Your card information is encrypted and processed securely.
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Card Number *
                                  </label>
                                  <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm touch-manipulation min-h-[48px] transition-all duration-200"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Cardholder Name *
                                  </label>
                                  <input
                                    type="text"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm touch-manipulation min-h-[48px] transition-all duration-200"
                                    required
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                      Expiry Date *
                                    </label>
                                    <input
                                      type="text"
                                      name="expiryDate"
                                      value={formData.expiryDate}
                                      onChange={handleInputChange}
                                      placeholder="MM/YY"
                                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm touch-manipulation min-h-[48px] transition-all duration-200"
                                      required
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                      CVV *
                                    </label>
                                    <input
                                      type="text"
                                      name="cvv"
                                      value={formData.cvv}
                                      onChange={handleInputChange}
                                      placeholder="123"
                                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm touch-manipulation min-h-[48px] transition-all duration-200"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center text-xs text-gray-600">
                                  <div className="p-1 bg-green-100 rounded mr-2">
                                    <ShieldCheckIcon className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span className="font-medium">Protected by SSL encryption and PCI DSS compliance</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card mb-6 lg:mb-0">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                </div>
                <div className="card-content">
                  <div className="space-y-6">
                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{formData.fullName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.district}</p>
                        <p>Phone: {formData.phone}</p>
                        <p>Email: {formData.email}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">
                          {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
                        </p>
                        {formData.paymentMethod === 'MTN_MOBILE_MONEY' || formData.paymentMethod === 'AIRTEL_MONEY' ? (
                          <p>Phone: {formData.phoneNumber}</p>
                        ) : (
                          <p>Card ending in: {formData.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium">{formatUgandaCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Hidden on mobile (shown in floating summary) */}
            <div className="hidden lg:flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px]"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors touch-manipulation min-h-[44px] ml-auto"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] ml-auto"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${formatUgandaCurrency(total)}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 sm:top-8 lg:block hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              </div>
              <div className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{formatUgandaCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatUgandaCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : formatUgandaCurrency(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span className="font-medium">{formatUgandaCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>{formatUgandaCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>SSL encrypted secure payment</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TruckIcon className="h-4 w-4 mr-2 text-blue-600" />
                    <span>
                      {shippingCost === 0 ? 'Free delivery' : `Delivery: ${formatUgandaCurrency(shippingCost)}`}
                      {selectedZone && (
                        <span className="text-gray-500"> ({selectedZone.name})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>1 year warranty on all products</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-600" />
                    <span>Estimated delivery: 2-5 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Checkout Summary */}
      <MobileCheckoutSummary
        step={step}
        total={total}
        subtotal={subtotal}
        shippingCost={shippingCost}
        tax={tax}
        onNext={handleNext}
        onPlaceOrder={handlePlaceOrder}
        isProcessing={isProcessing}
      />
    </div>
  )
}
