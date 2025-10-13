'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface CategoryBanner {
  id: string
  image: string
  title: string
  description: string
  categorySlug: string
  categoryName: string
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Category banners with your specified images
  const categoryBanners: CategoryBanner[] = [
    {
      id: 'automotive',
      image: '/images/auto1.jpg',
      title: 'Automotive',
      description: 'Discover quality automotive products',
      categorySlug: 'automotive',
      categoryName: 'Automotive'
    },
    {
      id: 'laptops',
      image: '/images/computer.jpg',
      title: 'Laptops & Computers',
      description: 'Powerful laptops and computing solutions',
      categorySlug: 'laptops-computers',
      categoryName: 'Laptops & Computers'
    },
    {
      id: 'electronics',
      image: '/images/computer1.jpg',
      title: 'Electronics',
      description: 'Latest electronic gadgets and devices',
      categorySlug: 'electronics',
      categoryName: 'Electronics'
    },
    {
      id: 'audio',
      image: '/images/earpods.jpg',
      title: 'Audio & Headphones',
      description: 'Premium audio equipment and headphones',
      categorySlug: 'audio-headphones',
      categoryName: 'Audio & Headphones'
    },
    {
      id: 'gaming',
      image: '/images/games1.jpg',
      title: 'Gaming',
      description: 'Gaming accessories and equipment',
      categorySlug: 'gaming',
      categoryName: 'Gaming'
    },
    {
      id: 'kitchen',
      image: '/images/home appliances.jpg',
      title: 'Kitchen Appliances',
      description: 'Modern kitchen appliances for your home',
      categorySlug: 'home-kitchen',
      categoryName: 'Home & Kitchen'
    },
    {
      id: 'mobile',
      image: '/images/phones.jpg',
      title: 'Mobile Phones & Accessories',
      description: 'Latest smartphones and mobile accessories',
      categorySlug: 'mobile-phones',
      categoryName: 'Mobile Phones & Accessories'
    }
  ]

  useEffect(() => {
    setIsLoading(false)
    
    // Auto-slide functionality
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categoryBanners.length)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categoryBanners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categoryBanners.length) % categoryBanners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {categoryBanners.map((banner) => (
          <Link
            key={banner.id}
            href={`/categories/${banner.categorySlug}`}
            className="w-full h-full flex-shrink-0 relative block cursor-pointer group"
          >
            {/* Background Image */}
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                priority={banner.id === categoryBanners[0].id}
                sizes="100vw"
                onError={(e) => {
                  console.error(`Failed to load image: ${banner.image}`, e)
                  // Fallback to a solid color if image fails
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image: ${banner.image}`)
                }}
              />
              
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all z-10"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all z-10"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {categoryBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}