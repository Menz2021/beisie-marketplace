'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  MinusIcon
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
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { addItem, updateQuantity, items } = useCartStore()

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
      { id: '2', name: 'Mobiles and Accessories', slug: 'mobile-phones', description: 'Smartphones and mobile accessories', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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

  const handleAddToCart = useCallback((product: Product) => {
    const productImages = product.images ? JSON.parse(product.images) : []
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0] || '/api/placeholder/200/200',
      vendorId: product.vendorId || 'unknown'
    })
    toast.success(`${product.name} added to cart!`)
  }, [addItem])

  const handleUpdateQuantity = useCallback((product: Product, newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }, [updateQuantity])

  const getCartQuantity = useCallback((productId: string) => {
    const cartItem = items.find(item => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }, [items])

  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.id === productId)
  }, [items])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseInt(priceRange.max))
    
    return matchesSearch && matchesPrice
  })
  }, [products, searchTerm, priceRange])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
  }, [filteredProducts, sortBy])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }, [])

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
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/categories"
                className="flex items-center text-gray-600 hover:text-gray-900 touch-manipulation min-h-[40px] min-w-[40px] justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">{category.name}</h1>
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Mobile Search removed for cleaner look */}
        </div>
      </div>

      {/* Hero Image for Mobile and Accessories - Now positioned after header */}
      {slug === 'mobile-phones' && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <Image
            src="/images/iphone-17.jpg"
            alt="iPhone 17 - Latest Mobile Technology"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            quality={85}
          />
        </div>
      )}

      {/* Debug: Current slug */}
      {slug === 'kids-fashion' && (
        <div className="bg-yellow-100 p-2 text-center text-sm">
          Debug: Current slug is "{slug}" - Kids image should show below
        </div>
      )}

      {/* Hero Image for Kids Fashion - Now positioned after header */}
      {(slug === 'kids-fashion' || slug === 'kids_fashion') && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <img
              src="/images/kids.gif"
              alt="Kids Fashion - Adorable Children's Clothing"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Primary image failed, trying fallback');
                e.currentTarget.src = '/kids-test.gif';
              }}
              onLoad={() => console.log('Kids image loaded successfully')}
            />
          </div>
        </div>
      )}

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Search Products
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search in this category..."
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base touch-manipulation min-h-[48px]"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base touch-manipulation min-h-[48px]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base touch-manipulation min-h-[48px]"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base touch-manipulation min-h-[48px]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* View Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    View Mode
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setViewMode('grid')
                        setShowMobileFilters(false)
                      }}
                      className={`flex-1 flex items-center justify-center px-3 py-3 rounded-md font-medium text-sm touch-manipulation min-h-[48px] ${
                        viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Squares2X2Icon className="h-4 w-4 mr-2" />
                      Grid
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('list')
                        setShowMobileFilters(false)
                      }}
                      className={`flex-1 flex items-center justify-center px-3 py-3 rounded-md font-medium text-sm touch-manipulation min-h-[48px] ${
                        viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ListBulletIcon className="h-4 w-4 mr-2" />
                      List
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setPriceRange({ min: '', max: '' })
                    setShowMobileFilters(false)
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 touch-manipulation min-h-[48px]"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
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
                {/* Search removed - only in mobile filters overlay */}
                
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
            {/* Mobile Toolbar */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Product count removed */}
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 touch-manipulation min-h-[40px]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ListBulletIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Product count removed */}
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
                <div className="text-gray-500">
                  <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Products will appear here once the database connection is restored</p>
                  <p className="text-xs text-gray-400 mt-2">Category: {category?.name}</p>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-6'
                : 'space-y-3 lg:space-y-4'
              }>
                {sortedProducts.map((product) => {
                  const productImages = product.images ? JSON.parse(product.images) : []
                  const discount = product.originalPrice ? 
                    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={`group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow touch-manipulation ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-32 lg:w-48 flex-shrink-0' : 'aspect-square'}`}>
                        <Image
                          src={productImages[0] || '/api/placeholder/300/300'}
                          alt={product.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes={viewMode === 'list' 
                            ? "(max-width: 1024px) 128px, 192px"
                            : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          }
                          quality={75}
                        />
                        {discount > 0 && (
                          <div className="absolute top-1 lg:top-2 left-1 lg:left-2 bg-red-500 text-white text-xs font-bold px-1 lg:px-2 py-0.5 lg:py-1 rounded">
                            -{discount}%
                          </div>
                        )}
                        <button className="absolute top-1 lg:top-2 right-1 lg:right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center">
                          <HeartIcon className="h-3 lg:h-4 w-3 lg:w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className={`p-2 lg:p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-2">
                          <h3 className="text-xs lg:text-sm font-medium text-gray-900 line-clamp-2">
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
                              <StarIconSolid key={star} className="h-2 lg:h-3 w-2 lg:w-3 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-2 lg:mb-3">
                          <span className="text-sm lg:text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <div className="text-xs lg:text-sm text-gray-500 line-through mt-1">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Shopping Cart Icon */}
                        <div className="flex justify-end">
                          {!isInCart(product.id) ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              className="w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation shadow-sm relative"
                            >
                              <ShoppingCartIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                              <PlusIcon className="h-2 lg:h-3 w-2 lg:w-3 absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-1 py-1 shadow-sm">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const currentQuantity = getCartQuantity(product.id)
                                  if (currentQuantity > 1) {
                                    handleUpdateQuantity(product, currentQuantity - 1)
                                  }
                                }}
                                className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                              >
                                <MinusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                              </button>
                              <span className="text-xs lg:text-sm font-medium text-gray-900 min-w-[20px] text-center">
                                {getCartQuantity(product.id)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const currentQuantity = getCartQuantity(product.id)
                                  handleUpdateQuantity(product, currentQuantity + 1)
                                }}
                                className="w-6 h-6 lg:w-7 lg:h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors duration-200 touch-manipulation"
                              >
                                <PlusIcon className="h-3 lg:h-4 w-3 lg:w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
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
