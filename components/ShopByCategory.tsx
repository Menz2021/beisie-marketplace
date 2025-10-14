'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
}

export function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      console.log('Categories API response:', data) // Debug log
      
      if (data.success) {
        // Take first 16 categories for display to ensure Mobile Phones is included
        const categoriesToShow = data.data.slice(0, 16)
        console.log('Categories to show:', categoriesToShow) // Debug log
        setCategories(categoriesToShow)
      } else {
        console.error('API returned error:', data.error)
        // Fallback to static categories if API fails
        setCategories(getStaticCategories())
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to static categories if API fails
      setCategories(getStaticCategories())
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback static categories
  const getStaticCategories = () => [
    { id: '1', name: 'Electronics', slug: 'electronics', isActive: true },
    { id: '2', name: 'Mobiles and Accessories', slug: 'mobile-phones', isActive: true },
    { id: '3', name: 'Laptops & Computers', slug: 'laptops-computers', isActive: true },
    { id: '4', name: 'Fashion', slug: 'fashion', isActive: true },
    { id: '5', name: 'Beauty & Health', slug: 'beauty-health', isActive: true },
    { id: '6', name: 'Home & Kitchen', slug: 'home-kitchen', isActive: true },
    { id: '7', name: 'Sports & Fitness', slug: 'sports-fitness', isActive: true },
    { id: '8', name: 'Books & Media', slug: 'books-media', isActive: true },
    { id: '9', name: 'Toys & Games', slug: 'toys-games', isActive: true },
    { id: '10', name: 'Automotive', slug: 'automotive', isActive: true },
    { id: '11', name: 'Watches', slug: 'watches', isActive: true },
    { id: '12', name: 'Audio & Headphones', slug: 'audio-headphones', isActive: true }
  ]

  if (isLoading) {
    return (
      <section className="py-4 sm:py-8 lg:py-12 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-sm lg:text-base text-gray-600">Discover products by category</p>
          </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-2 sm:h-3 lg:h-4 bg-gray-200 rounded w-12 sm:w-16 lg:w-20 mx-auto"></div>
            </div>
          ))}
          </div>
        </div>
      </section>
    )
  }

  // Function to get the appropriate image for each category
  const getCategoryImage = (categoryName: string) => {
    const categoryImageMap: { [key: string]: string } = {
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
      'Gaming': '/images/games.avif',
      'Garden & Outdoor': '/images/garden.jpg',
      'Groceries': '/images/grocery.jpg',
      'Haircare': '/images/Hair-care.jpg',
      'Health & Wellness': '/images/Health.jpg',
      'Home Decor': '/images/Home.jpg',
      'Jewelry': '/images/jewelry.jpg',
      'Kids Fashion': '/images/Fashion.avif',
      'Kitchen Appliances': '/images/machines.jpg',
      'Laptops & Computers': '/images/Lapptops and computers.jpg',
      'Lighting': '/images/Electronics.jpg',
      'Makeup': '/images/fragances.avif',
      'Men\'s Fashion': '/images/mens fashion.avif',
      'Mobiles and Accessories': '/images/Mobile phones.jpg',
      'Outdoor & Camping': '/images/Automotives.avif',
      'Personal Care': '/images/fragances.avif',
      'Pet Supplies': '/images/Toys and games.jpg',
      'Power Banks & Chargers': '/images/power bank.jpg',
      'Skincare': '/images/fragances.avif',
      'Sports & Fitness': '/images/wearables.avif',
      'Stationery & Office': '/images/Books.avif',
      'Storage & Organization': '/images/luggage.jpg',
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
      'Bags and Luggage': '/images/luggage.jpg',
      'Camera & Photography': '/images/camera.avif',
      'Camera': '/images/camera.avif',
      'Photography': '/images/camera.avif',
      'Eyeware': '/images/Eyeware1.jpg',
      'Mobile phones': '/images/Mobile phones.jpg',
      'Laptops and computers': '/images/Lapptops and computers.jpg',
      'Machines': '/images/machines.jpg'
    }
    
    return categoryImageMap[categoryName] || '/images/Electronics.jpg' // Default fallback
  }

  // Removed colored backgrounds for clear circles

  return (
    <section className="py-4 sm:py-8 lg:py-12 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="mt-2 text-sm lg:text-base text-gray-600">Discover products by category</p>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No categories available</p>
            <p className="text-sm text-gray-400 mt-2">Check console for debug information</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group text-center hover:scale-105 transition-transform duration-200 touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full mx-auto mb-2 overflow-hidden group-hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[40px] min-w-[40px]">
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.name}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}