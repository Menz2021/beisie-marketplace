'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface Refund {
  id: string
  orderId: string
  amount: number
  reason: string
  type: string
  status: string
  createdAt: string
  order: {
    totalAmount: number
    orderItems: Array<{
      product: {
        name: string
      }
    }>
  }
  customer: {
    name: string
    email: string
  }
}

export default function RefundManagementPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRefunds, setTotalRefunds] = useState(0)
  const [dateFilter, setDateFilter] = useState('all')
  const [sellerFilter, setSellerFilter] = useState('all')
  const [sellers, setSellers] = useState<Array<{id: string, name: string}>>([])
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
          fetchRefunds()
        } else {
          // Redirect to admin login if not logged in
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const fetchRefunds = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      if (dateFilter !== 'all') params.append('date', dateFilter)
      if (sellerFilter !== 'all') params.append('seller', sellerFilter)
      params.append('page', currentPage.toString())
      
      const response = await fetch(`/api/admin/refunds?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setRefunds(data.data)
        setTotalPages(data.totalPages || 1)
        setTotalRefunds(data.totalCount || 0)
        
        // Extract unique sellers for filter
        const uniqueSellers = Array.from(
          new Set(
            data.data
              .map((refund: any) => refund.order?.seller)
              .filter(Boolean)
              .map((seller: any) => ({ id: seller.id, name: seller.name }))
          )
        ) as Array<{id: string, name: string}>
        setSellers(uniqueSellers)
      } else {
        console.error('Failed to fetch refunds:', data.error)
        setRefunds([])
      }
    } catch (error) {
      console.error('Error fetching refunds:', error)
      setRefunds([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'PROCESSED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusUpdate = async (refundId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/refunds/${refundId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Update local state with the updated refund
        setRefunds(prev => prev.map(refund => 
          refund.id === refundId 
            ? { ...refund, status: newStatus, adminNotes }
            : refund
        ))
        setShowModal(false)
        setAdminNotes('')
        
        // Show success message
        alert(`Refund ${newStatus.toLowerCase()} successfully!`)
        
        // Refresh the refunds list
        fetchRefunds()
      } else {
        console.error('Failed to update refund status:', result.error)
        alert('Failed to update refund status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating refund status:', error)
      alert('Error updating refund status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const filteredRefunds = refunds.filter(refund => {
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter
    const matchesSearch = refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.reason.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading refunds...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        {/* Mobile-Optimized Header */}
        <div className="py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
              >
                <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Refund Management</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage customer refund requests and disputes</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors touch-manipulation min-h-[36px] text-sm sm:text-base">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[44px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[44px]"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PROCESSED">Processed</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[44px]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <select
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[44px]"
              >
                <option value="all">All Sellers</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.name}>{seller.name}</option>
                ))}
              </select>
            </div>
              
            <div>
              <button 
                onClick={() => {
                  setStatusFilter('all')
                  setDateFilter('all')
                  setSellerFilter('all')
                  setSearchTerm('')
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Refunds Display - Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{refund.orderId}</div>
                        <div className="text-sm text-gray-500">{refund.order.orderItems[0]?.product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{refund.customer.name}</div>
                        <div className="text-sm text-gray-500">{refund.customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(refund.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {refund.type} refund
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {refund.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRefund(refund)
                            setShowModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {refund.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(refund.id, 'APPROVED')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(refund.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
          {filteredRefunds.map((refund) => (
            <div key={refund.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {refund.orderId}
                    </h3>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                      {refund.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{refund.order.orderItems[0]?.product.name}</p>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => {
                      setSelectedRefund(refund)
                      setShowModal(true)
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  {refund.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(refund.id, 'APPROVED')}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Approve Refund"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(refund.id, 'REJECTED')}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Reject Refund"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {refund.customer.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{refund.customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(refund.amount)}</p>
                  <p className="text-xs text-gray-500">{refund.type} refund</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(refund.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                    {refund.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="text-sm text-gray-900 break-words mt-1">
                  {refund.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, totalRefunds)}</span> of{' '}
                    <span className="font-medium">{totalRefunds}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (pageNum > totalPages) return null
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? 'z-10 bg-red-50 border-red-500 text-red-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-Optimized Refund Details Modal */}
        {showModal && selectedRefund && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-2 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Refund Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Order ID</label>
                      <p className="text-sm font-medium text-gray-900 break-all">{selectedRefund.orderId}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Refund Amount</label>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(selectedRefund.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
                    <p className="text-sm font-medium text-gray-900 break-words">{selectedRefund.customer.name}</p>
                    <p className="text-sm text-gray-600 break-all">{selectedRefund.customer.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Reason</label>
                    <p className="text-sm text-gray-900 break-words">{selectedRefund.reason}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[80px]"
                      placeholder="Add notes about this refund decision..."
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] text-sm"
                  >
                    Cancel
                  </button>
                  {selectedRefund.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedRefund.id, 'APPROVED')}
                        className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-manipulation min-h-[44px] text-sm"
                      >
                        Approve Refund
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedRefund.id, 'REJECTED')}
                        className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-manipulation min-h-[44px] text-sm"
                      >
                        Reject Refund
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}