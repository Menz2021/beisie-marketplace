'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  EyeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  PhoneIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  shippingAddress: string
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: string
  orderItems: OrderItem[]
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [refundForm, setRefundForm] = useState({
    reason: '',
    type: 'FULL',
    amount: 0,
    description: ''
  })
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const router = useRouter()

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 150000,
      items: 2,
      shippingAddress: 'Plot 123, Nakawa Industrial Area, Kampala',
      paymentMethod: 'MTN Mobile Money',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-18',
      orderItems: [
        {
          id: '1',
          name: 'Samsung Galaxy A54 5G',
          price: 120000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Black',
          size: '128GB'
        },
        {
          id: '2',
          name: 'Phone Case - Clear',
          price: 30000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Clear'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 75000,
      items: 1,
      shippingAddress: 'Block 45, Ntinda Complex, Kampala',
      paymentMethod: 'Visa Card',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-20',
      orderItems: [
        {
          id: '3',
          name: 'Wireless Bluetooth Headphones',
          price: 75000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'White'
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'processing',
      total: 200000,
      items: 3,
      shippingAddress: 'Plot 67, Industrial Area, Jinja',
      paymentMethod: 'Airtel Money',
      estimatedDelivery: '2024-01-25',
      orderItems: [
        {
          id: '4',
          name: 'Laptop Stand - Adjustable',
          price: 80000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Silver'
        },
        {
          id: '5',
          name: 'USB-C Hub',
          price: 60000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Black'
        },
        {
          id: '6',
          name: 'Wireless Mouse',
          price: 60000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Black'
        }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-01',
      status: 'pending',
      total: 45000,
      items: 2,
      shippingAddress: 'Plot 89, Mukono Town, Mukono',
      paymentMethod: 'MTN Mobile Money',
      estimatedDelivery: '2024-01-28',
      orderItems: [
        {
          id: '7',
          name: 'Phone Charger - Fast Charge',
          price: 25000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'White'
        },
        {
          id: '8',
          name: 'Screen Protector',
          price: 20000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Clear'
        }
      ]
    },
    {
      id: '5',
      orderNumber: 'ORD-2023-156',
      date: '2023-12-20',
      status: 'cancelled',
      total: 180000,
      items: 1,
      shippingAddress: 'Plot 12, Masaka Town, Masaka',
      paymentMethod: 'Visa Card',
      orderItems: [
        {
          id: '9',
          name: 'Gaming Chair - Ergonomic',
          price: 180000,
          quantity: 1,
          image: '/api/placeholder/100/100',
          color: 'Black/Red'
        }
      ]
    }
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_session')
    if (userData) {
      const userObj = JSON.parse(userData)
      // Redirect sellers to seller dashboard
      if (userObj.role === 'SELLER') {
        router.push('/seller/dashboard')
        return
      }
      setUser(userObj)
      fetchUserOrders(userObj.id)
    } else {
      // Redirect to login if not logged in
      router.push('/auth/login')
    }
    setIsLoading(false)
  }, [router])

  const fetchUserOrders = async (userId: string) => {
    setOrdersLoading(true)
    try {
      const response = await fetch(`/api/orders?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        // Transform API data to match our interface
        const transformedOrders = data.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          status: order.status.toLowerCase(),
          total: order.total,
          items: order.orderItems.length,
          shippingAddress: typeof order.shippingAddress === 'string' 
            ? JSON.parse(order.shippingAddress).address || order.shippingAddress
            : order.shippingAddress,
          paymentMethod: order.paymentMethod || 'Unknown',
          trackingNumber: order.trackingNumber,
          estimatedDelivery: order.estimatedDelivery,
          orderItems: order.orderItems.map((item: any) => ({
            id: item.id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.images ? JSON.parse(item.product.images)[0] : '/api/placeholder/100/100',
            color: item.product.brand,
            size: item.product.sku
          }))
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered'
      case 'shipped': return 'Shipped'
      case 'processing': return 'Processing'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const filteredOrders = useMemo(() => {
    return filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)
  }, [orders, filterStatus])

  const handleViewOrder = useCallback((order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }, [])

  const handleCancelOrder = useCallback(async (orderId: string) => {
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Order cancelled successfully')
        // Update the orders list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        )
        // Close the modal
        setShowOrderDetails(false)
        // Refresh orders
        if (user) {
          fetchUserOrders(user.id)
        }
      } else {
        toast.error(data.error || 'Failed to cancel order')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Failed to cancel order')
    }
  }, [])

  const handleReturnOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setRefundForm({
        reason: '',
        type: 'FULL',
        amount: order.total,
        description: ''
      })
      setShowRefundModal(true)
      setShowOrderDetails(false) // Close order details modal if open
    }
  }, [orders])

  const handleRefundRequest = useCallback(async (e: React.FormEvent) => {
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
        toast.success('Refund request submitted successfully!')
        setShowRefundModal(false)
        setRefundForm({
          reason: '',
          type: 'FULL',
          amount: 0,
          description: ''
        })
      } else {
        toast.error(data.error || 'Failed to submit refund request')
      }
    } catch (error) {
      console.error('Error submitting refund request:', error)
      toast.error('Failed to submit refund request')
    }
  }, [selectedOrder, user, refundForm])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 touch-manipulation min-h-[40px] min-w-[40px] justify-center"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setFilterStatus('all')
                    setShowMobileFilters(false)
                  }}
                  className={`w-full text-left py-3 px-3 rounded-lg font-medium text-sm touch-manipulation min-h-[48px] flex items-center ${
                    filterStatus === 'all'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('pending')
                    setShowMobileFilters(false)
                  }}
                  className={`w-full text-left py-3 px-3 rounded-lg font-medium text-sm touch-manipulation min-h-[48px] flex items-center ${
                    filterStatus === 'pending'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Pending ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('processing')
                    setShowMobileFilters(false)
                  }}
                  className={`w-full text-left py-3 px-3 rounded-lg font-medium text-sm touch-manipulation min-h-[48px] flex items-center ${
                    filterStatus === 'processing'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Processing ({orders.filter(o => o.status === 'processing').length})
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('shipped')
                    setShowMobileFilters(false)
                  }}
                  className={`w-full text-left py-3 px-3 rounded-lg font-medium text-sm touch-manipulation min-h-[48px] flex items-center ${
                    filterStatus === 'shipped'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Shipped ({orders.filter(o => o.status === 'shipped').length})
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('delivered')
                    setShowMobileFilters(false)
                  }}
                  className={`w-full text-left py-3 px-3 rounded-lg font-medium text-sm touch-manipulation min-h-[48px] flex items-center ${
                    filterStatus === 'delivered'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Delivered ({orders.filter(o => o.status === 'delivered').length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Desktop Filter Tabs */}
        <div className="hidden lg:block mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setFilterStatus('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filterStatus === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filterStatus === 'pending'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filterStatus === 'processing'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Processing ({orders.filter(o => o.status === 'processing').length})
              </button>
              <button
                onClick={() => setFilterStatus('shipped')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filterStatus === 'shipped'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipped ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setFilterStatus('delivered')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filterStatus === 'delivered'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Filter Status Display */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filterStatus === 'all' ? 'All Orders' : getStatusText(filterStatus)} ({filteredOrders.length})
            </p>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 touch-manipulation min-h-[40px]"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 lg:space-y-6">
          {ordersLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {filterStatus === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No orders with status "${getStatusText(filterStatus)}" found.`
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                  <div className="flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-gray-500">
                        Estimated delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-gray-900">UGX {order.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {order.orderItems.slice(0, 2).map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{order.orderItems.length - 2} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3">
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{order.shippingAddress}</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{order.paymentMethod}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Track: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center justify-center px-4 py-3 lg:py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 touch-manipulation min-h-[48px]"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-3 lg:py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 touch-manipulation min-h-[48px]"
                      >
                        Cancel Order
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleReturnOrder(order.id)}
                        className="px-4 py-3 lg:py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 touch-manipulation min-h-[48px]"
                      >
                        Return Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 lg:top-20 mx-auto p-4 lg:p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Order Status */}
              <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Order Status</h4>
                    <p className="text-sm text-gray-500">Placed on {formatDate(selectedOrder.date)}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2">{getStatusText(selectedOrder.status)}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 lg:mb-4">Order Items</h4>
                  <div className="space-y-3 lg:space-y-4">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 lg:space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                          {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 text-sm lg:text-base">UGX {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 lg:mb-4">Order Information</h4>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="p-3 lg:p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                    </div>
                    
                    <div className="p-3 lg:p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Payment Method</h5>
                      <p className="text-sm text-gray-600">{selectedOrder.paymentMethod}</p>
                    </div>
                    
                    {selectedOrder.trackingNumber && (
                      <div className="p-3 lg:p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Tracking Information</h5>
                        <p className="text-sm text-gray-600">Tracking Number: {selectedOrder.trackingNumber}</p>
                        {selectedOrder.estimatedDelivery && (
                          <p className="text-sm text-gray-600">
                            Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="p-3 lg:p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Order Summary</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">UGX {selectedOrder.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">Free</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">UGX {selectedOrder.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-3 lg:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 touch-manipulation min-h-[48px] w-full sm:w-auto"
                >
                  Close
                </button>
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="px-4 py-3 lg:py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Cancel Order
                  </button>
                )}
                {selectedOrder.status === 'delivered' && (
                  <button
                    onClick={() => handleReturnOrder(selectedOrder.id)}
                    className="px-4 py-3 lg:py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Return Item
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 lg:top-20 mx-auto p-4 lg:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base lg:text-lg font-medium text-gray-900">Request Refund</h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Order #{selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-600">Total: UGX {selectedOrder.total.toLocaleString()}</p>
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
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation min-h-[48px]"
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
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation min-h-[48px]"
                    placeholder="Enter refund amount"
                    min="0"
                    max={selectedOrder.total}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Refund *
                  </label>
                  <select
                    value={refundForm.reason}
                    onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})}
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation min-h-[48px]"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="DEFECTIVE_PRODUCT">Defective Product</option>
                    <option value="WRONG_ITEM">Wrong Item Received</option>
                    <option value="DAMAGED_DURING_SHIPPING">Damaged During Shipping</option>
                    <option value="NOT_AS_DESCRIBED">Not as Described</option>
                    <option value="CHANGED_MIND">Changed Mind</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={refundForm.description}
                    onChange={(e) => setRefundForm({...refundForm, description: e.target.value})}
                    className="w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base lg:text-sm touch-manipulation min-h-[120px]"
                    rows={3}
                    placeholder="Please provide additional details about your refund request..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-3 lg:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 lg:py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 touch-manipulation min-h-[48px] w-full sm:w-auto"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
