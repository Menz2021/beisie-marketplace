'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarIcon,
  MegaphoneIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  PhotoIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// Mock data - in a real app, this would come from API calls
const mockStats = {
  totalProducts: 45,
  weeklyOrders: 23, // Orders this week
  weeklyRevenue: 2800000, // UGX - Revenue this week
  amountToBePaid: 2520000, // 90% of weekly revenue (after 10% commission deduction)
  pendingOrders: 12,
  lowStockProducts: 8
}

const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy S23',
    price: 2500000,
    stock: 15,
    sales: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    price: 3500000,
    stock: 8,
    sales: 18,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'MacBook Pro M2',
    price: 8500000,
    stock: 3,
    sales: 12,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
  }
]

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: 'John Doe',
    total: 2500000,
    status: 'pending',
    date: '2024-01-15'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: 'Jane Smith',
    total: 3500000,
    status: 'processing',
    date: '2024-01-14'
  }
]

// Mock financial statements data
const mockFinancialStats = {
  totalEarnings: 12500000, // Total earnings (before commission)
  totalPayouts: 11250000, // Total payouts (after 10% commission)
  pendingPayout: 2520000, // Pending payout amount
  commissionPaid: 1250000, // Total commission paid to platform
  lastPayoutDate: '2024-01-10',
  nextPayoutDate: '2024-01-17'
}

const mockTransactions = [
  {
    id: '1',
    type: 'sale',
    orderNumber: 'ORD-001',
    amount: 2250000, // 90% of 2,500,000
    commission: 250000, // 10% commission
    status: 'paid',
    date: '2024-01-15',
    description: 'Samsung Galaxy S23 sale'
  },
  {
    id: '2',
    type: 'sale',
    orderNumber: 'ORD-002',
    amount: 3150000, // 90% of 3,500,000
    commission: 350000, // 10% commission
    status: 'pending',
    date: '2024-01-14',
    description: 'iPhone 14 Pro sale'
  },
  {
    id: '3',
    type: 'payout',
    orderNumber: 'PAY-001',
    amount: 4500000,
    commission: 0,
    status: 'completed',
    date: '2024-01-10',
    description: 'Weekly payout'
  },
  {
    id: '4',
    type: 'sale',
    orderNumber: 'ORD-003',
    amount: 7650000, // 90% of 8,500,000
    commission: 850000, // 10% commission
    status: 'paid',
    date: '2024-01-12',
    description: 'MacBook Pro M2 sale'
  },
  {
    id: '5',
    type: 'refund',
    orderNumber: 'REF-001',
    amount: -1800000, // Refund amount (negative)
    commission: -200000, // Commission reversal
    status: 'completed',
    date: '2024-01-08',
    description: 'Product return - Samsung Galaxy S22'
  }
]

// Mock advertising data
const mockPromotionPackages = [
  {
    id: '1',
    name: 'Featured Product',
    description: 'Show your product in the featured section on homepage',
    price: 50000, // UGX per day
    duration: 7, // days
    visibility: 'High',
    icon: StarIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    features: [
      'Homepage featured section',
      'Category page priority',
      'Search result boost',
      '7 days duration'
    ]
  },
  {
    id: '2',
    name: 'Trending Boost',
    description: 'Make your product appear in trending products',
    price: 75000, // UGX per day
    duration: 5, // days
    visibility: 'Very High',
    icon: FireIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    features: [
      'Trending products section',
      'Homepage banner placement',
      'Email newsletter inclusion',
      '5 days duration'
    ]
  },
  {
    id: '3',
    name: 'Search Priority',
    description: 'Boost your product in search results',
    price: 30000, // UGX per day
    duration: 14, // days
    visibility: 'Medium',
    icon: EyeIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      'Top search results',
      'Category page priority',
      'Related products section',
      '14 days duration'
    ]
  },
  {
    id: '4',
    name: 'Flash Sale Promotion',
    description: 'Promote your flash sale or discount',
    price: 100000, // UGX per day
    duration: 3, // days
    visibility: 'Maximum',
    icon: ClockIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      'Homepage banner',
      'Flash sale section',
      'Push notifications',
      'Social media promotion',
      '3 days duration'
    ]
  }
]

const mockProductPromotions = [
  {
    id: '1',
    productId: '1',
    productName: 'Samsung Galaxy S23',
    packageId: '1',
    packageName: 'Featured Product',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    status: 'active',
    views: 1250,
    clicks: 89,
    orders: 12,
    cost: 350000
  },
  {
    id: '2',
    productId: '2',
    productName: 'iPhone 14 Pro',
    packageId: '2',
    packageName: 'Trending Boost',
    startDate: '2024-01-12',
    endDate: '2024-01-17',
    status: 'active',
    views: 2100,
    clicks: 156,
    orders: 23,
    cost: 375000
  }
]

// Default empty settings - will be populated from API
const defaultSellerProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  businessName: '',
  businessType: '',
  businessRegistration: '',
  address: '',
  city: '',
  country: '',
  website: '',
  description: '',
  joinedDate: '',
  verificationStatus: 'pending',
  bankAccount: {
    bankName: '',
    accountNumber: '',
    accountName: ''
  }
}

const defaultNotificationSettings = {
  emailNotifications: {
    newOrders: true,
    lowStock: true,
    payments: true,
    promotions: false,
    marketing: false
  },
  pushNotifications: {
    newOrders: true,
    lowStock: true,
    payments: true,
    promotions: true,
    marketing: false
  },
  smsNotifications: {
    newOrders: false,
    lowStock: true,
    payments: true,
    promotions: false,
    marketing: false
  }
}

const defaultSecuritySettings = {
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30, // minutes
  lastPasswordChange: '',
  activeSessions: 1
}

const defaultHolidayModeSettings = {
  isEnabled: false,
  startDate: '',
  endDate: '',
  message: 'We are currently on holiday and will be back soon. Thank you for your patience!',
  autoDisable: true,
  hideProducts: true,
  showMessage: true,
  previousHolidays: [] as Array<{
    id: string;
    startDate: string;
    endDate: string;
    message: string;
    status: string;
  }>
}

export default function SellerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [refunds, setRefunds] = useState<any[]>([])
  const [refundsLoading, setRefundsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [seller, setSeller] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [financialData, setFinancialData] = useState<any>(null)
  const [financialLoading, setFinancialLoading] = useState(true)
  const [statementsData, setStatementsData] = useState<any>(null)
  const [statementsLoading, setStatementsLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [settingsTab, setSettingsTab] = useState('profile')
  const [profile, setProfile] = useState(defaultSellerProfile)
  const [notifications, setNotifications] = useState(defaultNotificationSettings)
  const [security, setSecurity] = useState(defaultSecuritySettings)
  const [holidayMode, setHolidayMode] = useState(defaultHolidayModeSettings)
  const [categories, setCategories] = useState<any[]>([])
  
  // Add product form state
  interface ProductForm {
    name: string
    originalPrice: string
    discountedPrice: string
    price: string
    stock: string
    category: string
    description: string
    deliveryTimeDays: number
    sku: string
    brand: string
    deliveryTimeText: string
    specifications: { key: string; value: string }[]
  }
  
  const [addProductForm, setAddProductForm] = useState<ProductForm>({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    deliveryTimeDays: 0,
    sku: '',
    brand: '',
    deliveryTimeText: '',
    specifications: [] as { key: string; value: string }[]
  })
  
  // Image preview state
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Product preview modal state
  const [previewProduct, setPreviewProduct] = useState<any>(null)

  // Edit product state
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editProductForm, setEditProductForm] = useState<ProductForm>({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    deliveryTimeDays: 0,
    sku: '',
    brand: '',
    deliveryTimeText: '',
    specifications: [] as { key: string; value: string }[]
  })

  const fetchSellerStats = async (sellerId: string) => {
    try {
      setStatsLoading(true)
      const response = await fetch(`/api/seller/stats?sellerId=${sellerId}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
        // Update products and orders with real data
        setProducts(data.data.recentProducts || [])
        setOrders(data.data.recentOrders || [])
      } else {
        console.error('Failed to fetch seller stats:', data.error)
        // Keep mock data as fallback
      }
    } catch (error) {
      console.error('Error fetching seller stats:', error)
      // Keep mock data as fallback
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchSellerSettings = async () => {
    try {
      const response = await fetch('/api/seller/settings', {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data.profile)
        setNotifications(data.data.notifications)
        setSecurity(data.data.security)
        setHolidayMode(data.data.holidayMode)
      } else {
        console.error('Failed to fetch seller settings:', data.error)
        // Keep default values as fallback
      }
    } catch (error) {
      console.error('Error fetching seller settings:', error)
      // Keep default values as fallback
    }
  }

  const updateSellerSettings = async (type: string, data: any) => {
    try {
      const response = await fetch('/api/seller/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`${type} settings updated successfully`)
        return true
      } else {
        console.error(`Failed to update ${type} settings:`, result.error)
        return false
      }
    } catch (error) {
      console.error(`Error updating ${type} settings:`, error)
      return false
    }
  }

  const handleProfileSave = async () => {
    const success = await updateSellerSettings('profile', profile)
    if (success) {
      alert('Profile updated successfully!')
    } else {
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleNotificationSave = async () => {
    const success = await updateSellerSettings('notifications', notifications)
    if (success) {
      alert('Notification settings updated successfully!')
    } else {
      alert('Failed to update notification settings. Please try again.')
    }
  }

  const handleSecuritySave = async () => {
    const success = await updateSellerSettings('security', security)
    if (success) {
      alert('Security settings updated successfully!')
    } else {
      alert('Failed to update security settings. Please try again.')
    }
  }

  const handleHolidayModeSave = async () => {
    const success = await updateSellerSettings('holidayMode', holidayMode)
    if (success) {
      alert('Holiday mode settings updated successfully!')
    } else {
      alert('Failed to update holiday mode settings. Please try again.')
    }
  }

  const fetchFinancialData = async (sellerId: string) => {
    try {
      setFinancialLoading(true)
      const response = await fetch(`/api/seller/financials?sellerId=${sellerId}`)
      const data = await response.json()
      
      if (data.success) {
        setFinancialData(data.data)
      } else {
        console.error('Failed to fetch financial data:', data.error)
        // Keep mock data as fallback
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
      // Keep mock data as fallback
    } finally {
      setFinancialLoading(false)
    }
  }

  useEffect(() => {
    // Check if seller is authenticated via secure cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user.role === 'SELLER') {
            setSeller(data.user)
            fetchSellerStats(data.user.id)
            fetchFinancialData(data.user.id)
            fetchSellerOrders(data.user.id)
            fetchSellerRefunds(data.user.id)
            fetchStatementsData(data.user.id, selectedPeriod)
            fetchSellerSettings() // Fetch seller settings from API
            setIsLoading(false)
            return
          }
        }
        
        // If not authenticated or not a seller, redirect
        router.push('/seller/auth/login')
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/seller/auth/login')
      }
    }

    checkAuth()
  }, [router])

  // Refetch statements data when period changes
  useEffect(() => {
    if (seller?.id && activeTab === 'statements') {
      fetchStatementsData(seller.id, selectedPeriod)
    }
  }, [selectedPeriod, activeTab, seller?.id])

  const fetchSellerOrders = async (vendorId: string) => {
    setOrdersLoading(true)
    try {
      const response = await fetch(`/api/seller/orders?vendorId=${vendorId}`)
      const data = await response.json()
      if (data.success) {
        // Transform API data to match our interface
        const transformedOrders = data.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.customer.name || order.customer.email,
          total: order.total,
          status: order.status.toLowerCase(),
          date: new Date(order.createdAt).toLocaleDateString()
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!seller?.id) {
      alert('Seller information not found')
      return
    }

    const confirmMessage = newStatus === 'CANCELLED' 
      ? 'Are you sure you want to cancel this order? This action cannot be undone and will restore inventory.'
      : 'Are you sure you want to mark this order as ready to ship?'

    if (!confirm(confirmMessage)) {
      return
    }

    setUpdatingStatus(orderId)
    try {
      const response = await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          vendorId: seller.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update the orders list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus.toLowerCase() }
              : order
          )
        )
        
        // Show success message
        const statusText = newStatus === 'CANCELLED' ? 'cancelled' : 'ready to ship'
        alert(`Order successfully marked as ${statusText}`)
        
        // Refresh orders to get updated data
        fetchSellerOrders(seller.id)
      } else {
        alert(`Failed to update order: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status. Please try again.')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const fetchSellerRefunds = async (vendorId: string) => {
    setRefundsLoading(true)
    try {
      const response = await fetch(`/api/seller/refunds?vendorId=${vendorId}`)
      const data = await response.json()
      if (data.success) {
        setRefunds(data.data)
      }
    } catch (error) {
      console.error('Error fetching seller refunds:', error)
    } finally {
      setRefundsLoading(false)
    }
  }

  const fetchStatementsData = async (vendorId: string, period: string = 'all') => {
    setStatementsLoading(true)
    try {
      const response = await fetch(`/api/seller/statements?sellerId=${vendorId}&period=${period}`)
      const data = await response.json()
      if (data.success) {
        setStatementsData(data.data)
      }
    } catch (error) {
      console.error('Error fetching statements data:', error)
    } finally {
      setStatementsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const result = await response.json()
        if (result.success) {
          setCategories(result.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    // Fetch seller's products
    const fetchProducts = async () => {
      if (seller?.id) {
        try {
          const response = await fetch(`/api/seller/products?vendorId=${seller.id}`)
          const result = await response.json()
          if (result.success) {
            setProducts(result.data)
          }
        } catch (error) {
          console.error('Error fetching products:', error)
        }
      }
    }
    
    fetchCategories()
    fetchProducts()
  }, [seller])

  const handleLogout = async () => {
    try {
      // Call secure logout API
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Redirect to seller login page
      router.push('/seller/auth/login')
    }
  }

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(files)
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  // Edit product handlers
  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setEditProductForm({
      name: product.name,
      originalPrice: product.originalPrice?.toString() || '',
      discountedPrice: product.discountedPrice?.toString() || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      category: product.category || '',
      description: product.description || '',
      deliveryTimeDays: product.deliveryTimeDays || 0,
      sku: product.sku || '',
      brand: product.brand || '',
      deliveryTimeText: product.deliveryTimeText || '',
      specifications: product.specifications ? JSON.parse(product.specifications) : [] as { key: string; value: string }[]
    })
    setActiveTab('edit-product')
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!seller) {
      alert('Seller information not found. Please log in again.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', addProductForm.name)
      formData.append('description', addProductForm.description)
      formData.append('price', addProductForm.price)
      formData.append('originalPrice', addProductForm.originalPrice)
      formData.append('discountedPrice', addProductForm.discountedPrice)
      formData.append('stock', addProductForm.stock)
      formData.append('categoryId', addProductForm.category)
      formData.append('vendorId', seller.id)
      formData.append('deliveryTimeDays', addProductForm.deliveryTimeDays.toString())
      formData.append('sku', addProductForm.sku || '')
      formData.append('brand', addProductForm.brand || '')
      formData.append('deliveryTimeText', addProductForm.deliveryTimeText || '')
      formData.append('specifications', JSON.stringify(addProductForm.specifications))
      formData.append('isActive', 'true')
      formData.append('isFeatured', 'false')
      
      // Add selected images
      selectedImages.forEach((image, index) => {
        formData.append('images', image)
      })

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        // Add new product to local state
        setProducts([result.data, ...products])
        
        // Reset form
        setAddProductForm({
          name: '',
          originalPrice: '',
          discountedPrice: '',
          price: '',
          stock: '',
          category: '',
          description: '',
          deliveryTimeDays: 0,
          sku: '',
          brand: '',
          deliveryTimeText: '',
          specifications: [] as { key: string; value: string }[]
        })
        
        // Reset images
        setSelectedImages([])
        setImagePreviews([])
        setActiveTab('products')
        
        alert('Product created successfully and submitted for approval!')
      } else {
        alert('Error creating product: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product. Please try again.')
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingProduct) return

    try {
      const formData = new FormData()
      formData.append('productId', editingProduct.id)
      formData.append('name', editProductForm.name)
      formData.append('description', editProductForm.description)
      formData.append('price', editProductForm.price)
      formData.append('originalPrice', editProductForm.originalPrice)
      formData.append('discountedPrice', editProductForm.discountedPrice)
      formData.append('stock', editProductForm.stock)
      formData.append('categoryId', editProductForm.category)
      formData.append('vendorId', seller.id)
      formData.append('deliveryTimeDays', editProductForm.deliveryTimeDays.toString())
      formData.append('isActive', 'true')
      formData.append('isFeatured', 'false')

      const response = await fetch('/api/seller/products', {
        method: 'PUT',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        // Update local products state
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: editProductForm.name,
                price: parseFloat(editProductForm.price),
                stock: parseInt(editProductForm.stock),
                description: editProductForm.description,
                category: editProductForm.category
              }
            : p
        ))
        
        // Reset form and close edit mode
        setEditingProduct(null)
        setEditProductForm({
          name: '',
          originalPrice: '',
          discountedPrice: '',
          price: '',
          stock: '',
          category: '',
          description: '',
          deliveryTimeDays: 0,
          sku: '',
          brand: '',
          deliveryTimeText: '',
          specifications: [] as { key: string; value: string }[]
        })
        setActiveTab('products')
        
        alert('Product updated successfully!')
      } else {
        alert('Error updating product: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product. Please try again.')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // In a real app, you'd call a DELETE API endpoint
        // For now, just remove from local state
        setProducts(products.filter(p => p.id !== productId))
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product. Please try again.')
      }
    }
  }

  // Generate delivery time options
  const getDeliveryTimeOptions = () => {
    const stock = parseInt(addProductForm.stock) || 0
    const options = []
    
    // Always show basic options regardless of stock
    options.push({ 
      value: 0, 
      label: 'Same day delivery', 
      description: 'Delivered on the same day order is confirmed (0 days)',
      available: stock > 0
    })
    
    options.push({ 
      value: 1, 
      label: 'Next day delivery', 
      description: 'Delivered 1 day after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 2, 
      label: '2 days delivery', 
      description: 'Delivered 2 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 3, 
      label: '3 days delivery', 
      description: 'Delivered 3 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 5, 
      label: '5 days delivery', 
      description: 'Delivered 5 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 7, 
      label: '1 week delivery', 
      description: 'Delivered 7 days after order confirmation',
      available: stock > 0
    })
    
    return options
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
      case 'active': 
        return 'bg-green-100 text-green-800'
      case 'low_stock': 
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': 
        return 'bg-red-100 text-red-800'
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800'
      case 'processing': 
        return 'bg-blue-100 text-blue-800'
      case 'shipped': 
        return 'bg-purple-100 text-purple-800'
      case 'delivered': 
        return 'bg-green-100 text-green-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default: 
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 text-green-800'
      case 'payout':
        return 'bg-blue-100 text-blue-800'
      case 'refund':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingBagIcon className="h-4 w-4" />
      case 'payout':
        return <BanknotesIcon className="h-4 w-4" />
      case 'refund':
        return <CurrencyDollarIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'PROCESSED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    )
  }

  if (!seller) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <h1 className="text-lg font-semibold text-gray-900 ml-3">Seller Center</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-medium">{seller.name?.charAt(0).toUpperCase() || 'S'}</span>
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
        <div className="flex items-center justify-between h-14 bg-gradient-to-r from-purple-600 to-blue-600 px-4">
          <h1 className="text-lg font-bold text-white">Seller Center</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-white hover:bg-white/20 transition-all duration-200 lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        
        <div className="flex flex-col h-full overflow-hidden">
          <nav className="flex-1 mt-6 overflow-y-auto">
            <div className="px-4 space-y-2 pb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'products' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ShoppingBagIcon className="mr-3 h-5 w-5" />
                Products
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <DocumentTextIcon className="mr-3 h-5 w-5" />
                Orders
              </button>
              
              <button
                onClick={() => setActiveTab('refunds')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'refunds' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ExclamationTriangleIcon className="mr-3 h-5 w-5" />
                Refunds
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'analytics' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Analytics
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('statements')
                  if (seller?.id) {
                    fetchFinancialData(seller.id)
                  }
                }}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'statements' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="mr-3 h-5 w-5" />
                Account Statements
              </button>
              
              <button
                onClick={() => setActiveTab('advertise')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'advertise' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <MegaphoneIcon className="mr-3 h-5 w-5" />
                Advertise Products
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-purple-100 text-purple-700' 
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
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:bg-white lg:shadow-lg lg:flex-col">
        <div className="flex items-center justify-center h-14 bg-gradient-to-r from-purple-600 to-blue-600">
          <h1 className="text-lg font-bold text-white">Seller Center</h1>
        </div>
        
        <div className="flex flex-col h-full">
          <nav className="flex-1 mt-6">
            <div className="px-4 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'products' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ShoppingBagIcon className="mr-3 h-5 w-5" />
                Products
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <DocumentTextIcon className="mr-3 h-5 w-5" />
                Orders
              </button>
              
              <button
                onClick={() => setActiveTab('refunds')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'refunds' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ExclamationTriangleIcon className="mr-3 h-5 w-5" />
                Refunds
              </button>
              
              <button
                onClick={() => setActiveTab('financials')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'financials' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <BanknotesIcon className="mr-3 h-5 w-5" />
                Financials
              </button>
              
              <button
                onClick={() => setActiveTab('statements')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'statements' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Account Statements
              </button>
              
              <button
                onClick={() => setActiveTab('advertise')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'advertise' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <MegaphoneIcon className="mr-3 h-5 w-5" />
                Advertise Products
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
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
      </div>

      {/* Main Content */}
      <div className="pt-14 lg:ml-64 transition-all duration-300 ease-in-out">
        <div className="px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6 lg:pb-8">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Stats Cards at Top - Mobile Optimized */}
              <div className="bg-gradient-to-r from-purple-50/95 to-blue-50/95 backdrop-blur-sm border border-gray-200/50 rounded-lg px-3 py-3 sm:px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                        <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
              </div>
              <div className="ml-2 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : (stats?.totalProducts || 0)}
                      </p>
              </div>
            </div>
          </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                        <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
              </div>
              <div className="ml-2 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Orders This Week</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : (stats?.weeklyOrders || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">📅 Weekly Performance</p>
              </div>
            </div>
          </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
                        <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
              </div>
              <div className="ml-2 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue This Week</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : formatCurrency(stats?.weeklyRevenue || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">📅 Weekly Performance</p>
              </div>
            </div>
          </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                        <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
              </div>
              <div className="ml-2 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Amount to be Paid</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : formatCurrency(stats?.amountToBePaid || 0)}
                      </p>
              </div>
              </div>
            </div>
                </div>
              </div>

              {/* Dashboard Content - Mobile Optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)] overflow-hidden">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Recent Orders */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 hover:shadow-xl transition-all duration-300 h-96 overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                      View All
              </button>
        </div>
                  <div className="space-y-3 overflow-y-auto h-80">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-purple-700">#{order.orderNumber}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{order.customer}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

                {/* My Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-96 overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => setActiveTab('add-product')}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 overflow-y-auto h-80">
                    {products.slice(0, 6).map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={(product as any).images ? (Array.isArray((product as any).images) ? (product as any).images[0] : JSON.parse((product as any).images)[0]) : (product as any).image || '/api/placeholder/100/100'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>Stock: {product.stock}</span>
                              <span>•</span>
                              <span>{formatCurrency(product.price)}</span>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((product as any).approvalStatus || (product as any).status || 'pending')}`}>
                            {((product as any).approvalStatus || (product as any).status || 'pending').replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
                <div className="space-y-4">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-96 overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sales Overview</h3>
                  <div className="space-y-3 overflow-y-auto h-80">
                  {statsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading...</p>
                    </div>
                  ) : (
                    stats?.salesData?.map((data: any, index: number) => {
                      const maxRevenue = Math.max(...(stats.salesData?.map((d: any) => d.revenue) || [1]))
                      return (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                            <div className="flex-1 mx-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                            <div className="text-right w-24">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(data.revenue)}</p>
                            <p className="text-xs text-gray-500">{data.orders} orders</p>
                          </div>
                        </div>
                      )
                    }) || []
                  )}
                  </div>
                </div>
              </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-96 overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <ShoppingBagIcon className="h-6 w-6 text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">View Orders</p>
                      <p className="text-xs text-gray-500">Manage your orders</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <PlusIcon className="h-6 w-6 text-green-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Add Product</p>
                      <p className="text-xs text-gray-500">Create new listing</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <ChartBarIcon className="h-6 w-6 text-purple-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-500">View insights</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <CogIcon className="h-6 w-6 text-gray-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Settings</p>
                      <p className="text-xs text-gray-500">Account settings</p>
                      </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Management Tab */}
          {activeTab === 'products' && (
            <div className="h-[calc(100vh-6rem)] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Management</h2>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 w-full sm:w-auto justify-center"
                >
                <PlusIcon className="h-4 w-4 mr-2" />
                  Add New Product
              </button>
            </div>

              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                <div className="space-y-3 overflow-y-auto h-[calc(100vh-10rem)]">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={(product as any).images ? (Array.isArray((product as any).images) ? (product as any).images[0] : JSON.parse((product as any).images)[0]) : (product as any).image || '/api/placeholder/100/100'}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{formatCurrency(product.price)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((product as any).approvalStatus || (product as any).status || 'pending')}`}>
                              {((product as any).approvalStatus || (product as any).status || 'pending').replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => setPreviewProduct(product)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                            >
                              <EyeIcon className="h-3 w-3 mr-1" />
                              View
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
                            >
                              <PencilIcon className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                            >
                              <TrashIcon className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-10rem)]">
              <div className="overflow-auto h-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                              <img
                                src={(product as any).images ? (Array.isArray((product as any).images) ? (product as any).images[0] : JSON.parse((product as any).images)[0]) : (product as any).image || '/api/placeholder/100/100'}
                                alt={product.name}
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                              <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-32">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((product as any).approvalStatus || (product as any).status || 'pending')}`}>
                            {((product as any).approvalStatus || (product as any).status || 'pending').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setPreviewProduct(product)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View"
                            >
                              <EyeIcon className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Edit"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          {/* Add Product Tab */}
          {activeTab === 'add-product' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-sm text-gray-600 hover:text-gray-900 self-start sm:self-auto"
                >
                  ← Back to Products
                </button>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                <form onSubmit={handleAddProduct} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        value={addProductForm.name}
                        onChange={(e) => setAddProductForm({...addProductForm, name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price (UGX) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={addProductForm.originalPrice}
                        onChange={(e) => setAddProductForm({...addProductForm, originalPrice: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter original price"
                      />
                      <p className="text-xs text-gray-500 mt-1">The original price before any discounts</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discounted Price (UGX)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={addProductForm.discountedPrice}
                        onChange={(e) => setAddProductForm({...addProductForm, discountedPrice: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter discounted price (optional)"
                      />
                      <p className="text-xs text-gray-500 mt-1">The discounted price customers will pay (optional)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Selling Price (UGX) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={addProductForm.price}
                        onChange={(e) => setAddProductForm({...addProductForm, price: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter current selling price"
                      />
                      <p className="text-xs text-gray-500 mt-1">The price customers will actually pay (usually the discounted price if available)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input
                        type="number"
                        value={addProductForm.stock}
                        onChange={(e) => setAddProductForm({...addProductForm, stock: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SKU (Optional)</label>
                      <input
                        type="text"
                        value={addProductForm.sku}
                        onChange={(e) => setAddProductForm({...addProductForm, sku: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter product SKU"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand (Optional)</label>
                      <input
                        type="text"
                        value={addProductForm.brand}
                        onChange={(e) => setAddProductForm({...addProductForm, brand: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter product brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select 
                        value={addProductForm.category}
                        onChange={(e) => setAddProductForm({...addProductForm, category: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Delivery Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time (Days from Order Confirmation) *
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select how many days after an order is confirmed the product will be delivered. 
                      This is calculated from the order confirmation date, not from when the product is listed.
                    </p>
                    <div className="space-y-3">
                      {getDeliveryTimeOptions().map((option) => (
                        <label 
                          key={option.value} 
                          className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            option.available 
                              ? 'border-gray-200 hover:bg-gray-50' 
                              : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryTimeDays"
                            value={option.value}
                            checked={addProductForm.deliveryTimeDays === option.value}
                            onChange={(e) => {
                              const days = parseInt(e.target.value)
                              const option = getDeliveryTimeOptions().find(opt => opt.value === days)
                              setAddProductForm({
                                ...addProductForm, 
                                deliveryTimeDays: days,
                                deliveryTimeText: option?.label || ''
                              })
                            }}
                            disabled={!option.available}
                            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{option.label}</span>
                              {option.value >= 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {option.value} day{option.value !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                            {!option.available && (
                              <div className="text-xs text-red-500 mt-1">Requires stock &gt; 0</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Important:</strong> Delivery time is calculated from the order confirmation date, not from when the product is listed. 
                      Make sure you can fulfill orders within the selected timeframe.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Description *</label>
                    <textarea
                      rows={4}
                      value={addProductForm.description}
                      onChange={(e) => setAddProductForm({...addProductForm, description: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Enter detailed product description (minimum 10 characters)"
                      required
                      minLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {addProductForm.description.length}/10 characters minimum
                      {addProductForm.description.length < 10 && (
                        <span className="text-red-500 ml-2">Description must be at least 10 characters</span>
                      )}
                    </p>
                  </div>

                  {/* Product Specifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Specifications</label>
                    <div className="space-y-3">
                      {addProductForm.specifications.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Specification name (e.g., Display, Processor)"
                            value={spec.key}
                            onChange={(e) => {
                              const newSpecs = [...addProductForm.specifications]
                              newSpecs[index] = { ...spec, key: e.target.value }
                              setAddProductForm({ ...addProductForm, specifications: newSpecs })
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., 6.8 inch AMOLED, Snapdragon 8 Gen 2)"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...addProductForm.specifications]
                              newSpecs[index] = { ...spec, value: e.target.value }
                              setAddProductForm({ ...addProductForm, specifications: newSpecs })
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = addProductForm.specifications.filter((_, i) => i !== index)
                              setAddProductForm({ ...addProductForm, specifications: newSpecs })
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setAddProductForm({
                            ...addProductForm,
                            specifications: [...addProductForm.specifications, { key: '', value: '' }]
                          })
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        + Add Specification
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Add key specifications like display size, processor, RAM, storage, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>Upload images</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              multiple 
                              accept="image/*"
                              onChange={handleImageSelect}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </div>
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Tab */}
          {activeTab === 'edit-product' && editingProduct && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setActiveTab('products')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to Products
                </button>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <form onSubmit={handleUpdateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        value={editProductForm.name}
                        onChange={(e) => setEditProductForm({...editProductForm, name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={editProductForm.category}
                        onChange={(e) => setEditProductForm({...editProductForm, category: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editProductForm.description}
                      onChange={(e) => setEditProductForm({...editProductForm, description: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price (UGX) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={editProductForm.originalPrice}
                        onChange={(e) => setEditProductForm({...editProductForm, originalPrice: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter original price"
                      />
                      <p className="text-xs text-gray-500 mt-1">The original price before any discounts</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discounted Price (UGX)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editProductForm.discountedPrice}
                        onChange={(e) => setEditProductForm({...editProductForm, discountedPrice: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter discounted price (optional)"
                      />
                      <p className="text-xs text-gray-500 mt-1">The discounted price customers will pay (optional)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Selling Price (UGX) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={editProductForm.price}
                        onChange={(e) => setEditProductForm({...editProductForm, price: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter current selling price"
                      />
                      <p className="text-xs text-gray-500 mt-1">The price customers will actually pay (usually the discounted price if available)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={editProductForm.stock}
                        onChange={(e) => setEditProductForm({...editProductForm, stock: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter stock quantity"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                      <select
                        value={editProductForm.deliveryTimeDays}
                        onChange={(e) => setEditProductForm({...editProductForm, deliveryTimeDays: parseInt(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      >
                        {getDeliveryTimeOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {getDeliveryTimeOptions().find(opt => opt.value === editProductForm.deliveryTimeDays)?.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null)
                        setActiveTab('products')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Orders Management Tab */}
        {activeTab === 'orders' && (
            <div className="h-[calc(100vh-6rem)] overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Management</h2>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-10rem)]">
              <div className="overflow-auto h-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              <span className="ml-2 text-sm text-gray-600">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-3 text-center text-sm text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                            {formatCurrency(order.total * 0.90)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1">
                            <button 
                              className="text-purple-600 hover:text-purple-900 p-1"
                              onClick={() => handleViewOrder(order)}
                              title="View Order"
                            >
                              <EyeIcon className="h-3 w-3" />
                            </button>
                            {order.status === 'pending' || order.status === 'processing' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'READY_TO_SHIP')}
                                  disabled={updatingStatus === order.id}
                                  className="text-green-600 hover:text-green-900 text-xs px-1 py-1 border border-green-300 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Ready to Ship"
                                >
                                  {updatingStatus === order.id ? '...' : 'Ship'}
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  disabled={updatingStatus === order.id}
                                  className="text-red-600 hover:text-red-900 text-xs px-1 py-1 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Cancel Order"
                                >
                                  {updatingStatus === order.id ? '...' : 'Cancel'}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {order.status === 'ready_to_ship' ? 'Ready to Ship' : 
                                 order.status === 'cancelled' ? 'Cancelled' : 
                                 order.status}
                              </span>
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

              {/* Mobile Card View */}
              <div className="lg:hidden bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-10rem)]">
                <div className="overflow-auto h-full p-4">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading orders...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          {/* Order Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">#{order.orderNumber}</h3>
                              <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Customer:</span>
                              <span className="text-gray-900 font-medium">{order.customer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total:</span>
                              <span className="text-gray-900 font-medium">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Your Share:</span>
                              <span className="text-green-600 font-medium">{formatCurrency(order.total * 0.90)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2">
                            <button 
                              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-600 border border-purple-300 rounded-md hover:bg-purple-50 touch-manipulation min-h-[40px]"
                              onClick={() => handleViewOrder(order)}
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Order Details
                            </button>
                            
                            {order.status === 'pending' || order.status === 'processing' ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'READY_TO_SHIP')}
                                  disabled={updatingStatus === order.id}
                                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[40px]"
                                >
                                  {updatingStatus === order.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                  ) : (
                                    <>
                                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                      Ready to Ship
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  disabled={updatingStatus === order.id}
                                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[40px]"
                                >
                                  {updatingStatus === order.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <>
                                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Cancel Order
                                    </>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <span className="text-xs text-gray-500">
                                  {order.status === 'ready_to_ship' ? 'Ready to Ship' : 
                                   order.status === 'cancelled' ? 'Cancelled' : 
                                   order.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
          </div>
        )}

          {/* Refunds Management Tab */}
          {activeTab === 'refunds' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Refund Management</h2>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Refund Requests</h3>
                  <p className="text-sm text-gray-500 mt-1">Refund requests for your products</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {refundsLoading ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                              <span className="ml-2 text-gray-600">Loading refunds...</span>
                            </div>
                          </td>
                        </tr>
                      ) : refunds.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            No refund requests found
                          </td>
                        </tr>
                      ) : (
                        refunds.map((refund) => (
                          <tr key={refund.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{refund.id.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{refund.orderId.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {refund.order?.customer?.name || 'Unknown Customer'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {refund.order?.orderItems?.[0]?.product?.name || 'Multiple items'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(refund.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {refund.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRefundStatusColor(refund.status)}`}>
                                {refund.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(refund.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Refund Requests</h3>
                  <p className="text-xs text-gray-500 mt-1">Refund requests for your products</p>
                </div>
                
                <div className="p-4">
                  {refundsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading refunds...</span>
                    </div>
                  ) : refunds.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No refund requests found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {refunds.map((refund) => (
                        <div key={refund.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          {/* Refund Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">#{refund.id.slice(-8)}</h3>
                              <p className="text-xs text-gray-500 mt-1">{new Date(refund.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRefundStatusColor(refund.status)}`}>
                              {refund.status}
                            </span>
                          </div>

                          {/* Refund Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Order #:</span>
                              <span className="text-gray-900 font-medium">#{refund.orderId.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Customer:</span>
                              <span className="text-gray-900 font-medium">{refund.order?.customer?.name || 'Unknown Customer'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Product:</span>
                              <span className="text-gray-900 font-medium">{refund.order?.orderItems?.[0]?.product?.name || 'Multiple items'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className="text-gray-900 font-medium">{formatCurrency(refund.amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Reason:</span>
                              <span className="text-gray-500 text-right max-w-[60%]">{refund.reason}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Pending Refunds</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {refunds.filter(r => r.status === 'PENDING').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Total Refunded</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {formatCurrency(refunds.filter(r => r.status === 'PROCESSED').reduce((sum, r) => sum + r.amount, 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Refund Rate</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {orders.length > 0 ? ((refunds.length / orders.length) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Statements Tab */}
          {activeTab === 'statements' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Mobile Header */}
              <div className="lg:hidden">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Statements</h2>
                <div className="space-y-3">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 touch-manipulation min-h-[48px]"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button 
                    onClick={() => {
                      // Generate and download statement
                      const statementData = {
                        seller: seller?.name || 'Unknown Seller',
                        period: selectedPeriod === 'all' ? 'All Time' : selectedPeriod,
                        stats: statementsData?.periodStats || financialData?.financialStats,
                        transactions: statementsData?.transactions || financialData?.transactions || [],
                        summary: statementsData?.summaryByType,
                        generatedAt: new Date().toISOString()
                      }
                      const dataStr = JSON.stringify(statementData, null, 2)
                      const dataBlob = new Blob([dataStr], {type: 'application/json'})
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `statement-${new Date().toISOString().split('T')[0]}.json`
                      link.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 touch-manipulation min-h-[48px]"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Download Statement
                  </button>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Account Statements</h2>
                <div className="flex space-x-2">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button 
                    onClick={() => {
                      // Generate and download statement
                      const statementData = {
                        seller: seller?.name || 'Unknown Seller',
                        period: selectedPeriod === 'all' ? 'All Time' : selectedPeriod,
                        stats: statementsData?.periodStats || financialData?.financialStats,
                        transactions: statementsData?.transactions || financialData?.transactions || [],
                        summary: statementsData?.summaryByType,
                        generatedAt: new Date().toISOString()
                      }
                      const dataStr = JSON.stringify(statementData, null, 2)
                      const dataBlob = new Blob([dataStr], {type: 'application/json'})
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `statement-${new Date().toISOString().split('T')[0]}.json`
                      link.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Download Statement
                  </button>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Total Earnings</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {statementsLoading ? '...' : formatCurrency(statementsData?.periodStats?.totalEarnings || financialData?.financialStats?.totalEarnings || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">All time</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BanknotesIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Total Payouts</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {statementsLoading ? '...' : formatCurrency(statementsData?.periodStats?.totalPayouts || financialData?.financialStats?.totalPayouts || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Received</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Pending Payout</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {statementsLoading ? '...' : formatCurrency(statementsData?.periodStats?.pendingPayout || financialData?.financialStats?.pendingPayout || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Next payout: {financialLoading ? '...' : (financialData?.financialStats?.nextPayoutDate || 'N/A')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Commission Paid</p>
                      <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                        {statementsLoading ? '...' : formatCurrency(statementsData?.periodStats?.totalCommission || financialData?.financialStats?.commissionPaid || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">10% platform fee</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Transaction History Table */}
              <div className="hidden lg:block bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                  <p className="text-sm text-gray-500 mt-1">All your financial transactions and payouts</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order/Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statementsLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading transactions...</p>
                          </td>
                        </tr>
                      ) : (
                        (statementsData?.transactions || financialData?.transactions || []).map((transaction: any) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.orderNumber}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            transaction.commission >= 0 ? 'text-gray-600' : 'text-red-600'
                          }`}>
                            {transaction.commission !== 0 && (
                              <span>
                                {transaction.commission >= 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.commission))}
                              </span>
                            )}
                            {transaction.commission === 0 && <span className="text-gray-400">-</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Transaction History Cards */}
              <div className="lg:hidden bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Transaction History</h3>
                  <p className="text-xs text-gray-500 mt-1">All your financial transactions and payouts</p>
                </div>
                
                <div className="p-4">
                  {statementsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading transactions...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(statementsData?.transactions || financialData?.transactions || []).map((transaction: any) => (
                        <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          {/* Transaction Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-semibold text-gray-900 capitalize">{transaction.type}</h4>
                                <p className="text-xs text-gray-500">{transaction.date}</p>
                              </div>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>

                          {/* Transaction Details */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Description:</span>
                              <span className="text-gray-900 font-medium text-right max-w-[60%]">{transaction.description}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Reference:</span>
                              <span className="text-gray-500">{transaction.orderNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Amount:</span>
                              <span className={`font-medium ${
                                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                              </span>
                            </div>
                            {transaction.commission !== 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Commission:</span>
                                <span className={`${
                                  transaction.commission >= 0 ? 'text-gray-600' : 'text-red-600'
                                }`}>
                                  {transaction.commission >= 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.commission))}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Financial Metrics */}
              {statementsData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm font-medium text-gray-500">Total Sales</p>
                        <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                          {formatCurrency(statementsData.periodStats?.totalSales || 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Gross revenue</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm font-medium text-gray-500">Total Refunds</p>
                        <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                          {formatCurrency(statementsData.periodStats?.totalRefunds || 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Refunded amount</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CurrencyDollarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm font-medium text-gray-500">Net Earnings</p>
                        <p className="text-lg lg:text-2xl font-semibold text-gray-900">
                          {formatCurrency(statementsData.periodStats?.netEarnings || 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">After refunds</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payout Schedule */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Payout</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {statementsLoading ? '...' : (statementsData?.periodStats?.lastPayoutDate || financialData?.financialStats?.lastPayoutDate || 'N/A')}
                        </p>
                        <p className="text-sm text-gray-500">Completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-green-600">
                          {financialLoading ? '...' : formatCurrency(financialData?.financialStats?.totalPayouts || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Next Payout</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {statementsLoading ? '...' : (statementsData?.periodStats?.nextPayoutDate || financialData?.financialStats?.nextPayoutDate || 'N/A')}
                        </p>
                        <p className="text-sm text-gray-500">Scheduled</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {statementsLoading ? '...' : formatCurrency(statementsData?.periodStats?.pendingPayout || financialData?.financialStats?.pendingPayout || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Payout Information:</strong> Payouts are processed weekly every Wednesday. 
                        You receive 90% of your sales revenue after deducting the 10% platform commission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advertise Products Tab */}
          {activeTab === 'advertise' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Advertise Your Products</h2>
                  <p className="text-sm text-gray-500 mt-1">Boost your product visibility and increase sales with our promotion packages</p>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Active Promotions Summary */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Promotions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MegaphoneIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Active Campaigns</p>
                        <p className="text-2xl font-semibold text-green-900">{mockProductPromotions.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <EyeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Total Views</p>
                        <p className="text-2xl font-semibold text-blue-900">
                          {mockProductPromotions.reduce((sum, promo) => sum + promo.views, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-800">Total Spent</p>
                        <p className="text-2xl font-semibold text-purple-900">
                          {formatCurrency(mockProductPromotions.reduce((sum, promo) => sum + promo.cost, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotion Packages */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Your Promotion Package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mockPromotionPackages.map((pkg) => {
                    const IconComponent = pkg.icon
                    return (
                      <div key={pkg.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-full ${pkg.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${pkg.color}`} />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-semibold text-gray-900">{pkg.name}</h4>
                            <p className="text-sm text-gray-500">{pkg.visibility} Visibility</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{formatCurrency(pkg.price)}</span>
                            <span className="text-sm text-gray-500 ml-1">/day</span>
                          </div>
                          <p className="text-xs text-gray-500">Duration: {pkg.duration} days</p>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                          Select Package
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Product Selection for Promotion */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Products to Promote</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <img
                          src={(product as any).images ? (Array.isArray((product as any).images) ? (product as any).images[0] : JSON.parse((product as any).images)[0]) : (product as any).image || '/api/placeholder/100/100'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                          <p className="text-sm text-gray-500">Price: {formatCurrency(product.price)}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700">
                            Promote
                          </button>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((product as any).approvalStatus || (product as any).status || 'pending')}`}>
                            {((product as any).approvalStatus || (product as any).status || 'pending').replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Promotions Table */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active Promotions</h3>
                  <p className="text-sm text-gray-500 mt-1">Track your current advertising campaigns</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockProductPromotions.map((promotion) => (
                        <tr key={promotion.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {promotion.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {promotion.packageName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {promotion.startDate} - {promotion.endDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {promotion.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {promotion.clicks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {promotion.orders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(promotion.cost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(promotion.status)}`}>
                              {promotion.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-purple-600 hover:text-purple-900">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
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

              {/* Promotion Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Promotion Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Best Practices</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Promote products with good stock levels</li>
                      <li>• Use high-quality product images</li>
                      <li>• Set competitive prices</li>
                      <li>• Monitor campaign performance daily</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Timing Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Start promotions on weekends for better reach</li>
                      <li>• Use flash sales for quick inventory clearance</li>
                      <li>• Promote trending categories</li>
                      <li>• Adjust budgets based on performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
                </div>
              </div>

              {/* Settings Navigation */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    <button
                      onClick={() => setSettingsTab('profile')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        settingsTab === 'profile'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <UserIcon className="h-5 w-5 inline mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => setSettingsTab('business')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        settingsTab === 'business'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <BuildingOfficeIcon className="h-5 w-5 inline mr-2" />
                      Business
                    </button>
                    <button
                      onClick={() => setSettingsTab('notifications')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        settingsTab === 'notifications'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <BellIcon className="h-5 w-5 inline mr-2" />
                      Notifications
                    </button>
                    <button
                      onClick={() => setSettingsTab('security')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        settingsTab === 'security'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
                      Security
                    </button>
                    <button
                      onClick={() => setSettingsTab('holiday')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        settingsTab === 'holiday'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <SunIcon className="h-5 w-5 inline mr-2" />
                      Holiday Mode
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Profile Settings */}
                  {settingsTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img
                            className="h-20 w-20 rounded-full object-cover"
                            src={profile.avatar}
                            alt={profile.name}
                          />
                          <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full hover:bg-purple-700">
                            <PhotoIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                          <p className="text-sm text-gray-500">{profile.email}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            profile.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {profile.verificationStatus === 'verified' ? '✓ Verified' : 'Pending Verification'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          <input
                            type="url"
                            value={profile.website}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio/Description</label>
                        <textarea
                          rows={4}
                          value={profile.description}
                          onChange={(e) => setProfile({...profile, description: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={handleProfileSave}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Business Settings */}
                  {settingsTab === 'business' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Business Name</label>
                          <input
                            type="text"
                            value={profile.businessName}
                            onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Business Type</label>
                          <select
                            value={profile.businessType}
                            onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            <option>Electronics Retailer</option>
                            <option>Fashion Store</option>
                            <option>Home & Garden</option>
                            <option>Beauty & Health</option>
                        <option>Makeup</option>
                        <option>Fragrance</option>
                        <option>Skincare</option>
                        <option>Haircare</option>
                        <option>Grooming</option>
                        <option>Hair Styling Tools</option>
                            <option>Sports & Outdoors</option>
                            <option>Books & Media</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Business Registration</label>
                          <input
                            type="text"
                            value={profile.businessRegistration}
                            onChange={(e) => setProfile({...profile, businessRegistration: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            value={profile.city}
                            onChange={(e) => setProfile({...profile, city: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Address</label>
                        <textarea
                          rows={3}
                          value={profile.address}
                          onChange={(e) => setProfile({...profile, address: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>

                      {/* Bank Account Information */}
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Bank Account Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                              type="text"
                              value={profile.bankAccount.bankName}
                              onChange={(e) => setProfile({
                                ...profile, 
                                bankAccount: {...profile.bankAccount, bankName: e.target.value}
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                            <input
                              type="text"
                              value={profile.bankAccount.accountNumber}
                              onChange={(e) => setProfile({
                                ...profile, 
                                bankAccount: {...profile.bankAccount, accountNumber: e.target.value}
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Account Name</label>
                            <input
                              type="text"
                              value={profile.bankAccount.accountName}
                              onChange={(e) => setProfile({
                                ...profile, 
                                bankAccount: {...profile.bankAccount, accountName: e.target.value}
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={handleProfileSave}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Save Business Information
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {settingsTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">Email Notifications</h4>
                        <div className="space-y-3">
                          {Object.entries(notifications.emailNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {key === 'newOrders' && 'Get notified when you receive new orders'}
                                  {key === 'lowStock' && 'Get notified when product stock is low'}
                                  {key === 'payments' && 'Get notified about payment updates'}
                                  {key === 'promotions' && 'Get notified about promotion opportunities'}
                                  {key === 'marketing' && 'Get marketing emails and updates'}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => setNotifications({
                                    ...notifications,
                                    emailNotifications: {
                                      ...notifications.emailNotifications,
                                      [key]: e.target.checked
                                    }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900">Push Notifications</h4>
                        <div className="space-y-3 mt-4">
                          {Object.entries(notifications.pushNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => setNotifications({
                                    ...notifications,
                                    pushNotifications: {
                                      ...notifications.pushNotifications,
                                      [key]: e.target.checked
                                    }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900">SMS Notifications</h4>
                        <div className="space-y-3 mt-4">
                          {Object.entries(notifications.smsNotifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => setNotifications({
                                    ...notifications,
                                    smsNotifications: {
                                      ...notifications.smsNotifications,
                                      [key]: e.target.checked
                                    }
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={handleNotificationSave}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Save Notification Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {settingsTab === 'security' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">Account Security</h4>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.twoFactorAuth}
                              onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Login Alerts</p>
                            <p className="text-xs text-gray-500">Get notified when someone logs into your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.loginAlerts}
                              onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Password & Sessions</h4>
                        
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Change Password</p>
                                <p className="text-xs text-gray-500">Last changed: {security.lastPasswordChange}</p>
                              </div>
                              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Change Password
                              </button>
                            </div>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                                <p className="text-xs text-gray-500">{security.activeSessions} active sessions</p>
                              </div>
                              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Manage Sessions
                              </button>
                            </div>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                                <p className="text-xs text-gray-500">Auto-logout after {security.sessionTimeout} minutes of inactivity</p>
                              </div>
                              <select
                                value={security.sessionTimeout}
                                onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                                className="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                              >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={120}>2 hours</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={handleSecuritySave}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Save Security Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Holiday Mode Settings */}
                  {settingsTab === 'holiday' && (
                    <div className="space-y-6">
                      {/* Holiday Mode Status */}
                      <div className={`p-4 rounded-lg border-2 ${
                        holidayMode.isEnabled 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${
                              holidayMode.isEnabled 
                                ? 'bg-orange-100' 
                                : 'bg-gray-100'
                            }`}>
                              {holidayMode.isEnabled ? (
                                <MoonIcon className="h-6 w-6 text-orange-600" />
                              ) : (
                                <SunIcon className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            <div className="ml-3">
                              <h3 className={`text-lg font-medium ${
                                holidayMode.isEnabled ? 'text-orange-900' : 'text-gray-900'
                              }`}>
                                Holiday Mode {holidayMode.isEnabled ? 'Active' : 'Inactive'}
                              </h3>
                              <p className={`text-sm ${
                                holidayMode.isEnabled ? 'text-orange-700' : 'text-gray-600'
                              }`}>
                                {holidayMode.isEnabled 
                                  ? 'Your products are hidden from customers'
                                  : 'Your products are visible to customers'
                                }
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={holidayMode.isEnabled}
                              onChange={(e) => setHolidayMode({...holidayMode, isEnabled: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      </div>

                      {holidayMode.isEnabled && (
                        <>
                          {/* Holiday Period Settings */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Holiday Period</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                  type="date"
                                  value={holidayMode.startDate}
                                  onChange={(e) => setHolidayMode({...holidayMode, startDate: e.target.value})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                  type="date"
                                  value={holidayMode.endDate}
                                  onChange={(e) => setHolidayMode({...holidayMode, endDate: e.target.value})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Holiday Message */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Holiday Message</label>
                            <textarea
                              rows={3}
                              value={holidayMode.message}
                              onChange={(e) => setHolidayMode({...holidayMode, message: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              placeholder="Enter a message to display to customers during your holiday..."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              This message will be shown to customers when they visit your store during the holiday period.
                            </p>
                          </div>

                          {/* Holiday Options */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Holiday Options</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Hide All Products</p>
                                  <p className="text-xs text-gray-500">Remove all products from customer view during holiday</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={holidayMode.hideProducts}
                                    onChange={(e) => setHolidayMode({...holidayMode, hideProducts: e.target.checked})}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Show Holiday Message</p>
                                  <p className="text-xs text-gray-500">Display your holiday message to customers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={holidayMode.showMessage}
                                    onChange={(e) => setHolidayMode({...holidayMode, showMessage: e.target.checked})}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Auto-Disable After End Date</p>
                                  <p className="text-xs text-gray-500">Automatically turn off holiday mode when the end date is reached</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={holidayMode.autoDisable}
                                    onChange={(e) => setHolidayMode({...holidayMode, autoDisable: e.target.checked})}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Warning Message */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <ul className="list-disc pl-5 space-y-1">
                                    <li>When holiday mode is active, customers cannot place orders</li>
                                    <li>Existing orders will remain in your dashboard</li>
                                    <li>You can manually disable holiday mode at any time</li>
                                    <li>Make sure to set both start and end dates</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Previous Holidays */}
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Previous Holidays</h4>
                        <div className="space-y-3">
                          {holidayMode.previousHolidays.map((holiday) => (
                            <div key={holiday.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {holiday.startDate} - {holiday.endDate}
                                </p>
                                <p className="text-xs text-gray-500">{holiday.message}</p>
                              </div>
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {holiday.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={handleHolidayModeSave}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Save Holiday Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {!['overview', 'products', 'add-product', 'orders', 'statements', 'advertise', 'settings'].includes(activeTab) && (
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

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Product Preview</h3>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Product Images</h4>
                    <div className="space-y-3">
                      {previewProduct.images ? (
                        Array.isArray(previewProduct.images) ? (
                          previewProduct.images.map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${previewProduct.name} ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                          ))
                        ) : (
                          JSON.parse(previewProduct.images).map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${previewProduct.name} ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                          ))
                        )
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg border flex items-center justify-center">
                          <PhotoIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Product Name</h4>
                      <p className="text-lg font-semibold text-gray-900">{previewProduct.name}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{previewProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Price</h4>
                        <p className="text-lg font-semibold text-green-600">UGX {previewProduct.price?.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Stock</h4>
                        <p className="text-lg font-semibold text-gray-900">{previewProduct.stock}</p>
                      </div>
                    </div>

                    {previewProduct.sku && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">SKU</h4>
                        <p className="text-gray-700">{previewProduct.sku}</p>
                      </div>
                    )}

                    {previewProduct.brand && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Brand</h4>
                        <p className="text-gray-700">{previewProduct.brand}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                      <p className="text-gray-700">{previewProduct.category?.name || 'N/A'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Time</h4>
                      <p className="text-gray-700">
                        {previewProduct.deliveryTimeText || `${previewProduct.deliveryTimeDays} day(s)`}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor((previewProduct as any).approvalStatus || (previewProduct as any).status || 'pending')}`}>
                        {((previewProduct as any).approvalStatus || (previewProduct as any).status || 'pending').replace('_', ' ')}
                      </span>
                    </div>

                    {(previewProduct as any).rejectionReason && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Rejection Reason</h4>
                        <p className="text-red-600 text-sm">{previewProduct.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPreviewProduct(null)
                    handleEditProduct(previewProduct)
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Number</label>
                    <p className="mt-1 text-sm text-gray-900">#{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Your Share (90%)</label>
                    <p className="mt-1 text-sm text-green-600 font-medium">{formatCurrency(selectedOrder.total * 0.90)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="flex space-x-2">
                    {selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? (
                      <>
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrder.id, 'READY_TO_SHIP')
                            setShowOrderModal(false)
                          }}
                          disabled={updatingStatus === selectedOrder.id}
                          className="text-green-600 hover:text-green-900 text-sm px-3 py-1 border border-green-300 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === selectedOrder.id ? 'Updating...' : 'Mark as Ready to Ship'}
                        </button>
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrder.id, 'CANCELLED')
                            setShowOrderModal(false)
                          }}
                          disabled={updatingStatus === selectedOrder.id}
                          className="text-red-600 hover:text-red-900 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === selectedOrder.id ? 'Updating...' : 'Cancel Order'}
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No actions available for this order status
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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


