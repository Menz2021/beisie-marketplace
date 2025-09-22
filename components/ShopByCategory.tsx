'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
      
      if (data.success) {
        // Take first 16 categories for display to ensure Mobile Phones is included
        const categoriesToShow = data.data.slice(0, 16)
        setCategories(categoriesToShow)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-gray-600">Discover products by category</p>
          </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mx-auto"></div>
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
      'Audio & Headphones': '/images/Headphones.avif',
      'Automotive': '/images/Automotives.avif',
      'Baby care': '/images/Baby care.avif',
      'Bags and Luggage': '/images/luggage.avif',
      'Beauty & Health': '/images/Beauty1.jpg',
      'Bedding & Bath': '/images/Beddings.avif',
      'Books & Media': '/images/Books.avif',
      'Cameras & Photography': '/images/camera.avif',
      'Camera & Photography': '/images/camera.avif',
      'Camera': '/images/camera.avif',
      'Photography': '/images/camera.avif',
      'Electronics': '/images/Electronics.jpg',
      'Eyeware': '/images/Eyeware1.jpg',
      'Fashion': '/images/Fashion.avif',
      'Fragrance': '/images/fragances.avif',
      'Mobile Phones': '/images/Mobile phones.jpg',
      'Mobile phones': '/images/Mobile phones.jpg',
      'Wearables': '/images/wearables.avif',
      'Laptops & Computers': '/images/Lapptops and computers.jpg',
      'Laptops and computers': '/images/Lapptops and computers.jpg',
      'Gaming': '/images/games.avif',
      'Machines': '/images/machines.jpg',
      'Watches': '/images/watch.avif',
      'Home & Kitchen': '/images/machines.jpg',
      'Sports & Fitness': '/images/wearables.avif',
      'Toys & Games': '/images/games.avif',
      'Furniture': '/images/Funiture.jpg',
      'Jewelry': '/images/fragances.avif',
      'Power Banks & Chargers': '/images/power bank.jpg',
      'Tablets': '/images/Electronics.jpg',
      'TVs & Accessories': '/images/lg-uhd-tv.jpg.jpg'
    }
    
    return categoryImageMap[categoryName] || '/images/Electronics.jpg' // Default fallback
  }

  const categoryColors = [
    'bg-blue-100',
    'bg-purple-100', 
    'bg-gray-100',
    'bg-indigo-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-red-100',
    'bg-pink-100'
  ]

  return (
    <section className="py-12 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="mt-2 text-gray-600">Discover products by category</p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group text-center hover:scale-105 transition-transform duration-200"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${categoryColors[index % categoryColors.length]} group-hover:shadow-lg transition-shadow`}>
                <Image
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}