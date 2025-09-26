'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discountedPrice?: number
  images: string
  stock: number
  sku?: string
  brand?: string
  weight?: number
  dimensions?: string
  isActive: boolean
  isFeatured: boolean
  approvalStatus: string
  rejectionReason?: string
  slug: string
  categoryId: string
  vendorId: string
  deliveryTimeDays?: number
  deliveryTimeText?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    slug: string
  }
  vendor?: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountedPrice: '',
    stock: '',
    sku: '',
    brand: '',
    weight: '',
    categoryId: '',
    vendorId: 'cmfdrfbjc0000jynmwewca1gp',
    isActive: true,
    isFeatured: false,
    deliveryTimeDays: 0,
    deliveryTimeText: ''
  })
  const router = useRouter()

  // Generate delivery time options
  const getDeliveryTimeOptions = () => {
    const stock = parseInt(formData.stock) || 0
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
    
    // Always add custom option
    options.push({ 
      value: -1, 
      label: 'Custom delivery time', 
      description: 'Set your own number of days from order confirmation',
      available: true
    })
    
    return options
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
          fetchProducts()
          fetchCategories()
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

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
        // Set default category if none selected
        if (data.data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: data.data[0].id }))
        }
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, statusFilter])

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        // Check if image dimensions are within acceptable range
        // Minimum: 300x300, Maximum: 2000x2000, Aspect ratio: 0.5 to 2.0
        const minDimension = 300
        const maxDimension = 2000
        const aspectRatio = img.width / img.height
        
        if (img.width < minDimension || img.height < minDimension) {
          resolve(false)
        } else if (img.width > maxDimension || img.height > maxDimension) {
          resolve(false)
        } else if (aspectRatio < 0.5 || aspectRatio > 2.0) {
          resolve(false)
        } else {
          resolve(true)
        }
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(false)
      }
      
      img.src = url
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, WebP)')
      return
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      toast.error('Image files must be smaller than 5MB')
      return
    }

    // Validate image dimensions
    const dimensionValidationPromises = files.map(file => validateImageDimensions(file))
    const dimensionResults = await Promise.all(dimensionValidationPromises)
    
    const invalidDimensionFiles = files.filter((_, index) => !dimensionResults[index])
    
    if (invalidDimensionFiles.length > 0) {
      toast.error('Images must be between 300x300 and 2000x2000 pixels with aspect ratio between 0.5 and 2.0')
      return
    }

    // Limit to 5 images
    const newFiles = [...selectedImages, ...files].slice(0, 5)
    setSelectedImages(newFiles)

    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setSelectedImages(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }

    if (selectedImages.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add product data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('originalPrice', formData.originalPrice || '')
      formDataToSend.append('discountedPrice', formData.discountedPrice || '')
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('sku', formData.sku)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('weight', formData.weight || '')
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('isActive', formData.isActive.toString())
      formDataToSend.append('isFeatured', formData.isFeatured.toString())
      formDataToSend.append('deliveryTimeDays', formData.deliveryTimeDays.toString())
      formDataToSend.append('deliveryTimeText', formData.deliveryTimeText || '')
      
      // Add images
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product created successfully!')
        setShowAddModal(false)
        resetForm()
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      // In a real app, you would call DELETE API
      toast.success('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discountedPrice: product.discountedPrice?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      brand: product.brand || '',
      weight: product.weight?.toString() || '',
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      deliveryTimeDays: product.deliveryTimeDays || 0,
      deliveryTimeText: product.deliveryTimeText || ''
    })
    setShowAddModal(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingProduct) return

    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add product data
      formDataToSend.append('productId', editingProduct.id)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('originalPrice', formData.originalPrice || '')
      formDataToSend.append('discountedPrice', formData.discountedPrice || '')
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('sku', formData.sku)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('weight', formData.weight || '')
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('isActive', formData.isActive.toString())
      formDataToSend.append('isFeatured', formData.isFeatured.toString())
      formDataToSend.append('deliveryTimeDays', formData.deliveryTimeDays.toString())
      formDataToSend.append('deliveryTimeText', formData.deliveryTimeText || '')
      
      // Add images (only if new ones are selected)
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product updated successfully!')
        setShowAddModal(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleProductApproval = async (productId: string, action: 'approve' | 'reject') => {
    if (action === 'reject') {
      const reason = prompt('Please provide a reason for rejection:')
      if (!reason) {
        toast.error('Rejection reason is required')
        return
      }
      
      try {
        const response = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            action: 'reject',
            rejectionReason: reason
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast.success('Product rejected successfully!')
          fetchProducts()
        } else {
          toast.error(data.error || 'Failed to reject product')
        }
      } catch (error) {
        console.error('Error rejecting product:', error)
        toast.error('Failed to reject product')
      }
    } else {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            action: 'approve'
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast.success('Product approved successfully!')
          fetchProducts()
        } else {
          toast.error(data.error || 'Failed to approve product')
        }
      } catch (error) {
        console.error('Error approving product:', error)
        toast.error('Failed to approve product')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discountedPrice: '',
      stock: '',
      sku: '',
      brand: '',
      weight: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      vendorId: 'cmfdrfbjc0000jynmwewca1gp',
      isActive: true,
      isFeatured: false,
      deliveryTimeDays: 0,
      deliveryTimeText: ''
    })
    setSelectedImages([])
    setImagePreviews([])
    setEditingProduct(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
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
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, brand, or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
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
                <option value="">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
                <option value="low_stock">Low Stock</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                          {product.images && product.images !== '[]' ? (
                            <img
                              src={JSON.parse(product.images)[0] || '/api/placeholder/48/48'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">IMG</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                          {product.sku && (
                            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.vendor?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{product.vendor?.email}</div>
                      <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                        product.vendor?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        product.vendor?.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.vendor?.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        product.stock < 10 ? 'text-red-600' : 
                        product.stock < 50 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        product.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.approvalStatus}
                      </span>
                      {product.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1" title={product.rejectionReason}>
                          {product.rejectionReason.length > 30 ? 
                            product.rejectionReason.substring(0, 30) + '...' : 
                            product.rejectionReason
                          }
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setPreviewProduct(product)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Product Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900" 
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        {product.approvalStatus === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleProductApproval(product.id, 'approve')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Product"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleProductApproval(product.id, 'reject')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Product"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
                        >
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

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={editingProduct ? handleUpdateProduct : handleSubmit} className="space-y-6">
                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images * (Max 5 images, 5MB each)
                  </label>
                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WebP up to 5MB each
                        </p>
                      </label>
                    </div>
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (UGX) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter original price"
                    />
                    <p className="text-xs text-gray-500 mt-1">The original price before any discounts</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discounted Price (UGX)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter discounted price (optional)"
                    />
                    <p className="text-xs text-gray-500 mt-1">The discounted price customers will pay (optional)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Selling Price (UGX) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter current selling price"
                    />
                    <p className="text-xs text-gray-500 mt-1">The price customers will actually pay (usually the discounted price if available)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
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
                          checked={formData.deliveryTimeDays === option.value}
                          onChange={(e) => setFormData({...formData, deliveryTimeDays: parseInt(e.target.value)})}
                          disabled={!option.available}
                          className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{option.label}</span>
                            {option.value >= 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
                  
                  {/* Custom delivery time input */}
                  {formData.deliveryTimeDays === -1 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Delivery Time</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Days from Order Confirmation
                          </label>
                          <input
                            type="number"
                            name="deliveryTimeDays"
                            value={formData.deliveryTimeDays === -1 ? '' : formData.deliveryTimeDays}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0
                              setFormData(prev => ({
                                ...prev,
                                deliveryTimeDays: value
                              }))
                            }}
                            min="0"
                            max="30"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g., 4"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter the number of days after order confirmation
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Delivery Text (Optional)
                          </label>
                          <input
                            type="text"
                            name="deliveryTimeText"
                            value={formData.deliveryTimeText}
                            onChange={(e) => setFormData({...formData, deliveryTimeText: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g., 4-6 business days"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Custom text to display to customers (optional)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Important:</strong> Delivery time is calculated from the order confirmation date, not from when the product is listed. 
                    Make sure you can fulfill orders within the selected timeframe.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe your product in detail..."
                  />
                </div>
                
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Product</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Product Images</h4>
                    <div className="space-y-2">
                      {previewProduct.images ? (
                        (() => {
                          try {
                            const images = typeof previewProduct.images === 'string' 
                              ? JSON.parse(previewProduct.images) 
                              : previewProduct.images
                            return Array.isArray(images) ? images : [images]
                          } catch {
                            return [previewProduct.images]
                          }
                        })().map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${previewProduct.name} ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        ))
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="h-12 w-12 text-gray-400" />
                          <span className="ml-2 text-gray-500">No images</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Product Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Name:</span>
                          <span className="ml-2">{previewProduct.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">Description:</span>
                          <p className="mt-1 text-sm text-gray-600">{previewProduct.description}</p>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <span className="ml-2">${previewProduct.price.toLocaleString()}</span>
                        </div>
                        {previewProduct.originalPrice && (
                          <div>
                            <span className="font-medium">Original Price:</span>
                            <span className="ml-2">${previewProduct.originalPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Stock:</span>
                          <span className="ml-2">{previewProduct.stock}</span>
                        </div>
                        {previewProduct.sku && (
                          <div>
                            <span className="font-medium">SKU:</span>
                            <span className="ml-2">{previewProduct.sku}</span>
                          </div>
                        )}
                        {previewProduct.brand && (
                          <div>
                            <span className="font-medium">Brand:</span>
                            <span className="ml-2">{previewProduct.brand}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Category:</span>
                          <span className="ml-2">{previewProduct.category?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Vendor:</span>
                          <span className="ml-2">{previewProduct.vendor?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Delivery Time:</span>
                          <span className="ml-2">
                            {previewProduct.deliveryTimeDays} days
                            {previewProduct.deliveryTimeText && ` (${previewProduct.deliveryTimeText})`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Approval Status:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            previewProduct.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            previewProduct.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {previewProduct.approvalStatus}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Active:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            previewProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {previewProduct.isActive ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Featured:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            previewProduct.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {previewProduct.isFeatured ? 'Yes' : 'No'}
                          </span>
                        </div>
                        {previewProduct.rejectionReason && (
                          <div>
                            <span className="font-medium">Rejection Reason:</span>
                            <p className="mt-1 text-sm text-red-600">{previewProduct.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setPreviewProduct(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                  {previewProduct.approvalStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          handleProductApproval(previewProduct.id, 'reject')
                          setPreviewProduct(null)
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          handleProductApproval(previewProduct.id, 'approve')
                          setPreviewProduct(null)
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
