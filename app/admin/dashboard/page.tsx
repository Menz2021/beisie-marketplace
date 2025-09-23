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
      {/* Mobile-Friendly Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">Users</Link>
                <Link href="/admin/sellers" className="text-gray-600 hover:text-gray-900">Sellers</Link>
                <Link href="/admin/sellers/financials" className="text-gray-600 hover:text-gray-900">Financials</Link>
                <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
                <Link href="/admin/refunds" className="text-gray-600 hover:text-gray-900">Refunds</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-medium">{admin?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <nav className="flex flex-wrap gap-2">
              <Link href="/admin/users" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Users</Link>
              <Link href="/admin/sellers" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Sellers</Link>
              <Link href="/admin/sellers/financials" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Financials</Link>
              <Link href="/admin/products" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Products</Link>
              <Link href="/admin/orders" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Orders</Link>
              <Link href="/admin/refunds" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">Refunds</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        <div className="space-y-4 sm:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.totalUsers || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs sm:text-sm flex items-center ${
                    (stats?.userGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.userGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{Math.abs(stats?.userGrowthPercentage || 0)}% from last month</span>
                    <span className="sm:hidden">{Math.abs(stats?.userGrowthPercentage || 0)}%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Active Sellers</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.totalSellers || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs sm:text-sm flex items-center ${
                    (stats?.sellerGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.sellerGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{Math.abs(stats?.sellerGrowthPercentage || 0)}% from last month</span>
                    <span className="sm:hidden">{Math.abs(stats?.sellerGrowthPercentage || 0)}%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.totalProducts || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs sm:text-sm flex items-center ${
                    (stats?.productGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.productGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{Math.abs(stats?.productGrowthPercentage || 0)}% from last month</span>
                    <span className="sm:hidden">{Math.abs(stats?.productGrowthPercentage || 0)}%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.totalOrders || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs sm:text-sm flex items-center ${
                    (stats?.orderGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.orderGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{Math.abs(stats?.orderGrowthPercentage || 0)}% from last month</span>
                    <span className="sm:hidden">{Math.abs(stats?.orderGrowthPercentage || 0)}%</span>
                  </p>
                </div>
              </div>
            </div>
              </div>

          {/* Revenue and Commission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <p className={`text-xs sm:text-sm flex items-center ${
                    (stats?.revenueGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stats?.revenueGrowthPercentage || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{Math.abs(stats?.revenueGrowthPercentage || 0)}% from last month</span>
                    <span className="sm:hidden">{Math.abs(stats?.revenueGrowthPercentage || 0)}%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Commission Earned</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : formatCurrency(stats?.commissionEarned || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Approvals</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.pendingApprovals || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Refunds</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.pendingRefunds || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Active Disputes</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {statsLoading ? '...' : (stats?.activeDisputes || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-2 sm:space-y-3">
                {stats.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <p className="text-xs sm:text-sm text-gray-600 flex-1">{activity.message}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{activity.timestamp}</p>
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