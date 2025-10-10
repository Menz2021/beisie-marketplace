'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface HeroProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string
  mainImage: string
  category: string
  categorySlug?: string
  slug: string
  brand?: string
  stock: number
  vendor?: string
  isFeatured: boolean
  averageRating: number
  totalReviews: number
  discount: number
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
  textColor: string
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHeroProducts()
  }, [])

  const fetchHeroProducts = async () => {
    try {
      const response = await fetch('/api/hero-products?limit=3')
      const data = await response.json()
      
      if (data.success) {
        setHeroProducts(data.data)
      } else {
        console.error('Error fetching hero products:', data.error)
        // Fallback to default banners if API fails
        setHeroProducts([])
      }
    } catch (error) {
      console.error('Error fetching hero products:', error)
      setHeroProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(heroProducts.length, 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(heroProducts.length, 1)) % Math.max(heroProducts.length, 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Fallback banners if no products are available
  const fallbackBanners = [
    {
      id: 'fallback-1',
      title: "Shop the Latest Fashion",
      description: "Discover trending styles for every occasion at unbeatable prices",
      buttonText: "Shop Now",
      buttonLink: "/categories/fashion",
      backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      textColor: "text-white"
    },
    {
      id: 'fallback-2',
      title: "Electronics Sale",
      description: "Up to 30% off on smartphones, laptops, and accessories",
      buttonText: "Explore Deals",
      buttonLink: "/categories/electronics",
      backgroundImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop",
      textColor: "text-white"
    },
    {
      id: 'fallback-3',
      title: "Home & Living",
      description: "Transform your space with our exclusive home collection",
      buttonText: "Shop Collection",
      buttonLink: "/categories/home-kitchen",
      backgroundImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop",
      textColor: "text-white"
    }
  ]

  const banners = heroProducts.length > 0 ? heroProducts : fallbackBanners

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.buttonLink}
            className="w-full h-full flex-shrink-0 relative block cursor-pointer group"
          >
            {/* Background */}
            <div 
              className={`w-full h-full ${
                banner.backgroundImage 
                  ? 'bg-cover bg-center bg-no-repeat' 
                  : 'bg-gray-500'
              } group-hover:scale-105 transition-transform duration-300 ease-in-out`}
              style={banner.backgroundImage ? { backgroundImage: `url(${banner.backgroundImage})` } : {}}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center max-w-2xl px-4 sm:px-8">
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${banner.textColor} group-hover:scale-105 transition-transform duration-300`}>
                    {banner.title}
                  </h1>
                  
                  {/* Product-specific information */}
                  {heroProducts.length > 0 && 'price' in banner && (
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-2">
                        {(banner as any).averageRating > 0 && (
                          <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor((banner as any).averageRating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-white text-sm">
                              ({(banner as any).totalReviews} reviews)
                            </span>
                          </div>
                        )}
                        {(banner as any).discount > 0 && (
                          <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                            -{(banner as any).discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          {formatCurrency(banner.price as number)}
                        </span>
                        {(banner as any).originalPrice && (
                          <span className="text-lg text-gray-300 line-through">
                            {formatCurrency((banner as any).originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Click indicator */}
                  <div className="inline-flex items-center text-white text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    Click to explore
                    <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>

    </div>
  )
}
