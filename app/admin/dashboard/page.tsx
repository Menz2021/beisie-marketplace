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
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  DocumentTextIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

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
  userGrowthPercentage: number
  sellerGrowthPercentage: number
  productGrowthPercentage: number
  orderGrowthPercentage: number
  revenueGrowthPercentage: number
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
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
          fetchStats() // Fetch real stats when admin is logged in
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
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-8">
              <h1 className="text-base sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 transition-colors">Users</Link>
                <Link href="/admin/sellers" className="text-gray-600 hover:text-gray-900 transition-colors">Sellers</Link>
                <Link href="/admin/sellers/financials" className="text-gray-600 hover:text-gray-900 transition-colors">Financials</Link>
                <Link href="/admin/products" className="text-gray-600 hover:text-gray-900 transition-colors">Products</Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900 transition-colors">Orders</Link>
                <Link href="/admin/refunds" className="text-gray-600 hover:text-gray-900 transition-colors">Refunds</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs sm:text-sm font-medium">{admin?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-xs sm:text-base px-2 py-1.5 sm:px-3 sm:py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[32px] sm:min-h-[36px]"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden pb-3">
            <nav className="flex flex-wrap gap-1.5 sm:gap-2">
              <Link href="/admin/users" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Users</Link>
              <Link href="/admin/sellers" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Sellers</Link>
              <Link href="/admin/sellers/financials" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Financials</Link>
              <Link href="/admin/products" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Products</Link>
              <Link href="/admin/orders" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Orders</Link>
              <Link href="/admin/refunds" className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[36px] flex items-center justify-center">Refunds</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 truncate">Total Users</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mt-0.5">
                    {statsLoading ? '...' : (stats?.totalUsers || 0).toLocaleString()}
                  </p>
                  <div className={`text-xs flex items-center mt-1 ${
                    (stats?.userGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.userGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{Math.abs(stats?.userGrowthPercentage || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 truncate">Active Sellers</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mt-0.5">
                    {statsLoading ? '...' : (stats?.totalSellers || 0).toLocaleString()}
                  </p>
                  <div className={`text-xs flex items-center mt-1 ${
                    (stats?.sellerGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.sellerGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{Math.abs(stats?.sellerGrowthPercentage || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 truncate">Total Products</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mt-0.5">
                    {statsLoading ? '...' : (stats?.totalProducts || 0).toLocaleString()}
                  </p>
                  <div className={`text-xs flex items-center mt-1 ${
                    (stats?.productGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.productGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{Math.abs(stats?.productGrowthPercentage || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 truncate">Total Orders</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mt-0.5">
                    {statsLoading ? '...' : (stats?.totalOrders || 0).toLocaleString()}
                  </p>
                  <div className={`text-xs flex items-center mt-1 ${
                    (stats?.orderGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.orderGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{Math.abs(stats?.orderGrowthPercentage || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue and Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <div className={`text-xs sm:text-sm flex items-center mt-2 ${
                    (stats?.revenueGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.revenueGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{Math.abs(stats?.revenueGrowthPercentage || 0)}% from last month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-sm border border-yellow-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Commission Earned</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : formatCurrency(stats?.commissionEarned || 0)}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    Platform commission from sales
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-sm border border-yellow-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : (stats?.pendingApprovals || 0).toLocaleString()}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    Seller & product approvals
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm border border-red-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Refunds</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : (stats?.pendingRefunds || 0).toLocaleString()}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    Refund requests to process
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Disputes</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? '...' : (stats?.activeDisputes || 0).toLocaleString()}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    Customer disputes to resolve
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity</h3>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Last 5 activities
                </div>
              </div>
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}