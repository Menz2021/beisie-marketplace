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
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin_session')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    
    fetchUsers()
  }, [router])

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('admin_session')
    // Redirect to admin login
    router.push('/admin/login')
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
        {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
            </div>
          </div>
        </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
              <input
                type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
                  </label>
                  <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear Filters
              </button>
              </div>
            </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {user.role !== 'ADMIN' && (
                          <>
                            {user.isActive ? (
                              <button 
                                onClick={() => handleUserAction(user.id, 'deactivate')}
                                className="text-red-600 hover:text-red-900"
                                title="Deactivate User"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="text-green-600 hover:text-green-900"
                                title="Activate User"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                            )}
                            
                            {!user.isVerified && (
                        <button
                                onClick={() => handleUserAction(user.id, 'verify')}
                                className="text-blue-600 hover:text-blue-900"
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.isActive, selectedUser.isVerified)}`}>
                      {getStatusText(selectedUser.isActive, selectedUser.isVerified)}
                  </span>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <p className="text-sm text-gray-900">{selectedUser.language}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Products</label>
                    <p className="text-sm text-gray-900">{selectedUser._count.products}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Orders</label>
                    <p className="text-sm text-gray-900">{selectedUser._count.orders}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
