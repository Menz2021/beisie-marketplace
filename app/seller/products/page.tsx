'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discountedPrice?: number
  category: string
  stock: number
  sales?: number
  status: string
  image?: string
  images?: string
  sku?: string
  createdAt: string
  approvalStatus?: string
  isActive?: boolean
}

// Mock product data (fallback)
const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy S23 Ultra',
    price: 4500000,
    originalPrice: 5000000,
    category: 'Mobile Phones',
    stock: 15,
    sales: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    sku: 'SGS23U-256-BLK',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    price: 3500000,
    originalPrice: 4000000,
    category: 'Mobile Phones',
    stock: 8,
    sales: 18,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    sku: 'IP14P-128-GLD',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'MacBook Pro M2',
    price: 8500000,
    originalPrice: 9000000,
    category: 'Laptops',
    stock: 3,
    sales: 12,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    sku: 'MBP-M2-512-SLV',
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    price: 250000,
    originalPrice: 300000,
    category: 'Electronics',
    stock: 0,
    sales: 45,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    sku: 'WH-BT-001',
    createdAt: '2024-01-01'
  }
]

const categories = [
  'All Categories',
  'Electronics',
  'Mobile Phones',
  'Power Banks',
  'Headphones & Earphones',
  'Wearables',
  'Tablets',
  'Gaming',
  'Gaming Laptops',
  'Gaming Accessories',
  'Gaming Monitors',
  'Games',
  'Consoles',
  'Laptops & Computers',
  'TVs & Accessories',
  'Cameras',
  'Home & Kitchen',
  'Baby Care',
  'Beauty & Health',
  'Makeup',
  'Fragrance',
  'Skincare',
  'Haircare',
  'Grooming',
  'Hair Styling Tools',
  'Groceries',
  'Furniture',
  'Eyewear',
  'Watches',
  'Sports & Fitness',
  'Automotive',
  'Stationery',
  'Fashion',
  "Men's Fashion",
  "Women's Fashion",
  "Kids Fashion",
  'Books & Media'
]

export default function SellerProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch seller products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/seller/products', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.success) {
          // Transform the data to match our interface
          const transformedProducts = data.data.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discountedPrice: product.discountedPrice,
            category: product.category?.name || 'Uncategorized',
            stock: product.stock,
            sales: 0, // We'll add sales tracking later
            status: product.isActive ? 'active' : 'inactive',
            image: product.images ? JSON.parse(product.images)[0] : '/api/placeholder/300/300/Product',
            images: product.images,
            sku: product.sku,
            createdAt: new Date(product.createdAt).toLocaleDateString(),
            approvalStatus: product.approvalStatus,
            isActive: product.isActive
          }))
          setProducts(transformedProducts)
        } else {
          console.error('Failed to fetch products:', data.error)
          toast.error('Failed to load products')
          // Use mock data as fallback
          setProducts(mockProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
        // Use mock data as fallback
        setProducts(mockProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
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
      case 'active': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getProductImage = (product: Product) => {
    if (product.image && !product.image.startsWith('/api/placeholder')) {
      return product.image
    }
    if (product.images) {
      try {
        const images = JSON.parse(product.images)
        if (images.length > 0 && !images[0].startsWith('/api/placeholder')) {
          return images[0]
        }
      } catch {
        // Fallback to placeholder
      }
    }
    return '/api/placeholder/300/300/Product'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <Link
            href="/seller/products/add"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="All Status">All Status</option>
                    <option value="active">Active</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Added {product.createdAt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Product"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/seller/products/edit/${product.id}`}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`${
                            product.status === 'active' 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {product.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
