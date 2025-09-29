'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
    images: string
    vendor: {
      id: string
      name: string
      email: string
    }
  }
}

interface ShippingAddress {
  id: string
  fullName: string
  address: string
  city: string
  district: string
  phone: string
  isDefault: boolean
}

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: string
  trackingNumber: string | null
  estimatedDelivery: string | null
  createdAt: string
  updatedAt: string
  customer: User
  orderItems: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sellerFilter, setSellerFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in via secure cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          fetchOrders()
        } else {
          // Redirect to admin login if not logged in
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      // Clear secure cookie via API
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Redirect to admin login
      router.push('/admin/login')
    }
  }

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      if (sellerFilter) params.append('seller', sellerFilter)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter, sellerFilter, dateFrom, dateTo])

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Order status updated successfully!')
        setShowStatusModal(false)
        setNewStatus('')
        setStatusNotes('')
        fetchOrders()
      } else {
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Order deleted successfully!')
        fetchOrders()
      } else {
        toast.error(data.error || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Failed to delete order')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockIcon className="h-4 w-4" />
      case 'CONFIRMED': return <CheckCircleIcon className="h-4 w-4" />
      case 'PROCESSING': return <PencilIcon className="h-4 w-4" />
      case 'SHIPPED': return <TruckIcon className="h-4 w-4" />
      case 'DELIVERED': return <CheckCircleIcon className="h-4 w-4" />
      case 'CANCELLED': return <XCircleIcon className="h-4 w-4" />
      case 'REFUNDED': return <CurrencyDollarIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
              >
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Back
              </button>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">Order Management</h1>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors touch-manipulation min-h-[36px]"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-Optimized Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order number, customer name..."
                  className="w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                />
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Seller
                </label>
                <select
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                >
                  <option value="">All Sellers</option>
                  {Array.from(new Set(orders.flatMap(order => 
                    order.orderItems.map(item => item.product.vendor?.name).filter(Boolean)
                  ))).map(sellerName => (
                    <option key={sellerName} value={sellerName}>{sellerName}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                />
              </div>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setSellerFilter('')
                  setDateFrom('')
                  setDateTo('')
                }}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors touch-manipulation min-h-[44px] text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Display - Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                        {order.customer.phone && (
                          <div className="text-xs text-gray-400">{order.customer.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {(() => {
                          const uniqueSellers = Array.from(new Set(
                            order.orderItems
                              .map(item => item.product.vendor?.name)
                              .filter(Boolean)
                          ))
                          
                          if (uniqueSellers.length === 0) {
                            return <div className="text-sm text-gray-500">No seller info</div>
                          }
                          
                          if (uniqueSellers.length === 1) {
                            const seller = order.orderItems.find(item => item.product.vendor?.name === uniqueSellers[0])?.product.vendor
                            return (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {seller?.name}
                                </div>
                                <div className="text-sm text-gray-500">{seller?.email}</div>
                              </>
                            )
                          }
                          
                          return (
                            <>
                              <div className="text-sm font-medium text-gray-900">
                                {uniqueSellers[0]}
                              </div>
                              <div className="text-xs text-gray-400">
                                +{uniqueSellers.length - 1} more seller{uniqueSellers.length - 1 !== 1 ? 's' : ''}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="text-xs text-gray-500">
                          +{formatCurrency(order.shippingCost)} shipping
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        <button 
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus(order.status)
                            setStatusNotes('')
                            setShowStatusModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Update Status"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      #{order.orderNumber}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button 
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowOrderModal(true)
                    }}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedOrder(order)
                      setNewStatus(order.status)
                      setStatusNotes('')
                      setShowStatusModal(true)
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Update Status"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Delete Order"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {order.customer.name || 'No Name'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                  {order.shippingCost > 0 && (
                    <p className="text-xs text-gray-500">+{formatCurrency(order.shippingCost)} shipping</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} total
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Seller(s)</p>
                <div className="mt-1">
                  {(() => {
                    const uniqueSellers = Array.from(new Set(
                      order.orderItems
                        .map(item => item.product.vendor?.name)
                        .filter(Boolean)
                    ))
                    
                    if (uniqueSellers.length === 0) {
                      return <p className="text-xs text-gray-500">No seller info</p>
                    }
                    
                    if (uniqueSellers.length === 1) {
                      const seller = order.orderItems.find(item => item.product.vendor?.name === uniqueSellers[0])?.product.vendor
                      return (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{seller?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{seller?.email}</p>
                        </div>
                      )
                    }
                    
                    return (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{uniqueSellers[0]}</p>
                        <p className="text-xs text-gray-500">
                          +{uniqueSellers.length - 1} more seller{uniqueSellers.length - 1 !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-Optimized Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-2 sm:top-4 mx-auto p-4 sm:p-5 border w-11/12 max-w-4xl shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Mobile-Optimized Order Information */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Order Number:</span>
                        <p className="text-sm font-medium text-gray-900">#{selectedOrder.orderNumber}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Status:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-1">{selectedOrder.status}</span>
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Payment Method:</span>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Payment Status:</span>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.paymentStatus}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Total Amount:</span>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(selectedOrder.total)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Shipping Cost:</span>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(selectedOrder.shippingCost)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Order Date:</span>
                        <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-Optimized Customer Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Name:</span>
                        <p className="text-sm font-medium text-gray-900 break-words">{selectedOrder.customer.name || 'No Name'}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Email:</span>
                        <p className="text-sm font-medium text-gray-900 break-all">{selectedOrder.customer.email}</p>
                      </div>
                      {selectedOrder.customer.phone && (
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <span className="text-xs font-medium text-gray-500">Phone:</span>
                          <p className="text-sm font-medium text-gray-900">{selectedOrder.customer.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile-Optimized Seller Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Seller Information</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-2 break-words">{item.product.name}</div>
                          {item.product.vendor ? (
                            <div className="space-y-2 text-sm">
                              <div className="bg-white p-2 rounded">
                                <span className="text-xs font-medium text-gray-500">Seller:</span>
                                <p className="text-sm font-medium text-gray-900 break-words">{item.product.vendor.name}</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <span className="text-xs font-medium text-gray-500">Email:</span>
                                <p className="text-sm font-medium text-gray-900 break-all">{item.product.vendor.email}</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <span className="text-xs font-medium text-gray-500">Quantity:</span>
                                <p className="text-sm font-medium text-gray-900">{item.quantity}</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <span className="text-xs font-medium text-gray-500">Price:</span>
                                <p className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No seller information available</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Shipping Address */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-900 whitespace-pre-line break-words">{selectedOrder.shippingAddress}</div>
                    </div>
                  </div>

                  {/* Mobile-Optimized Order Items */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                            {item.product.images && item.product.images !== '[]' ? (
                              <img
                                src={JSON.parse(item.product.images)[0] || '/api/placeholder/48/48'}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">IMG</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 break-words">{item.product.name}</div>
                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-sm font-medium text-gray-900 flex-shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 sm:pt-6">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Optimized Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-2 sm:top-4 mx-auto p-4 sm:p-5 border w-11/12 max-w-md shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Update Order Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 touch-manipulation min-h-[44px]"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
