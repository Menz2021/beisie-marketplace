'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  FunnelIcon
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
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
    'Mobiles': '/images/Mobile phones.jpg',
    'Mobile Phones': '/images/Mobile phones.jpg',
    'Gaming': '/images/games.avif',
    'Gaming Consoles': '/images/gaming consoles.avif',
    'Laptops': '/images/laptops.avif',
    'Laptops & Computers': '/images/Lapptops and computers.jpg',
    'Televisions': '/images/lg-uhd-tv.jpg.jpg',
    'TVs & Accessories': '/images/lg-uhd-tv.jpg.jpg',
    'Cameras': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center',
    'Gaming Accessories': '/images/gaming consoles.avif',
    'Games': '/images/games.avif',
    'Projectors': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center',
    'Fashion': '/images/womens fashion.avif',
    'Beauty': '/images/fragances.avif',
    'Beauty & Health': '/images/fragances.avif',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
    'Baby Care': '/images/Baby care.avif',
    'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center',
    'Health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
    'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    'Sports & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
    'Books & Media': '/images/Books.avif',
    'Cameras & Photography': '/images/camera.avif',
    'Camera & Photography': '/images/camera.avif',
    'Furniture': '/images/Funiture.jpg',
    'Jewelry': '/images/fragances.avif',
    'Power Banks & Chargers': '/images/power bank.jpg',
    'Toys & Games': '/images/Toys and games.jpg',
    'Automotive': '/images/Automotives.avif',
    'Watches': '/images/watch.avif',
    'Women\'s Fashion': '/images/womens fashion.avif',
    'Men\'s Fashion': '/images/mens fashion.avif',
    'Wearables': '/images/wearables.avif',
    'Headphones & Earphones': '/images/Headphone and earphones.avif',
    'Audio & Headphones': '/images/Headphone and earphones.avif',
    'Eyewear': '/images/Eyeware.avif',
    'Luggage': '/images/luggage.avif',
    'Bags & Luggage': '/images/Bags and lugage.avif',
    'Machines': '/images/machines.avif',
    'Beddings': '/images/Beddings.avif',
    'Beddings & Bath': '/images/womens fashion.avif'
  }
  
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center'
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="mt-2 text-gray-600">
              Browse products by category
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
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

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                  {/* Category Image */}
                  <div className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={getCategoryImage(category.name)}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
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
