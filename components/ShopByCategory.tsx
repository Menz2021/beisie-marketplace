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
        // Take first 12 categories for display
        setCategories(data.data.slice(0, 12))
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

  const categoryImages = [
    '/images/Headphones.avif',             // Audio & Headphones
    '/images/Automotives.avif',            // Automotive
    '/images/Baby care.avif',              // Baby care
    '/images/luggage.avif',                // Bags and Luggage
    '/images/Beauty1.jpg',                 // Beauty & Health
    '/images/Beddings.avif',               // Bedding & Bath
    '/images/Books.avif',                  // Books & Media
    '/images/camera.avif',                 // Camera & Photography
    '/images/Electronics.avif',            // Electronics
    '/images/Eyeware1.jpg',                // Eyeware
    '/images/Fashion.avif',                // Fashion
    '/images/fragances.avif',              // Fragrance
    '/images/Mobile phones.avif',          // Mobile phones
    '/images/wearables.avif',              // Wearables
    '/images/Headphone and earphones.avif', // Audio & Headphones
    '/images/Beddings.avif',               // Beddings & Bath
    '/images/Books.avif'                   // Books
  ]

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
                  src={categoryImages[index % categoryImages.length]}
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