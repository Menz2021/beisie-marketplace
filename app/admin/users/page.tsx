'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  isVerified: boolean
  isActive: boolean
  language: string
  createdAt: string
  updatedAt: string
  _count: {
    products: number
    orders: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
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
          fetchUsers() // Fetch users when admin is logged in
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

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [searchTerm, roleFilter, statusFilter])

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'verify' | 'unverify') => {
    try {
      // In a real app, you would call the appropriate API
      toast.success(`User ${action} successful`)
      fetchUsers()
    } catch (error) {
      console.error(`Error ${action} user:`, error)
      toast.error(`Failed to ${action} user`)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'SELLER': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (!isVerified) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive'
    if (!isVerified) return 'Unverified'
    return 'Active'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-3 sm:mr-4 touch-manipulation min-h-[36px] px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Back</span>
              </button>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors touch-manipulation min-h-[32px] sm:min-h-[36px]"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-Optimized Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
                />
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-3 sm:top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customers</option>
                <option value="SELLER">Sellers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm touch-manipulation min-h-[44px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('')
                  setStatusFilter('')
                }}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm touch-manipulation min-h-[44px] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Users Display */}
        <div className="space-y-3 sm:space-y-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive, user.isVerified)}`}>
                          {getStatusText(user.isActive, user.isVerified)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user._count.products}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user._count.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {user.role !== 'ADMIN' && (
                            <>
                              {user.isActive ? (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'deactivate')}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                  title="Deactivate User"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                                  title="Activate User"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                              )}
                              
                              {!user.isVerified && (
                                <button
                                  onClick={() => handleUserAction(user.id, 'verify')}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                  title="Verify User"
                                >
                                  <ShieldCheckIcon className="h-4 w-4" />
                                </button>
                              )}
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
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || 'No Name'}
                        </h3>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-gray-400 truncate">{user.phone}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(user.isActive, user.isVerified)}`}>
                          {getStatusText(user.isActive, user.isVerified)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user._count.products} products
                        </span>
                        <span className="text-xs text-gray-500">
                          {user._count.orders} orders
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUserModal(true)
                      }}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    
                    {user.role !== 'ADMIN' && (
                      <>
                        {user.isActive ? (
                          <button 
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Deactivate User"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Activate User"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {!user.isVerified && (
                          <button
                            onClick={() => handleUserAction(user.id, 'verify')}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Verify User"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
      </div>

      {/* Mobile-Optimized User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-2 sm:top-4 mx-auto p-4 sm:p-5 border w-11/12 max-w-2xl shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedUser.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg break-all">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.isActive, selectedUser.isVerified)}`}>
                        {getStatusText(selectedUser.isActive, selectedUser.isVerified)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedUser.language}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedUser._count.products}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orders</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedUser._count.orders}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 sm:pt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[40px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
