'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

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

// Function to get category image based on name
const getCategoryImage = (categoryName: string): string => {
  const imageMap: { [key: string]: string } = {
    // Production categories (matching actual database)
    'Audio & Headphones': '/images/Headphones.avif',
    'Automotive': '/images/Automotives.jpg',
    'Baby Care': '/images/Baby care.avif',
    'Bags & Luggage': '/images/luggage.jpg',
    'Bedding & Bath': '/images/Beddings.avif',
    'Books & Media': '/images/Books.avif',
    'Cameras & Photography': '/images/camera.avif',
    'Eyewear': '/images/Eyeware1.jpg',
    'Fragrance': '/images/fragances.avif',
    'Furniture': '/images/Funiture.jpg',
    'Gaming': '/images/games.jpg',
    'Garden & Outdoor': '/images/garden.jpg',
    'Groceries': '/images/grocery.jpg',
    'Haircare': '/images/Hair-care.jpg',
    'Health & Wellness': '/images/Health.jpg',
    'Home Decor': '/images/Funiture.jpg',
    'Jewelry': '/images/fragances.avif',
    'Kids Fashion': '/images/Kids-fashion.jpg',
    'Kitchen Appliances': '/images/machines.jpg',
    'Laptops & Computers': '/images/Lapptops and computers.jpg',
    'Lighting': '/images/lighting.jpg',
    'Makeup': '/images/Makeup.jpg',
    'Men\'s Fashion': '/images/mens fashion.avif',
    'Mobiles and Accessories': '/images/Mobile phones.jpg',
    'Mobile phones': '/images/Mobile phones.jpg',
    'Outdoor & Camping': '/images/Automotives.avif',
    'Personal Care': '/images/Personal-care.jpg',
    'Pet Supplies': '/images/Pet-supplies.jpg',
    'Power Banks & Chargers': '/images/power bank.jpg',
    'Skincare': '/images/Skin-care.jpg',
    'Sports & Fitness': '/images/wearables.avif',
    'Stationery & Office': '/images/Books.avif',
    'Storage & Organization': '/images/Storage & organisation.jpg',
    'Tablets': '/images/Tablet.jpg',
    'Tools & Hardware': '/images/machines.jpg',
    'Toys & Games': '/images/Toys and games.jpg',
    'TVs & Accessories': '/images/lg-uhd-tv.jpg.jpg',
    'Watches': '/images/watch.avif',
    'Wearables': '/images/wearables.avif',
    'Women\'s Fashion': '/images/womens fashion.avif',
    
    // Legacy mappings for backward compatibility
    'Electronics': '/images/Electronics.jpg',
    'Fashion': '/images/Fashion.avif',
    'Beauty & Health': '/images/Beauty1.jpg',
    'Home & Kitchen': '/images/machines.jpg',
    'Baby care': '/images/Baby care.avif',
    'Bags and Luggage': '/images/luggage.avif',
    'Camera & Photography': '/images/camera.avif',
    'Camera': '/images/camera.avif',
    'Photography': '/images/camera.avif',
    'Eyeware': '/images/Eyeware1.jpg',
    'Laptops and computers': '/images/Lapptops and computers.jpg',
    'Machines': '/images/machines.jpg',
    'Mobiles': '/images/Mobile phones.jpg',
    'Gaming Consoles': '/images/gaming consoles.avif',
    'Laptops': '/images/laptops.avif',
    'Televisions': '/images/lg-uhd-tv.jpg.jpg',
    'Cameras': '/images/camera.avif',
    'Gaming Accessories': '/images/gaming consoles.avif',
    'Games': '/images/games.avif',
    'Projectors': '/images/lg-uhd-tv.jpg.jpg',
    'Beauty': '/images/fragances.avif',
    'Health': '/images/fragances.avif',
    'Sports': '/images/wearables.avif',
    'Books': '/images/Books.avif',
    'Headphones & Earphones': '/images/Headphone and earphones.avif',
    'Luggage': '/images/luggage.avif',
    'Beddings': '/images/Beddings.avif',
    'Beddings & Bath': '/images/Beddings.avif'
  }
  
  return imageMap[categoryName] || '/images/Electronics.jpg'
}

// Function to normalize/display category names
const getCategoryDisplayName = (categoryName: string): string => {
  const nameMap: { [key: string]: string } = {
    'Mobile phones': 'Mobiles and Accessories'
  }
  // Debug: log the category name to see what we're getting
  if (categoryName.includes('Mobile') || categoryName.includes('phone')) {
    console.log('Category name:', categoryName, 'Mapped to:', nameMap[categoryName] || categoryName)
  }
  return nameMap[categoryName] || categoryName
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        console.error('Error fetching categories:', data.error)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize filtered categories for better performance
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories
    
    return categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  }, [categories, searchTerm])

  // Memoize category image function
  const getCategoryImageMemo = useCallback((categoryName: string) => {
    return getCategoryImage(categoryName)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
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
            <h1 className="text-xl font-bold text-gray-900">Categories</h1>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Bars3Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Bars3Icon className="h-4 w-4 rotate-90" />
                </button>
              </div>
              
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Mobile Search Overlay */}
          {showMobileSearch && (
            <div className="mt-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="mt-2 text-gray-600">
              Browse products by category
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Desktop Search */}
        <div className="hidden lg:block mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {/* Mobile Results Count */}
        <div className="lg:hidden mb-4">
          <p className="text-sm text-gray-600">
            {filteredCategories.length} categories found
          </p>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
            <div className="text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm mt-2">Try adjusting your search</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors touch-manipulation min-h-[48px]"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7' 
              : 'grid-cols-1'
          }`}>
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className={`bg-white rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300 hover:border-gray-300 touch-manipulation ${
                  viewMode === 'grid' 
                    ? 'p-4 lg:p-6' 
                    : 'p-4 flex items-center space-x-4'
                }`}>
                  {/* Category Image */}
                  <div className={`group-hover:scale-110 transition-transform duration-300 ${
                    viewMode === 'grid' 
                      ? 'w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4' 
                      : 'w-16 h-16 flex-shrink-0'
                  }`}>
                    <img
                      src={getCategoryImageMemo(category.name)}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/64/64/Category'
                      }}
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className={`font-semibold text-gray-900 ${
                    viewMode === 'grid' 
                      ? 'text-sm lg:text-lg' 
                      : 'text-lg flex-1 text-left'
                  }`}>
                    {getCategoryDisplayName(category.name)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
