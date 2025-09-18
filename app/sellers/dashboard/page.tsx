'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface SellerStats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export default function SellerDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is a seller
    const userData = localStorage.getItem('user_session')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== 'SELLER') {
      router.push('/')
      return
    }

    // Mock data for now - in real app, fetch from API
    setStats({
      totalProducts: 12,
      activeProducts: 10,
      totalOrders: 45,
      totalRevenue: 2500000,
      pendingOrders: 3,
      completedOrders: 42
    })
    setLoading(false)
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  {stats.activeProducts} active
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  {stats.pendingOrders} pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  +12% this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedOrders}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  93% completion rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <PlusIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Add New Product</span>
                </div>
                <ArrowUpIcon className="h-4 w-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <EyeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">View All Products</span>
                </div>
                <ArrowUpIcon className="h-4 w-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Manage Orders</span>
                </div>
                <ArrowUpIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Product approved</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment received</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm text-gray-500">Order Fulfillment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <div className="text-sm text-gray-500">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
