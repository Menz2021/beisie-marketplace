'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CogIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  HomeIcon,
  CreditCardIcon,
  BellIcon,
  TrashIcon,
  PlusIcon,
  PencilIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  isVerified: boolean
  isActive: boolean
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
}

interface PaymentMethod {
  id: string
  type: 'card' | 'mobile_money'
  provider: string
  lastFour?: string
  phoneNumber?: string
  isDefault: boolean
  expiryDate?: string
  cardHolderName?: string
}

interface PaymentHistory {
  id: string
  orderNumber: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [refundForm, setRefundForm] = useState({
    reason: '',
    type: 'FULL',
    amount: 0,
    description: ''
  })
  const router = useRouter()

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [addressForm, setAddressForm] = useState({
    type: 'HOME',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    district: '',
    postalCode: ''
  })
  const [paymentForm, setPaymentForm] = useState({
    type: 'card',
    provider: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    phoneNumber: '',
    isDefault: false
  })

  // Real orders data
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Real refunds data
  const [refunds, setRefunds] = useState<any[]>([])
  const [refundsLoading, setRefundsLoading] = useState(false)
  
  // Real addresses data
  const [addresses, setAddresses] = useState<any[]>([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  // Real payments data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)




  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_session')
    if (userData) {
      const userObj = JSON.parse(userData)
      setUser(userObj)
      setProfileForm({
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone || ''
      })
      // Fetch user orders, refunds, addresses, and payments
      fetchUserOrders(userObj.id)
      fetchUserRefunds(userObj.id)
      fetchUserAddresses(userObj.id)
      fetchUserPayments(userObj.id)
    } else {
      // Redirect to login if not logged in
      router.push('/auth/login')
    }
    setIsLoading(false)
  }, [router])

  const fetchUserOrders = async (userId: string) => {
    setOrdersLoading(true)
    try {
      const response = await fetch(`/api/orders?userId=${userId}&limit=5`)
      const data = await response.json()
      if (data.success) {
        // Transform API data to match our interface
        const transformedOrders = data.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          status: order.status.toLowerCase(),
          total: order.total,
          items: order.orderItems.length
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchUserRefunds = async (userId: string) => {
    setRefundsLoading(true)
    try {
      const response = await fetch(`/api/customer/refunds?customerId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setRefunds(data.data)
      }
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setRefundsLoading(false)
    }
  }

  const fetchUserAddresses = async (userId: string) => {
    setAddressesLoading(true)
    try {
      const response = await fetch('/api/addresses', {
        headers: {
          'x-user-id': userId
        }
      })
      const data = await response.json()
      if (data.success) {
        setAddresses(data.data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setAddressesLoading(false)
    }
  }

  const fetchUserPayments = async (userId: string) => {
    setPaymentsLoading(true)
    try {
      const response = await fetch(`/api/customer/payments?customerId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setPaymentMethods(data.data.paymentMethods)
        setPaymentHistory(data.data.paymentHistory)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('user_session')
    localStorage.removeItem('cart-storage')
    localStorage.removeItem('wishlist-storage')
    
    // Clear any other user-related data
    localStorage.removeItem('user_preferences')
    localStorage.removeItem('recent_searches')
    
    // Reset user state
    setUser(null)
    
    // Redirect to homepage
    router.push('/')
    
    // Optional: Show a success message
    alert('You have been logged out successfully!')
  }

  const handleAddressAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          ...addressForm,
          address: addressForm.street
        })
      })

      const data = await response.json()
      if (data.success) {
        setAddressForm({
          type: 'HOME',
          fullName: '',
          phone: '',
          street: '',
          city: '',
          district: '',
          postalCode: ''
        })
        setShowAddressForm(false)
        fetchUserAddresses(user.id)
        alert('Address added successfully!')
      } else {
        console.error('Failed to add address:', data.error)
        alert('Failed to add address. Please try again.')
      }
    } catch (error) {
      console.error('Error adding address:', error)
      alert('Error adding address. Please try again.')
    }
  }

  const handleAddressEdit = (address: any) => {
    setEditingAddress(address)
    setAddressForm({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      street: address.address,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode || ''
    })
    setShowAddressForm(true)
  }

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingAddress) return

    try {
      const response = await fetch(`/api/addresses/${editingAddress.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          ...addressForm,
          address: addressForm.street
        })
      })

      const data = await response.json()
      if (data.success) {
        setAddressForm({
          type: 'HOME',
          fullName: '',
          phone: '',
          street: '',
          city: '',
          district: '',
          postalCode: ''
        })
        setShowAddressForm(false)
        setEditingAddress(null)
        fetchUserAddresses(user.id)
        alert('Address updated successfully!')
      } else {
        console.error('Failed to update address:', data.error)
        alert('Failed to update address. Please try again.')
      }
    } catch (error) {
      console.error('Error updating address:', error)
      alert('Error updating address. Please try again.')
    }
  }

  const handleAddressDelete = async (addressId: string) => {
    if (!user) return
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id
        }
      })

      const data = await response.json()
      if (data.success) {
        fetchUserAddresses(user.id)
        alert('Address deleted successfully!')
      } else {
        console.error('Failed to delete address:', data.error)
        alert('Failed to delete address. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Error deleting address. Please try again.')
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
      // Update localStorage
      const updatedUser = { ...user, ...profileForm } as User
      localStorage.setItem('user_session', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to change password')
    }
  }


  const handleAccountDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Account deleted successfully')
      localStorage.removeItem('user_session')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  const handlePaymentMethodAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch('/api/customer/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          type: paymentForm.type,
          provider: paymentForm.provider,
          cardNumber: paymentForm.cardNumber,
          expiryDate: paymentForm.expiryDate,
          cvv: paymentForm.cvv,
          cardHolderName: paymentForm.cardHolderName,
          phoneNumber: paymentForm.phoneNumber,
          isDefault: paymentForm.isDefault
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Payment method added successfully!')
        setPaymentForm({
          type: 'card',
          provider: 'visa',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardHolderName: '',
          phoneNumber: '',
          isDefault: false
        })
        // Refresh payments data
        fetchUserPayments(user.id)
      } else {
        toast.error(data.error || 'Failed to add payment method')
      }
    } catch (error) {
      console.error('Error adding payment method:', error)
      toast.error('Failed to add payment method')
    }
  }

  const handlePaymentMethodUpdate = async (paymentMethodId: string, isDefault: boolean) => {
    if (!user) return

    try {
      const response = await fetch(`/api/customer/payments/${paymentMethodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDefault
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Payment method updated successfully!')
        // Refresh payments data
        fetchUserPayments(user.id)
      } else {
        toast.error(data.error || 'Failed to update payment method')
      }
    } catch (error) {
      console.error('Error updating payment method:', error)
      toast.error('Failed to update payment method')
    }
  }

  const handlePaymentMethodDelete = async (paymentMethodId: string) => {
    if (!user) return

    if (!confirm('Are you sure you want to delete this payment method?')) {
      return
    }

    try {
      const response = await fetch(`/api/customer/payments/${paymentMethodId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Payment method deleted successfully!')
        // Refresh payments data
        fetchUserPayments(user.id)
      } else {
        toast.error(data.error || 'Failed to delete payment method')
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      toast.error('Failed to delete payment method')
    }
  }

  const handleReturnItem = (order: Order) => {
    setSelectedOrder(order)
    setRefundForm({
      reason: '',
      type: 'FULL',
      amount: order.total,
      description: ''
    })
    setShowRefundModal(true)
  }

  const handleRefundRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder || !user) return

    try {
      const response = await fetch('/api/customer/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          amount: refundForm.amount,
          reason: refundForm.reason,
          type: refundForm.type,
          description: refundForm.description
        })
      })

      const data = await response.json()
      
      if (data.success) {
      toast.success('Refund request submitted successfully! We will review it within 2-3 business days.')
      setShowRefundModal(false)
      setRefundForm({
        reason: '',
        type: 'FULL',
        amount: 0,
        description: ''
      })
      setSelectedOrder(null)
        // Refresh refunds list
        fetchUserRefunds(user.id)
      } else {
        toast.error(data.error || 'Failed to submit refund request')
      }
    } catch (error) {
      console.error('Error submitting refund request:', error)
      toast.error('Failed to submit refund request')
    }
  }

  const openRefundModal = (order: Order) => {
    setSelectedOrder(order)
    setRefundForm({
      reason: '',
      type: 'FULL',
      amount: order.total,
      description: ''
    })
    setShowRefundModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="h-4 w-4" />
      case 'shipped': return <TruckIcon className="h-4 w-4" />
      case 'processing': return <ClockIcon className="h-4 w-4" />
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'PROCESSED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'returns', name: 'Returns & Refunds', icon: ExclamationTriangleIcon },
    { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md touch-manipulation min-h-[40px]"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Account Menu</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg touch-manipulation min-h-[48px] ${
                      activeTab === tab.id 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-10 w-10 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                        placeholder="+256 700 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-base lg:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 lg:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation min-h-[48px] w-full lg:w-auto"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                    <Link
                      href="/orders"
                      className="px-4 py-3 lg:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium touch-manipulation min-h-[48px] w-full sm:w-auto text-center"
                    >
                      View All Orders
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {ordersLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <p className="text-sm text-gray-400 mt-2">Your orders will appear here</p>
                      </div>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            <p className="text-sm text-gray-500">{order.items} item(s)</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium text-gray-900">UGX {order.total.toLocaleString()}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <Link
                            href="/orders"
                            className="text-sm text-purple-600 hover:text-purple-700 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start"
                          >
                            View Details
                          </Link>
                          {order.status === 'delivered' && (
                            <button 
                              onClick={() => handleReturnItem(order)}
                              className="text-sm text-purple-600 hover:text-purple-700 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start"
                            >
                              Return Item
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button className="text-sm text-red-600 hover:text-red-700 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                      ))
                    )}
                    {orders.length > 3 && (
                      <div className="text-center pt-4">
                        <Link
                          href="/orders"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium touch-manipulation min-h-[44px] flex items-center justify-center"
                        >
                          View {orders.length - 3} more orders →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Return Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Quick Return Actions</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {orders.filter(order => order.status === 'delivered').map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-500">Delivered on {order.date}</p>
                            <p className="text-sm text-gray-500">{order.items} item(s)</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => openRefundModal(order)}
                            className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium touch-manipulation min-h-[48px]"
                          >
                            Request Refund
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {orders.filter(order => order.status === 'delivered').length === 0 && (
                    <div className="text-center py-8">
                      <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No delivered orders available for return</p>
                      <p className="text-sm text-gray-400 mt-2">Only delivered orders can be returned</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Returns & Refunds Tab */}
            {activeTab === 'returns' && (
              <div className="space-y-6">
                {/* Refund Requests */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">My Refund Requests</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
                    >
                      Request New Refund
                    </button>
                  </div>
                  
                  {refundsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading refund requests...</p>
                    </div>
                  ) : refunds.length > 0 ? (
                    <div className="space-y-4">
                      {refunds.map((refund) => (
                        <div key={refund.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">Order #{refund.orderId}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(refund.status)}`}>
                                  {refund.status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>Product:</strong> {refund.order?.orderItems?.[0]?.product?.name || 'Multiple items'}
                                  </p>
                              <p className="text-sm text-gray-500 mt-1">
                                <strong>Reason:</strong> {refund.reason}
                              </p>
                              {refund.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <strong>Description:</strong> {refund.description}
                                </p>
                              )}
                            </div>
                                
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <strong>Amount:</strong> <span className="font-medium text-gray-900">{formatCurrency(refund.amount)}</span>
                                  </p>
                              <p className="text-sm text-gray-500 mt-1">
                                    <strong>Type:</strong> {refund.type} Refund
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    <strong>Requested:</strong> {new Date(refund.createdAt).toLocaleDateString()}
                                  </p>
                                  {refund.updatedAt && refund.updatedAt !== refund.createdAt && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      <strong>Last Updated:</strong> {new Date(refund.updatedAt).toLocaleDateString()}
                                    </p>
                                  )}
                            </div>
                          </div>

                              {refund.adminNotes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-600">
                                    <strong>Admin Notes:</strong> {refund.adminNotes}
                                  </p>
                            </div>
                              )}

                              {/* Status-specific information */}
                              {refund.status === 'APPROVED' && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-sm text-green-800">
                                    <strong>✓ Approved!</strong> Your refund has been approved and will be processed within 5-7 business days.
                                  </p>
                                </div>
                              )}
                              
                              {refund.status === 'REJECTED' && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm text-red-800">
                                    <strong>✗ Rejected</strong> Your refund request has been rejected. Please contact support if you have questions.
                                  </p>
                                </div>
                              )}
                              
                              {refund.status === 'PROCESSED' && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>✓ Processed!</strong> Your refund has been processed and should appear in your account within 2-3 business days.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No refund requests yet</p>
                      <p className="text-sm text-gray-400 mt-2">Your refund requests will appear here</p>
                    </div>
                  )}
                </div>

                {/* Return Policy */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Return & Refund Policy</h3>
                    <Link
                      href="/returns"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Full Policy →
                    </Link>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Return Eligibility */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        Return Eligibility
                      </h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start">
                            <ClockIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span><strong>30-Day Window:</strong> Items must be returned within 30 days of delivery</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span><strong>Original Condition:</strong> Products must be in original condition with tags attached</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span><strong>Working Electronics:</strong> Electronic items must be in working condition</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Non-Returnable Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                        Non-Returnable Items
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start">
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Personalized or custom items</span>
                          </li>
                          <li className="flex items-start">
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Perishable goods and intimate apparel</span>
                          </li>
                          <li className="flex items-start">
                            <XCircleIcon className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Digital products and damaged items</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Refund Process */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                        Refund Process
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Step 1-2: Submit & Review</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• Submit refund request through your account</li>
                              <li>• We review within 2-3 business days</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Step 3-4: Return & Refund</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li>• Return items as instructed</li>
                              <li>• Refund processed in 5-7 business days</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Support */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Support</h4>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3">Need help with your return? Contact our customer support team:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">support@testmarketplace.ug</span>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">+256 700 000 000</span>
                          </div>
                          <div className="flex items-center">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">Live Chat 24/7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                    <button
                      onClick={() => setPaymentForm({...paymentForm, type: 'card'})}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                  
                  {paymentsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading payment methods...</p>
                    </div>
                  ) : paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-8 rounded flex items-center justify-center ${
                              method.type === 'card' 
                                ? 'bg-blue-600' 
                                : method.provider === 'MTN MoMo' 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-600'
                            }`}>
                              {method.type === 'card' ? (
                                <CreditCardIcon className="h-5 w-5 text-white" />
                              ) : (
                                <DevicePhoneMobileIcon className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {method.provider}
                                {method.lastFour && ` ****${method.lastFour}`}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {method.type === 'card' 
                                  ? `${method.cardHolderName} • Expires ${method.expiryDate}`
                                  : method.phoneNumber
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                            <button 
                              onClick={() => handlePaymentMethodUpdate(method.id, !method.isDefault)}
                              className="text-purple-600 hover:text-purple-700"
                              title={method.isDefault ? "Remove as default" : "Set as default"}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handlePaymentMethodDelete(method.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete payment method"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No payment methods saved yet</p>
                      <p className="text-sm text-gray-400 mt-2">Add your first payment method below</p>
                    </div>
                  )}

                  {/* Add Payment Method Form */}
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Add New Payment Method</h4>
                    <form onSubmit={handlePaymentMethodAdd} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Type
                          </label>
                          <select
                            value={paymentForm.type}
                            onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value as 'card' | 'mobile_money'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="card">Credit/Debit Card</option>
                            <option value="mobile_money">Mobile Money</option>
                          </select>
                        </div>
                        
                        {paymentForm.type === 'card' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Provider
                              </label>
                              <select
                                value={paymentForm.provider}
                                onChange={(e) => setPaymentForm({...paymentForm, provider: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              >
                                <option value="visa">Visa</option>
                                <option value="mastercard">Mastercard</option>
                                <option value="amex">American Express</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number
                              </label>
                              <input
                                type="text"
                                value={paymentForm.cardNumber}
                                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={paymentForm.expiryDate}
                                onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                value={paymentForm.cvv}
                                onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                                placeholder="123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                value={paymentForm.cardHolderName}
                                onChange={(e) => setPaymentForm({...paymentForm, cardHolderName: e.target.value})}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Money Provider
                              </label>
                              <select
                                value={paymentForm.provider}
                                onChange={(e) => setPaymentForm({...paymentForm, provider: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              >
                                <option value="mtn">MTN MoMo</option>
                                <option value="airtel">Airtel Money</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={paymentForm.phoneNumber}
                                onChange={(e) => setPaymentForm({...paymentForm, phoneNumber: e.target.value})}
                                placeholder="+256 700 000 000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={paymentForm.isDefault}
                          onChange={(e) => setPaymentForm({...paymentForm, isDefault: e.target.checked})}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                          Set as default payment method
                        </label>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          Add Payment Method
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
                  {paymentsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading payment history...</p>
                    </div>
                  ) : paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{payment.orderNumber}</h4>
                            <p className="text-sm text-gray-500">{payment.description}</p>
                            <p className="text-sm text-gray-500">Paid with {payment.method}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">UGX {payment.amount.toLocaleString()}</p>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">{payment.date}</p>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No payment history found</p>
                      <p className="text-sm text-gray-400 mt-2">Your payment history will appear here after making purchases</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Saved Addresses</h3>
                  {addressesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading addresses...</p>
                    </div>
                  ) : addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{address.type}</h4>
                            <p className="text-sm text-gray-600 font-medium">{address.fullName}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                              <p className="text-sm text-gray-600">{address.address}</p>
                            <p className="text-sm text-gray-600">{address.city}, {address.district}</p>
                              {address.postalCode && (
                            <p className="text-sm text-gray-600">{address.postalCode}</p>
                              )}
                          </div>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <button 
                              onClick={() => handleAddressEdit(address)}
                              className="text-sm text-purple-600 hover:text-purple-700"
                            >
                            Edit
                          </button>
                            <button 
                              onClick={() => handleAddressDelete(address.id)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No addresses saved yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Add your first address below.</p>
                    </div>
                  )}

                  <form onSubmit={editingAddress ? handleAddressUpdate : handleAddressAdd} className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h4>
                      {editingAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(null)
                            setAddressForm({
                              type: 'HOME',
                              fullName: '',
                              phone: '',
                              street: '',
                              city: '',
                              district: '',
                              postalCode: ''
                            })
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <select
                          value={addressForm.type}
                          onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="HOME">Home</option>
                          <option value="WORK">Work</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                          placeholder="+256 700 000 000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District *
                        </label>
                        <select
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        >
                          <option value="">Select District</option>
                          <option value="Kampala">Kampala</option>
                          <option value="Wakiso">Wakiso</option>
                          <option value="Mukono">Mukono</option>
                          <option value="Jinja">Jinja</option>
                          <option value="Masaka">Masaka</option>
                          <option value="Mbarara">Mbarara</option>
                          <option value="Gulu">Gulu</option>
                          <option value="Lira">Lira</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Add Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Enable
                    </button>
                  </div>
                </div>

                {/* Account Deletion */}
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-6">Danger Zone</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Get text messages about important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive promotional offers and product updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Data Sharing</p>
                        <p className="text-sm text-gray-500">Allow data sharing for improved experience</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="en">English</option>
                        <option value="lg">Luganda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="UGX">Ugandan Shilling (UGX)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund Request Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 lg:top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Request Refund</h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Order Details</h4>
                <p className="text-sm text-gray-600">Order #{selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(selectedOrder.total)}</p>
                <p className="text-sm text-gray-600">Items: {selectedOrder.items}</p>
              </div>
              
              <form onSubmit={handleRefundRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Type *
                  </label>
                  <select
                    value={refundForm.type}
                    onChange={(e) => setRefundForm({...refundForm, type: e.target.value})}
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                    required
                  >
                    <option value="FULL">Full Refund</option>
                    <option value="PARTIAL">Partial Refund</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Amount *
                  </label>
                  <input
                    type="number"
                    value={refundForm.amount}
                    onChange={(e) => setRefundForm({...refundForm, amount: parseFloat(e.target.value)})}
                    max={selectedOrder.total}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatCurrency(selectedOrder.total)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Refund *
                  </label>
                  <select
                    value={refundForm.reason}
                    onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})}
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="Product damaged during shipping">Product damaged during shipping</option>
                    <option value="Wrong item received">Wrong item received</option>
                    <option value="Product not as described">Product not as described</option>
                    <option value="Product defective">Product defective</option>
                    <option value="Customer changed mind">Customer changed mind</option>
                    <option value="Late delivery">Late delivery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={refundForm.description}
                    onChange={(e) => setRefundForm({...refundForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation"
                    placeholder="Please provide additional details about your refund request..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-3 lg:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 lg:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Submit Refund Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 lg:top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Account</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                </p>
              </div>
              <div className="items-center px-4 py-3 space-y-3">
                <button
                  onClick={handleAccountDelete}
                  className="px-4 py-3 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 touch-manipulation min-h-[48px]"
                >
                  Yes, Delete Account
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-3 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-manipulation min-h-[48px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
