'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { formatUgandaCurrency, validateUgandaPhoneNumber, formatUgandaPhoneNumber } from '@/lib/payments'

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
    paymentMethod: 'MTN_MOBILE_MONEY',
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
      } else {
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
          alert('Please fill in all card details')
          return
        }
      }
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
        setIsProcessing(false)
        clearCart()
        alert('Order placed successfully! You will receive a confirmation SMS shortly.')
        window.location.href = '/orders'
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Shipping', active: step >= 1 },
              { number: 2, title: 'Payment', active: step >= 2 },
              { number: 3, title: 'Review', active: step >= 3 }
            ].map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  stepItem.active 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {stepItem.active ? '✓' : stepItem.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  stepItem.active ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    stepItem.active ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="input"
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
                        className="input"
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
                        className="input"
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
                        className="input"
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
                        className="input"
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
                        className="input"
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
                      className="input"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="card-content">
                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <method.icon className={`h-6 w-6 ml-3 ${method.color}`} />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                          {method.id === 'MTN_MOBILE_MONEY' || method.id === 'AIRTEL_MONEY' ? (
                            <div className="text-xs text-green-600 mt-1 flex items-center">
                              <ShieldCheckIcon className="h-3 w-3 mr-1" />
                              Instant & Secure
                            </div>
                          ) : (
                            <div className="text-xs text-blue-600 mt-1 flex items-center">
                              <ShieldCheckIcon className="h-3 w-3 mr-1" />
                              PCI DSS Compliant
                            </div>
                          )}
                        </div>
                        {formData.paymentMethod === method.id && (
                          <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                        )}
                      </label>
                    ))}
                  </div>

                  {(formData.paymentMethod === 'MTN_MOBILE_MONEY' || formData.paymentMethod === 'AIRTEL_MONEY') && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-green-900 mb-2">
                            Mobile Money Payment
                          </h4>
                          <p className="text-sm text-green-700 mb-3">
                            Your payment is processed securely through {formData.paymentMethod === 'MTN_MOBILE_MONEY' ? 'MTN' : 'Airtel'} Mobile Money. 
                            You'll receive a payment request on your phone to complete the transaction.
                          </p>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mobile Money Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              placeholder="+256 700 000 000"
                              className="input"
                              required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Enter the phone number linked to your {formData.paymentMethod === 'MTN_MOBILE_MONEY' ? 'MTN' : 'Airtel'} Mobile Money account
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.paymentMethod === 'VISA' || formData.paymentMethod === 'MASTERCARD') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start mb-4">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">
                            Secure Card Payment
                          </h4>
                          <p className="text-sm text-blue-700">
                            Your card information is encrypted and processed securely. We never store your card details.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="input"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="input"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="input"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="input"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center text-xs text-gray-600">
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        <span>Protected by SSL encryption and PCI DSS compliance</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card">
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

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn-outline btn-md"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary btn-md ml-auto"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn-primary btn-md ml-auto disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${formatUgandaCurrency(total)}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              </div>
              <div className="card-content">
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
    </div>
  )
}
