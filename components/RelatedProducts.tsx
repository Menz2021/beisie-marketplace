'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface RelatedProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string
  stock: number
  sku?: string
  brand?: string
  isActive: boolean
  isFeatured: boolean
  approvalStatus: string
  slug: string
  categoryId: string
  vendorId: string
  deliveryTimeDays?: number
  deliveryTimeText?: string
  createdAt: string
  updatedAt: string
  averageRating: number
  totalReviews: number
  discount: number
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

interface RelatedProductsProps {
  productSlug: string
  limit?: number
}

export function RelatedProducts({ productSlug, limit = 6 }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState<{ [key: string]: boolean }>({})
  const { addItem } = useCartStore()

  useEffect(() => {
    if (productSlug) {
      fetchRelatedProducts()
    }
  }, [productSlug])

  const fetchRelatedProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${productSlug}/related?limit=${limit}`)
      const data = await response.json()
      
      if (data.success && data.relatedProducts.length > 0) {
        setRelatedProducts(data.relatedProducts)
      } else {
        // Show mock related products if no real products found
        console.log('No related products found, showing mock data')
        const mockRelatedProducts: RelatedProduct[] = [
          {
            id: '2',
            name: 'iPhone 14 Pro',
            description: 'Latest iPhone with advanced camera system',
            price: 4200000,
            originalPrice: 4500000,
            images: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"]',
            stock: 8,
            sku: 'IP14P-256-BLK',
            brand: 'Apple',
            isActive: true,
            isFeatured: true,
            approvalStatus: 'APPROVED',
            slug: 'iphone-14-pro',
            categoryId: '1',
            vendorId: 'vendor1',
            deliveryTimeDays: 0,
            deliveryTimeText: 'Same day delivery',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.8,
            totalReviews: 95,
            discount: 7,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          },
          {
            id: '3',
            name: 'Samsung Galaxy S22 Ultra',
            description: 'Premium Android smartphone with S Pen',
            price: 3800000,
            originalPrice: 4200000,
            images: '["https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop"]',
            stock: 12,
            sku: 'SGS22U-256-BLK',
            brand: 'Samsung',
            isActive: true,
            isFeatured: false,
            approvalStatus: 'APPROVED',
            slug: 'samsung-galaxy-s22-ultra',
            categoryId: '1',
            vendorId: 'vendor1',
            deliveryTimeDays: 1,
            deliveryTimeText: 'Next day delivery',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.6,
            totalReviews: 78,
            discount: 10,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          },
          {
            id: '4',
            name: 'OnePlus 11 Pro',
            description: 'Flagship killer with fast charging',
            price: 3500000,
            originalPrice: 3800000,
            images: '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]',
            stock: 6,
            sku: 'OP11P-256-BLK',
            brand: 'OnePlus',
            isActive: true,
            isFeatured: true,
            approvalStatus: 'APPROVED',
            slug: 'oneplus-11-pro',
            categoryId: '1',
            vendorId: 'vendor1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.7,
            totalReviews: 52,
            discount: 8,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          },
          {
            id: '5',
            name: 'Google Pixel 7 Pro',
            description: 'Pure Android experience with amazing camera',
            price: 3600000,
            originalPrice: 3900000,
            images: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"]',
            stock: 4,
            sku: 'GP7P-256-BLK',
            brand: 'Google',
            isActive: true,
            isFeatured: false,
            approvalStatus: 'APPROVED',
            slug: 'google-pixel-7-pro',
            categoryId: '1',
            vendorId: 'vendor1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.5,
            totalReviews: 41,
            discount: 8,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          },
          {
            id: '6',
            name: 'Xiaomi 13 Pro',
            description: 'High-end smartphone with Leica camera',
            price: 3200000,
            originalPrice: 3500000,
            images: '["https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop"]',
            stock: 9,
            sku: 'XM13P-256-BLK',
            brand: 'Xiaomi',
            isActive: true,
            isFeatured: true,
            approvalStatus: 'APPROVED',
            slug: 'xiaomi-13-pro',
            categoryId: '1',
            vendorId: 'vendor1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.4,
            totalReviews: 67,
            discount: 9,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          },
          {
            id: '7',
            name: 'Huawei P60 Pro',
            description: 'Premium smartphone with advanced photography',
            price: 3400000,
            originalPrice: 3700000,
            images: '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]',
            stock: 7,
            sku: 'HP60P-256-BLK',
            brand: 'Huawei',
            isActive: true,
            isFeatured: false,
            approvalStatus: 'APPROVED',
            slug: 'huawei-p60-pro',
            categoryId: '1',
            vendorId: 'vendor1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            averageRating: 4.3,
            totalReviews: 33,
            discount: 8,
            category: {
              id: '1',
              name: 'Mobile Phones',
              slug: 'mobile-phones'
            },
            vendor: {
              id: 'vendor1',
              name: 'TechStore Uganda',
              email: 'vendor@techstore.ug',
              role: 'vendor'
            }
          }
        ]
        setRelatedProducts(mockRelatedProducts.slice(0, limit))
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
      // Show mock data on error too
      const mockRelatedProducts: RelatedProduct[] = [
        {
          id: '2',
          name: 'iPhone 14 Pro',
          description: 'Latest iPhone with advanced camera system',
          price: 4200000,
          originalPrice: 4500000,
          images: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"]',
          stock: 8,
          sku: 'IP14P-256-BLK',
          brand: 'Apple',
          isActive: true,
          isFeatured: true,
          approvalStatus: 'APPROVED',
          slug: 'iphone-14-pro',
          categoryId: '1',
          vendorId: 'vendor1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          averageRating: 4.8,
          totalReviews: 95,
          discount: 7,
          category: {
            id: '1',
            name: 'Mobile Phones',
            slug: 'mobile-phones'
          },
          vendor: {
            id: 'vendor1',
            name: 'TechStore Uganda',
            email: 'vendor@techstore.ug',
            role: 'vendor'
          }
        },
        {
          id: '3',
          name: 'Samsung Galaxy S22 Ultra',
          description: 'Premium Android smartphone with S Pen',
          price: 3800000,
          originalPrice: 4200000,
          images: '["https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop"]',
          stock: 12,
          sku: 'SGS22U-256-BLK',
          brand: 'Samsung',
          isActive: true,
          isFeatured: false,
          approvalStatus: 'APPROVED',
          slug: 'samsung-galaxy-s22-ultra',
          categoryId: '1',
          vendorId: 'vendor1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          averageRating: 4.6,
          totalReviews: 78,
          discount: 10,
          category: {
            id: '1',
            name: 'Mobile Phones',
            slug: 'mobile-phones'
          },
          vendor: {
            id: 'vendor1',
            name: 'TechStore Uganda',
            email: 'vendor@techstore.ug',
            role: 'vendor'
          }
        }
      ]
      setRelatedProducts(mockRelatedProducts.slice(0, limit))
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDeliveryTimeText = (product: RelatedProduct) => {
    if (product.deliveryTimeText) {
      return product.deliveryTimeText
    }
    
    const days = product.deliveryTimeDays || 0
    
    if (days === 0) {
      return 'Same day'
    } else if (days === 1) {
      return 'Next day'
    } else {
      return `${days} days`
    }
  }

  const getDeliveryDate = (product: RelatedProduct) => {
    const days = product.deliveryTimeDays || 0
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + days)
    
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getProductImages = (images: string | string[] | undefined): string[] => {
    if (!images) return ['/api/placeholder/300/300']
    if (Array.isArray(images)) return images
    try {
      return JSON.parse(images)
    } catch {
      return [images]
    }
  }

  const handleAddToCart = (product: RelatedProduct) => {
    const productImages = getProductImages(product.images)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0] || '/api/placeholder/200/200',
      vendorId: product.vendorId || 'unknown'
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleFavorite = (productId: string) => {
    setIsFavorite(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">You May Also Like</h3>
      
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="block sm:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {relatedProducts.map((product) => {
            const productImages = getProductImages(product.images)
            const isProductFavorite = isFavorite[product.id] || false

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex-shrink-0 w-48"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={productImages[0] || '/api/placeholder/300/300'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    {isProductFavorite ? (
                      <HeartIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <HeartOutlineIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <Link href={`/products/${product.slug}`}>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h4>
                  </Link>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="mt-2 flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-3 w-3 ${
                            i < (product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.totalReviews || 0})
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {relatedProducts.map((product) => {
          const productImages = getProductImages(product.images)
          const isProductFavorite = isFavorite[product.id] || false

          return (
            <div
              key={product.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={productImages[0] || '/api/placeholder/300/300'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={() => handleToggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isProductFavorite ? (
                    <HeartIcon className="h-4 w-4 text-red-500 fill-current" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                )}
                
                {/* Product Name */}
                <Link href={`/products/${product.slug}`}>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.averageRating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.totalReviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Delivery Time */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TruckIcon className="h-3 w-3 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">
                        {getDeliveryTimeText(product)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      by {getDeliveryDate(product)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <ShoppingCartIcon className="h-3 w-3 mr-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
