'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  UserIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'

interface SellerFinancial {
  id: string
  name: string
  email: string
  isActive: boolean
  isVerified: boolean
  joinDate: string
  totalRevenue: number
  totalCommission: number
  totalPayout: number
  orderCount: number
  productCount: number
  activeProductCount: number
  recentTransactions: Array<{
    id: string
    type: string
    amount: number
    commission: number
    date: string
    status: string
  }>
}

interface FinancialData {
  platformMetrics: {
    totalOrders: number
    totalRevenue: number
    totalRevenueBeforeVAT: number
    totalCommission: number
    sellerPayouts: number
    netPlatformRevenue: number
    totalSellers: number
    activeSellers: number
    totalProducts: number
    activeProducts: number
    pendingOrders: number
    totalCustomers: number
    totalRefunds: number
    refundAmount: number
    averageOrderValue: number
    averageOrderValueBeforeVAT: number
    averageSellerRevenue: number
    commissionRate: number
    vatRate: number
    sellerPayoutRate: number
  }
  monthlySales: Array<{
    month: string
    revenue: number
    revenueBeforeVAT: number
    orders: number
    commission: number
    sellerPayouts: number
    vatAmount: number
  }>
  sellers: SellerFinancial[]
  recentTransactions: Array<{
    id: string
    type: string
    customer: string
    totalAmount: number
    totalAmountBeforeVAT: number
    commission: number
    sellerPayout: number
    vatAmount: number
    date: string
    status: string
    items: Array<{
      productName: string
      quantity: number
      price: number
      priceBeforeVAT: number
      sellerName: string
      sellerBusinessName: string
    }>
  }>
  topSellers: SellerFinancial[]
}

export default function SellerFinancialsPage() {
  const [admin, setAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const router = useRouter()

  const fetchFinancialData = async () => {
    try {
      setDataLoading(true)
      const response = await fetch('/api/admin/financials')
      const data = await response.json()
      console.log('Admin financials API response:', data)
      
      if (data.success) {
        setFinancialData(data.data)
        console.log('Admin financials data set:', data.data)
        console.log('Sellers data:', data.data.sellers)
      } else {
        console.error('Failed to fetch financial data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    // Check if admin is logged in via secure cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setAdmin(data.admin)
          fetchFinancialData()
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial data...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-0 sm:h-16 space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <Link href="/admin/dashboard" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors touch-manipulation">
                ← Back to Dashboard
              </Link>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Seller Financial Statements</h1>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-medium">{admin?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors touch-manipulation min-h-[36px] px-2 py-1 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading financial data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Platform Financial Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Platform Financial Overview</h2>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Real-time Data
                </div>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl mx-auto mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-900 break-words">
                    {formatCurrency(financialData?.platformMetrics?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (Inc. VAT: {formatCurrency(financialData?.platformMetrics?.totalRevenue || 0)})
                  </p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl mx-auto mb-2">
                    <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Platform Commission</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-900 break-words">
                    {formatCurrency(financialData?.platformMetrics?.totalCommission || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({((financialData?.platformMetrics?.commissionRate || 0) * 100).toFixed(1)}% rate)
                  </p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl mx-auto mb-2">
                    <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-900">
                    {(financialData?.platformMetrics?.totalOrders || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg: {formatCurrency(financialData?.platformMetrics?.averageOrderValue || 0)}
                  </p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl mx-auto mb-2">
                    <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Products</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-900">
                    {(financialData?.platformMetrics?.totalProducts || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(financialData?.platformMetrics?.activeProducts || 0).toLocaleString()} active
                  </p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">Active Sellers</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(financialData?.platformMetrics?.activeSellers || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    / {(financialData?.platformMetrics?.totalSellers || 0).toLocaleString()} total
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">Customers</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(financialData?.platformMetrics?.totalCustomers || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">Pending Orders</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(financialData?.platformMetrics?.pendingOrders || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">Refunds</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(financialData?.platformMetrics?.refundAmount || 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(financialData?.platformMetrics?.totalRefunds || 0)} processed
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Sellers Financial Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Seller Financial Statements</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Detailed financial breakdown for each seller</p>
              </div>
              
              <div className="space-y-0">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commission
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payout
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Products
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialData?.sellers?.map((seller) => (
                          <tr key={seller.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {seller.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {seller.isVerified && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Verified
                                  </span>
                                )}
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
                              {seller.orderCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div>{seller.activeProductCount.toLocaleString()} active</div>
                                <div className="text-xs text-gray-500">{seller.productCount.toLocaleString()} total</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedSeller(selectedSeller === seller.id ? null : seller.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                              >
                                {selectedSeller === seller.id ? 'Hide Details' : 'View Details'}
                              </button>
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
                    {financialData?.sellers?.map((seller) => (
                      <div key={seller.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-medium">
                                {seller.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {seller.name}
                                </h3>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {seller.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {seller.isVerified && (
                                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">{seller.email}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-xs text-gray-500">Revenue</p>
                                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(seller.totalRevenue)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Commission</p>
                                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(seller.totalCommission)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Payout</p>
                                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(seller.totalPayout)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Orders</p>
                                  <p className="text-sm font-semibold text-gray-900">{seller.orderCount.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Products</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {seller.activeProductCount.toLocaleString()} active / {seller.productCount.toLocaleString()} total
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-3">
                            <button
                              onClick={() => setSelectedSeller(selectedSeller === seller.id ? null : seller.id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Recent Transactions */}
            {financialData?.recentTransactions && financialData.recentTransactions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Platform Transactions</h3>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Last 20 orders
                  </div>
                </div>
                
                <div className="space-y-0">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Seller
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Before VAT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Commission
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Seller Payout
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              VAT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {financialData.recentTransactions.slice(0, 10).map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(transaction.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.customer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <p className="font-medium">{transaction.items[0]?.sellerBusinessName || 'Unknown Business'}</p>
                                  <p className="text-xs text-gray-500">{transaction.items[0]?.productName}</p>
                                  {transaction.items.length > 1 && (
                                    <p className="text-xs text-gray-400">+{transaction.items.length - 1} more item{transaction.items.length > 2 ? 's' : ''}</p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {formatCurrency(transaction.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(transaction.totalAmountBeforeVAT)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                {formatCurrency(transaction.commission)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                                {formatCurrency(transaction.sellerPayout)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatCurrency(transaction.vatAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden">
                    <div className="space-y-3">
                      {financialData.recentTransactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                  Order #{transaction.id.slice(-8)}
                                </h4>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">{transaction.customer}</p>
                              {transaction.items.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-600 font-medium">
                                    Seller: {transaction.items[0].sellerBusinessName}
                                  </p>
                                  {transaction.items.length > 1 && (
                                    <p className="text-xs text-gray-500">
                                      +{transaction.items.length - 1} more seller{transaction.items.length > 2 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <p className="text-xs text-gray-500">Total Amount</p>
                              <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.totalAmount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Before VAT</p>
                              <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.totalAmountBeforeVAT)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Commission</p>
                              <p className="text-sm font-semibold text-green-600">{formatCurrency(transaction.commission)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Seller Payout</p>
                              <p className="text-sm font-semibold text-blue-600">{formatCurrency(transaction.sellerPayout)}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">VAT Amount</p>
                            <p className="text-sm font-semibold text-gray-600">{formatCurrency(transaction.vatAmount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
