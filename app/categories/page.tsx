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
    // Production categories (matching actual database)
    'Audio & Headphones': '/images/Headphones.avif',
    'Automotive': '/images/Automotives.avif',
    'Baby Care': '/images/Baby care.avif',
    'Bags & Luggage': '/images/luggage.avif',
    'Bedding & Bath': '/images/Beddings.avif',
    'Books & Media': '/images/Books.avif',
    'Cameras & Photography': '/images/camera.avif',
    'Eyewear': '/images/Eyeware1.jpg',
    'Fragrance': '/images/fragances.avif',
    'Furniture': '/images/Funiture.jpg',
    'Gaming': '/images/games.avif',
    'Garden & Outdoor': '/images/Automotives.avif',
    'Groceries': '/images/Electronics.jpg',
    'Haircare': '/images/fragances.avif',
    'Health & Wellness': '/images/fragances.avif',
    'Home Decor': '/images/Funiture.jpg',
    'Jewelry': '/images/fragances.avif',
    'Kids Fashion': '/images/Fashion.avif',
    'Kitchen Appliances': '/images/machines.jpg',
    'Laptops & Computers': '/images/Lapptops and computers.jpg',
    'Lighting': '/images/Electronics.jpg',
    'Makeup': '/images/fragances.avif',
    'Men\'s Fashion': '/images/mens fashion.avif',
    'Mobile Phones': '/images/Mobile phones.jpg',
    'Outdoor & Camping': '/images/Automotives.avif',
    'Personal Care': '/images/fragances.avif',
    'Pet Supplies': '/images/Toys and games.jpg',
    'Power Banks & Chargers': '/images/power bank.jpg',
    'Skincare': '/images/fragances.avif',
    'Sports & Fitness': '/images/wearables.avif',
    'Stationery & Office': '/images/Books.avif',
    'Storage & Organization': '/images/luggage.avif',
    'Tablets': '/images/Electronics.jpg',
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
    'Mobile phones': '/images/Mobile phones.jpg',
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
