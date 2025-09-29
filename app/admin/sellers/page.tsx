'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Seller {
  id: string
  businessName: string
  contactPerson: string
  email: string
  phone: string
  status: 'approved' | 'pending' | 'suspended' | 'rejected'
  verificationStatus: 'verified' | 'pending' | 'rejected'
  joinDate: string
  totalProducts: number
  totalSales: number
  commissionEarned: number
  rating: number
  businessType: string
  district: string
  address?: string
  isActive: boolean
  isVerified: boolean
}

interface SellerStats {
  totalSellers: number
  approvedSellers: number
  pendingSellers: number
  suspendedSellers: number
  rejectedSellers: number
  verifiedSellers: number
  activeSellers: number
  recentRegistrations: number
}

export default function SellerManagementPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedVerification, setSelectedVerification] = useState('All Verification')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch sellers data
  const fetchSellers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedStatus !== 'All Status') params.append('status', selectedStatus)
      if (selectedVerification !== 'All Verification') params.append('verification', selectedVerification)
      
      const response = await fetch(`/api/admin/sellers?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setSellers(data.data.sellers)
      } else {
        setError(data.error || 'Failed to fetch sellers')
      }
    } catch (err) {
      setError('Failed to fetch sellers')
      console.error('Error fetching sellers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch seller statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/sellers/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data.overview)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchSellers()
    fetchStats()
  }, [searchQuery, selectedStatus, selectedVerification])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Update seller status
  const updateSellerStatus = async (sellerId: string, status: string, verificationStatus?: string) => {
    try {
      setActionLoading(sellerId)
      const response = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          status,
          verificationStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setSellers(sellers.map(seller => 
          seller.id === sellerId 
            ? { 
                ...seller, 
                status: data.data.status, 
                verificationStatus: data.data.verificationStatus,
                isActive: data.data.isActive,
                isVerified: data.data.isVerified
              } 
            : seller
        ))
        
        // Refresh stats
        fetchStats()
        
        alert('Seller status updated successfully!')
      } else {
        alert(data.error || 'Failed to update seller status')
      }
    } catch (err) {
      alert('Failed to update seller status')
      console.error('Error updating seller status:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusChange = (sellerId: string, newStatus: string) => {
    if (confirm(`Are you sure you want to change this seller's status to ${newStatus}?`)) {
      updateSellerStatus(sellerId, newStatus)
    }
  }

  const handleViewSeller = (seller: Seller) => {
    setSelectedSeller(seller)
    setShowSellerModal(true)
  }

  const handleApproveSeller = (sellerId: string) => {
    if (confirm('Are you sure you want to approve this seller?')) {
      updateSellerStatus(sellerId, 'approved', 'verified')
    }
  }

  const handleRejectSeller = (sellerId: string) => {
    if (confirm('Are you sure you want to reject this seller?')) {
      updateSellerStatus(sellerId, 'rejected', 'rejected')
    }
  }

  const handleSuspendSeller = (sellerId: string) => {
    if (confirm('Are you sure you want to suspend this seller?')) {
      updateSellerStatus(sellerId, 'suspended')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Seller Management</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage seller applications, approvals, and performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors touch-manipulation min-h-[40px]">
                Export Sellers
              </button>
              <button className="bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors touch-manipulation min-h-[40px]">
                View Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Mobile-Optimized Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Sellers</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats?.totalSellers || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Approved</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats?.approvedSellers || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats?.pendingSellers || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats?.suspendedSellers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers by business name or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation min-h-[44px]"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[40px]"
              >
                <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Filters</span>
              </button>
              
              {showFilters && (
                <button
                  onClick={() => {
                    setSelectedStatus('All Status')
                    setSelectedVerification('All Verification')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors touch-manipulation"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation min-h-[44px]"
                    >
                      <option value="All Status">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification
                    </label>
                    <select
                      value={selectedVerification}
                      onChange={(e) => setSelectedVerification(e.target.value)}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation min-h-[44px]"
                    >
                      <option value="All Verification">All Verification</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Optimized Sellers Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Sellers ({sellers.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <ArrowPathIcon className="h-12 w-12 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium">Loading sellers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Error loading sellers</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchSellers}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 touch-manipulation min-h-[40px]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Verification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sellers.map((seller) => (
                        <tr key={seller.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {seller.businessName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {seller.businessType} • {seller.district}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{seller.contactPerson}</div>
                            <div className="text-sm text-gray-500">{seller.email}</div>
                            <div className="text-sm text-gray-500">{seller.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(seller.status)}`}>
                              {seller.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(seller.verificationStatus)}`}>
                              {seller.verificationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div>{seller.totalProducts} products</div>
                              <div>{formatCurrency(seller.totalSales)} sales</div>
                              <div className="text-gray-500">Rating: {seller.rating}/5</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewSeller(seller)}
                                className={`${seller.status === 'pending' ? 'text-blue-700 hover:text-blue-900 font-semibold' : 'text-blue-600 hover:text-blue-900'} p-1 rounded-md hover:bg-blue-50 transition-colors`}
                                title={seller.status === 'pending' ? 'Preview Application & Review Details' : 'View Seller Details'}
                              >
                                <EyeIcon className="h-4 w-4" />
                                {seller.status === 'pending' && <span className="ml-1 text-xs">Review</span>}
                              </button>
                              
                              {seller.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveSeller(seller.id)}
                                    disabled={actionLoading === seller.id}
                                    className="text-green-600 hover:text-green-900 disabled:opacity-50 p-1 rounded-md hover:bg-green-50 transition-colors"
                                    title="Approve Seller"
                                  >
                                    {actionLoading === seller.id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircleIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleRejectSeller(seller.id)}
                                    disabled={actionLoading === seller.id}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1 rounded-md hover:bg-red-50 transition-colors"
                                    title="Reject Seller"
                                  >
                                    {actionLoading === seller.id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircleIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                </>
                              )}
                              
                              {seller.status === 'approved' && (
                                <button
                                  onClick={() => handleSuspendSeller(seller.id)}
                                  disabled={actionLoading === seller.id}
                                  className="text-orange-600 hover:text-orange-900 disabled:opacity-50 p-1 rounded-md hover:bg-orange-50 transition-colors"
                                  title="Suspend Seller"
                                >
                                  {actionLoading === seller.id ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              
                              <select
                                value={seller.status}
                                onChange={(e) => handleStatusChange(seller.id, e.target.value)}
                                disabled={actionLoading === seller.id}
                                className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                              >
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspend</option>
                                <option value="rejected">Reject</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {seller.businessName}
                              </h3>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(seller.status)}`}>
                                {seller.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{seller.contactPerson}</p>
                            <p className="text-xs text-gray-500 truncate">{seller.email}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getVerificationColor(seller.verificationStatus)}`}>
                                {seller.verificationStatus}
                              </span>
                              <span className="text-xs text-gray-500">
                                {seller.totalProducts} products
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatCurrency(seller.totalSales)} sales
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {seller.businessType} • {seller.district}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-3">
                          <button
                            onClick={() => handleViewSeller(seller)}
                            className={`${seller.status === 'pending' ? 'text-blue-700 hover:text-blue-900 font-semibold' : 'text-blue-600 hover:text-blue-900'} p-2 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center`}
                            title={seller.status === 'pending' ? 'Preview Application & Review Details' : 'View Seller Details'}
                          >
                            <EyeIcon className="h-4 w-4" />
                            {seller.status === 'pending' && <span className="ml-1 text-xs">Review</span>}
                          </button>
                          
                          {seller.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveSeller(seller.id)}
                                disabled={actionLoading === seller.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 p-2 hover:bg-green-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                                title="Approve Seller"
                              >
                                {actionLoading === seller.id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircleIcon className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleRejectSeller(seller.id)}
                                disabled={actionLoading === seller.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                                title="Reject Seller"
                              >
                                {actionLoading === seller.id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircleIcon className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                          
                          {seller.status === 'approved' && (
                            <button
                              onClick={() => handleSuspendSeller(seller.id)}
                              disabled={actionLoading === seller.id}
                              className="text-orange-600 hover:text-orange-900 disabled:opacity-50 p-2 hover:bg-orange-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                              title="Suspend Seller"
                            >
                              {actionLoading === seller.id ? (
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <ExclamationTriangleIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && !error && sellers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No sellers found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Optimized Seller Details Modal */}
      {showSellerModal && selectedSeller && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-2 sm:top-10 mx-auto p-4 sm:p-5 border w-11/12 max-w-4xl shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Seller Details</h3>
                  {selectedSeller.status === 'pending' && (
                    <p className="text-xs sm:text-sm text-orange-600 mt-1">
                      ⚠️ Pending Application - Review all information before approval
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowSellerModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ml-3"
                >
                  <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Application Summary for Pending Sellers */}
              {selectedSeller.status === 'pending' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-medium text-orange-800 mb-3">📋 Application Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-medium text-orange-700">Business:</span>
                      <p className="text-orange-900 break-words">{selectedSeller.businessName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Contact:</span>
                      <p className="text-orange-900 break-words">{selectedSeller.contactPerson}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Type:</span>
                      <p className="text-orange-900 break-words">{selectedSeller.businessType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Location:</span>
                      <p className="text-orange-900 break-words">{selectedSeller.district}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Email:</span>
                      <p className="text-orange-900 break-all">{selectedSeller.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Phone:</span>
                      <p className="text-orange-900 break-words">{selectedSeller.phone}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Basic Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.businessName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.contactPerson}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-all">{selectedSeller.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.businessType}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.district}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.address || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-words">{selectedSeller.joinDate}</p>
                  </div>
                </div>

                {/* Status & Performance */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">Status & Performance</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedSeller.status)}`}>
                        {selectedSeller.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getVerificationColor(selectedSeller.verificationStatus)}`}>
                        {selectedSeller.verificationStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <div className="mt-1 space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedSeller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedSeller.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${selectedSeller.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedSeller.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Products</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedSeller.totalProducts}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Sales</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{formatCurrency(selectedSeller.totalSales)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Earned</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{formatCurrency(selectedSeller.commissionEarned)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedSeller.rating}/5</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                <button
                  onClick={() => setShowSellerModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[40px]"
                >
                  Close
                </button>
                
                {selectedSeller.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveSeller(selectedSeller.id)
                        setShowSellerModal(false)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors touch-manipulation min-h-[40px]"
                    >
                      Approve Seller
                    </button>
                    <button
                      onClick={() => {
                        handleRejectSeller(selectedSeller.id)
                        setShowSellerModal(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors touch-manipulation min-h-[40px]"
                    >
                      Reject Seller
                    </button>
                  </>
                )}
                
                {selectedSeller.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleSuspendSeller(selectedSeller.id)
                      setShowSellerModal(false)
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors touch-manipulation min-h-[40px]"
                  >
                    Suspend Seller
                  </button>
                )}
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation min-h-[40px]">
                  Edit Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
