'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  CalendarIcon,
  BanknotesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// Real data interface
interface DashboardStats {
  totalUsers: number
  totalSellers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingRefunds: number
  activeDisputes: number
  commissionEarned: number
  pendingApprovals: number
  topSellers: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    commission: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    status: string
  }>
  salesData: Array<{
    month: string
    sales: number
    orders: number
  }>
  // Percentage changes
  userGrowthPercentage: number
  sellerGrowthPercentage: number
  productGrowthPercentage: number
  orderGrowthPercentage: number
  revenueGrowthPercentage: number
}

// Refund data interface
interface RefundData {
  id: string
  orderId: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
  }
  amount: number
  reason: string
  type: 'FULL' | 'PARTIAL'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED'
  createdAt: string
  updatedAt?: string
  adminNotes?: string
  order: {
    id: string
    totalAmount: number
    items: Array<{
      id: string
      product: {
        id: string
        name: string
        image?: string
      }
      quantity: number
      price: number
    }>
    seller: {
      id: string
      name: string
      email: string
    }
  }
  attachments?: Array<{
    id: string
    url: string
    type: string
    name: string
  }>
}



// API functions for refund management
const fetchRefunds = async (): Promise<RefundData[]> => {
  try {
    const response = await fetch('/api/admin/refunds')
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      console.error('Failed to fetch refunds:', data.error)
      return []
    }
  } catch (error) {
    console.error('Error fetching refunds:', error)
    return []
  }
}

const updateRefundStatus = async (refundId: string, status: string, adminNotes?: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/refunds/${refundId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        adminNotes
      })
    })
    
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error updating refund status:', error)
    return false
  }
}

// Refund Management Component
function RefundManagement() {
  const [refunds, setRefunds] = useState<RefundData[]>([])
  const [selectedRefund, setSelectedRefund] = useState<RefundData | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRefunds, setTotalRefunds] = useState(0)

  // Fetch refunds on component mount
  useEffect(() => {
    const loadRefunds = async () => {
      setLoading(true)
      setError(null)
      try {
        const refundsData = await fetchRefunds()
        setRefunds(refundsData)
        setTotalRefunds(refundsData.length)
        setTotalPages(Math.ceil(refundsData.length / 10)) // 10 items per page
      } catch (err) {
        setError('Failed to load refunds. Please try again.')
        console.error('Error loading refunds:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRefunds()
  }, [])

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
    setError(null)
    setSuccess(null)
    
    try {
      const successResult = await updateRefundStatus(refundId, newStatus, adminNotes)
      
      if (successResult) {
        // Update local state
        setRefunds(prev => prev.map(refund => 
          refund.id === refundId 
            ? { ...refund, status: newStatus as any, adminNotes, updatedAt: new Date().toISOString() }
            : refund
        ))
        setShowModal(false)
        setAdminNotes('')
        setSelectedRefund(null)
        setSuccess(`Refund ${newStatus.toLowerCase()} successfully!`)
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to update refund status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating refund status:', error)
      setError('An error occurred while updating the refund status.')
    } finally {
      setUpdating(false)
    }
  }

  const filteredRefunds = refunds.filter(refund => {
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter
    const matchesSearch = refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.reason.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Pagination logic
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRefunds = filteredRefunds.slice(startIndex, endIndex)
  const totalFilteredPages = Math.ceil(filteredRefunds.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const refreshRefunds = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const refundsData = await fetchRefunds()
      setRefunds(refundsData)
      setTotalRefunds(refundsData.length)
      setTotalPages(Math.ceil(refundsData.length / itemsPerPage))
      setCurrentPage(1) // Reset to first page
    } catch (err) {
      setError('Failed to refresh refunds. Please try again.')
      console.error('Error refreshing refunds:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Refund Management</h2>
          <p className="text-gray-600">
            Manage customer refund requests and disputes
            {totalRefunds > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({totalRefunds} total refunds)
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={refreshRefunds}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PROCESSED">Processed</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading refunds...</p>
                  </td>
                </tr>
              ) : paginatedRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">No refunds found</p>
                      <p className="text-sm">
                        {filteredRefunds.length === 0 && refunds.length > 0
                          ? 'Try adjusting your search or filter criteria'
                          : 'No refund requests have been submitted yet'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{refund.orderId}</div>
                      <div className="text-sm text-gray-500">{refund.order.items[0]?.product.name}</div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalFilteredPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalFilteredPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{startIndex + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredRefunds.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredRefunds.length}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ArrowUpIcon className="h-5 w-5 transform rotate-[-90deg]" />
                </button>
                
                {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalFilteredPages - 4, currentPage - 2)) + i
                  if (pageNum > totalFilteredPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ArrowUpIcon className="h-5 w-5 transform rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Refund Details Modal */}
      {showModal && selectedRefund && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Refund Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-sm text-gray-900">{selectedRefund.orderId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Refund Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedRefund.amount)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">{selectedRefund.customer.name} ({selectedRefund.customer.email})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedRefund.reason}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Add notes about this refund decision..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setAdminNotes('')
                    setSelectedRefund(null)
                  }}
                  disabled={updating}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                {selectedRefund.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedRefund.id, 'APPROVED')}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Processing...' : 'Approve Refund'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedRefund.id, 'REJECTED')}
                      disabled={updating}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Processing...' : 'Reject Refund'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [financialData, setFinancialData] = useState<any>(null)
  const [financialLoading, setFinancialLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const router = useRouter()

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        console.error('Failed to fetch stats:', data.error)
        // Fallback to empty data if API fails
        setStats({
          totalUsers: 0,
          totalSellers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingRefunds: 0,
          activeDisputes: 0,
          commissionEarned: 0,
          pendingApprovals: 0,
          topSellers: [],
          recentActivity: [],
          salesData: [],
          userGrowthPercentage: 0,
          sellerGrowthPercentage: 0,
          productGrowthPercentage: 0,
          orderGrowthPercentage: 0,
          revenueGrowthPercentage: 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to empty data if API fails
      setStats({
        totalUsers: 0,
        totalSellers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingRefunds: 0,
        activeDisputes: 0,
        commissionEarned: 0,
        pendingApprovals: 0,
        topSellers: [],
        recentActivity: [],
        salesData: [],
        userGrowthPercentage: 0,
        sellerGrowthPercentage: 0,
        productGrowthPercentage: 0,
        orderGrowthPercentage: 0,
        revenueGrowthPercentage: 0
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchFinancialData = async (period: string = 'all') => {
    try {
      setFinancialLoading(true)
      const response = await fetch(`/api/admin/financials?period=${period}`)
      const data = await response.json()
      
      if (data.success) {
        setFinancialData(data.data)
        console.log('Financial data loaded:', data.data) // Debug log
      } else {
        console.error('Failed to fetch financial data:', data.error)
        // Keep null as fallback
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
      // Keep null as fallback
    } finally {
      setFinancialLoading(false)
    }
  }

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin_session')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
      fetchStats() // Fetch real stats when admin is logged in
    } else {
      // Redirect to admin login if not logged in
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('admin_session')
    // Redirect to admin login
    router.push('/admin/login')
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
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'info': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-4 w-4" />
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'error': return <XCircleIcon className="h-4 w-4" />
      case 'info': return <EyeIcon className="h-4 w-4" />
      default: return <EyeIcon className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 ml-3">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-medium">{admin?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Floating Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-between h-16 bg-red-600 px-4">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-white hover:bg-white/20 transition-all duration-200 lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col h-full overflow-hidden">
          <nav className="mt-8 flex-1 overflow-y-auto">
            <div className="px-4 space-y-2 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'overview' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ChartBarIcon className="mr-3 h-5 w-5" />
              Overview
            </button>
            
            <Link
              href="/admin/users"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'users' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Users
            </Link>
            
            <Link
              href="/admin/sellers"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'sellers' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Sellers
            </Link>
            
            <Link
              href="/admin/products"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'products' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShoppingBagIcon className="mr-3 h-5 w-5" />
              Products
            </Link>
            
            <Link
              href="/admin/orders"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'orders' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <DocumentTextIcon className="mr-3 h-5 w-5" />
              Orders
            </Link>
            
            <Link
              href="/admin/refunds"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'refunds' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ExclamationTriangleIcon className="mr-3 h-5 w-5" />
              Refunds
            </Link>
            
            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'financials' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BanknotesIcon className="mr-3 h-5 w-5" />
              Financials
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <CogIcon className="mr-3 h-5 w-5" />
              Settings
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:bg-white lg:shadow-lg lg:flex-col">
        <div className="flex items-center justify-center h-16 bg-red-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className="mt-8 flex-1">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'overview' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ChartBarIcon className="mr-3 h-5 w-5" />
              Overview
            </button>
            
            <Link
              href="/admin/users"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'users' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Users
            </Link>
            
            <Link
              href="/admin/sellers"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'sellers' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Sellers
            </Link>
            
            <Link
              href="/admin/products"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'products' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShoppingBagIcon className="mr-3 h-5 w-5" />
              Products
            </Link>
            
            <Link
              href="/admin/orders"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'orders' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <DocumentTextIcon className="mr-3 h-5 w-5" />
              Orders
            </Link>
            
            <Link
              href="/admin/refunds"
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'refunds' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ExclamationTriangleIcon className="mr-3 h-5 w-5" />
              Refunds
            </Link>
            
            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'financials' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BanknotesIcon className="mr-3 h-5 w-5" />
              Financials
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <CogIcon className="mr-3 h-5 w-5" />
              Settings
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : (stats?.totalUsers || 0).toLocaleString()}
                      </p>
                      <p className={`text-sm flex items-center ${
                        (stats?.userGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats?.userGrowthPercentage || 0) >= 0 ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stats?.userGrowthPercentage || 0)}% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Sellers</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : (stats?.totalSellers || 0).toLocaleString()}
                      </p>
                      <p className={`text-sm flex items-center ${
                        (stats?.sellerGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats?.sellerGrowthPercentage || 0) >= 0 ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stats?.sellerGrowthPercentage || 0)}% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
                      </p>
                      <p className={`text-sm flex items-center ${
                        (stats?.revenueGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats?.revenueGrowthPercentage || 0) >= 0 ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stats?.revenueGrowthPercentage || 0)}% from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Seller Applications</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {statsLoading ? '...' : (stats?.pendingApprovals || 0)}
                        </p>
                        <p className="text-sm text-orange-600 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Awaiting review
                        </p>
                      </div>
                    </div>
                    <Link 
                      href="/admin/sellers"
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      Review Applications
                    </Link>
                  </div>
                </div>
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                  <div className="space-y-4">
                    {statsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading sales data...</p>
                      </div>
                    ) : (
                      stats?.salesData?.map((data, index) => {
                        const maxSales = Math.max(...(stats.salesData?.map(d => d.sales) || [1]))
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{data.month}</span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(data.sales / maxSales) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-20 text-right">
                                {formatCurrency(data.sales)}
                              </span>
                            </div>
                          </div>
                        )
                      }) || []
                    )}
                  </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sellers</h3>
                  <div className="space-y-4">
                    {statsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading top sellers...</p>
                      </div>
                    ) : (
                      stats?.topSellers?.map((seller, index) => (
                        <div key={seller.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                              <p className="text-xs text-gray-500">{seller.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(seller.revenue)}</p>
                            <p className="text-xs text-gray-500">Commission: {formatCurrency(seller.commission)}</p>
                          </div>
                        </div>
                      )) || []
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {statsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading recent activity...</p>
                    </div>
                  ) : (
                    stats?.recentActivity?.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    )) || []
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Financials Tab */}
          {activeTab === 'financials' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Account Statements</h2>
                <div className="flex space-x-2">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => {
                      setSelectedPeriod(e.target.value)
                      fetchFinancialData(e.target.value)
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button 
                    onClick={() => {
                      // Generate and download financial report
                      const reportData = {
                        period: selectedPeriod === 'all' ? 'All Time' : selectedPeriod,
                        platformMetrics: financialData?.platformMetrics,
                        monthlySales: financialData?.monthlySales,
                        sellerFinancials: financialData?.sellerFinancials,
                        recentTransactions: financialData?.recentTransactions,
                        generatedAt: new Date().toISOString()
                      }
                      const dataStr = JSON.stringify(reportData, null, 2)
                      const dataBlob = new Blob([dataStr], {type: 'application/json'})
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `admin-financial-report-${new Date().toISOString().split('T')[0]}.json`
                      link.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Platform Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {financialLoading ? '...' : formatCurrency(financialData?.platformMetrics?.totalRevenue || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">All time</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Platform Earnings</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {financialLoading ? '...' : formatCurrency(financialData?.platformMetrics?.totalCommission || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">10% commission</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BanknotesIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Seller Payouts</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {financialLoading ? '...' : formatCurrency(financialData?.platformMetrics?.sellerPayouts || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">90% to sellers</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Sellers</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {financialLoading ? '...' : (financialData?.platformMetrics?.activeSellers || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">of {financialData?.platformMetrics?.totalSellers || 0} total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Platform Metrics */}
              {financialData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(financialData.platformMetrics?.averageOrderValue || 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Per order</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UsersIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg Seller Revenue</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(financialData.platformMetrics?.averageSellerRevenue || 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Per seller</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Commission Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">10%</p>
                        <p className="text-xs text-gray-400 mt-1">Platform fee</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Sales Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Overview (Last 12 Months)</h3>
                <div className="space-y-4">
                  {financialLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading sales data...</p>
                    </div>
                  ) : (
                    financialData?.monthlySales?.map((data: any, index: number) => {
                      const maxRevenue = Math.max(...(financialData.monthlySales?.map((d: any) => d.revenue) || [1]))
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 w-20">{data.month}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-red-600 h-3 rounded-full" 
                                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-right w-40">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(data.revenue)}</p>
                            <p className="text-xs text-gray-500">{data.orders} orders</p>
                          </div>
                        </div>
                      )
                    }) || []
                  )}
                </div>
              </div>

              {/* Seller Financial Statements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Financial Statements</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financialLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading seller data...</p>
                          </td>
                        </tr>
                      ) : (
                        financialData?.sellerFinancials?.map((seller: any) => (
                          <tr key={seller.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                      {seller.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                                  <div className="text-sm text-gray-500">{seller.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(seller.totalRevenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(seller.totalCommission)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(seller.totalPayout)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {seller.orderCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {seller.activeProductCount}/{seller.productCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                seller.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {seller.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        )) || []
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Platform Transactions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Transactions</h3>
                <div className="space-y-4">
                  {financialLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading transactions...</p>
                    </div>
                  ) : (
                    financialData?.recentTransactions?.slice(0, 10).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-medium text-gray-600">#{transaction.id.slice(-4)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(transaction.totalAmount)}</p>
                          <p className="text-xs text-green-600">Commission: {formatCurrency(transaction.commission)}</p>
                          <p className="text-xs text-blue-600">Seller: {formatCurrency(transaction.sellerPayout)}</p>
                        </div>
                      </div>
                    )) || []
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Settings</h2>
                
                <div className="space-y-6">
                  {/* General Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Site Name</label>
                          <p className="text-sm text-gray-500">The name displayed on your marketplace</p>
                        </div>
                        <input
                          type="text"
                          defaultValue="Beisie Marketplace"
                          className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Site Description</label>
                          <p className="text-sm text-gray-500">Brief description of your marketplace</p>
                        </div>
                        <textarea
                          defaultValue="Your Ultimate Marketplace"
                          rows={3}
                          className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Commission Rate</label>
                          <p className="text-sm text-gray-500">Percentage taken from each sale</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue="15"
                            min="0"
                            max="50"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                          <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                          <p className="text-sm text-gray-500">Receive SMS alerts for critical events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                          Enable 2FA
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Change Password</label>
                          <p className="text-sm text-gray-500">Update your admin password</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                      </button>
                      <button className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refunds & Disputes Tab */}
          {activeTab === 'refunds' && (
            <RefundManagement />
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'refunds' && activeTab !== 'financials' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-500">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</p>
                <p className="text-sm">This section is under development</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}