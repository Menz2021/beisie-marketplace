'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
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
  slug: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts()
    }
  }, [slug])

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true)
      
      // Fetch category details and products
      const response = await fetch(`/api/categories/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setCategory(data.category)
        setProducts(data.products || [])
      } else {
        console.error('Error fetching category:', data.error)
        // Fallback to static category data
        const fallbackCategory = getFallbackCategory(slug)
        if (fallbackCategory) {
          setCategory(fallbackCategory)
          setProducts([]) // No products for fallback
        }
      }
    } catch (error) {
      console.error('Error fetching category and products:', error)
      // Fallback to static category data
      const fallbackCategory = getFallbackCategory(slug)
      if (fallbackCategory) {
        setCategory(fallbackCategory)
        setProducts([]) // No products for fallback
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback category data
  const getFallbackCategory = (categorySlug: string) => {
    const fallbackCategories = [
      { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Mobile Phones', slug: 'mobile-phones', description: 'Smartphones and mobile accessories', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Laptops, desktops and computer accessories', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '4', name: 'Fashion', slug: 'fashion', description: 'Clothing and fashion accessories', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '5', name: 'Beauty & Health', slug: 'beauty-health', description: 'Beauty products and health items', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '6', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home and kitchen appliances', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '7', name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports equipment and fitness gear', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '8', name: 'Books & Media', slug: 'books-media', description: 'Books, movies and media', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '9', name: 'Toys & Games', slug: 'toys-games', description: 'Toys and gaming products', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '10', name: 'Automotive', slug: 'automotive', description: 'Car parts and automotive accessories', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '11', name: 'Watches', slug: 'watches', description: 'Watches and timepieces', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '12', name: 'Audio & Headphones', slug: 'audio-headphones', description: 'Audio equipment and headphones', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]
    
    return fallbackCategories.find(cat => cat.slug === categorySlug) || null
  }

  const handleAddToCart = (product: Product) => {
    const productImages = product.images ? JSON.parse(product.images) : []
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0] || '/api/placeholder/200/200',
      vendorId: product.vendorId || 'unknown'
    })
    toast.success(`${product.name} added to cart!`)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseInt(priceRange.max))
    
    return matchesSearch && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumb for subcategories */}
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/" className="text-gray-700 hover:text-purple-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <Link href="/categories" className="ml-1 text-gray-700 hover:text-purple-600 md:ml-2">
                        Categories
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1 text-gray-500 md:ml-2">{category.name}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              {category.description && (
                <p className="mt-2 text-gray-600">{category.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-1"
                >
                  <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search in this category..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setPriceRange({ min: '', max: '' })
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Showing {sortedProducts.length} of {products.length} products
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ListBulletIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-500">
                  <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Products will appear here once the database connection is restored</p>
                  <p className="text-xs text-gray-400 mt-2">Category: {category?.name}</p>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6'
                : 'space-y-4'
              }>
                {sortedProducts.map((product) => {
                  const productImages = product.images ? JSON.parse(product.images) : []
                  const discount = product.originalPrice ? 
                    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                        <img
                          src={productImages[0] || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{discount}%
                          </div>
                        )}
                        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                          <HeartIcon className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-2">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIconSolid key={star} className="h-3 w-3 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through mt-1">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-1" />
                            Add to Cart
                          </button>
                          <Link
                            href={`/products/${product.slug}`}
                            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
