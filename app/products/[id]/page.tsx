'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import { RelatedProducts } from '@/components/RelatedProducts'
import { ReviewForm } from '@/components/ReviewForm'
import { ReviewList } from '@/components/ReviewList'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string | string[]
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
  deliveryTimeDays?: number
  deliveryTimeText?: string
  specifications?: string
  createdAt: string
  updatedAt: string
  averageRating?: number
  totalReviews?: number
  discount?: number
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
    businessName?: string
  }
  reviews?: {
    id: string
    rating: number
    comment?: string
    createdAt: string
    user: {
      name: string
    }
  }[]
}

// Mock product data - in a real app, this would come from API
const mockProduct = {
  id: '1',
  name: 'Samsung Galaxy S23 Ultra',
  price: 4500000,
  originalPrice: 5000000,
  description: 'The Samsung Galaxy S23 Ultra is the ultimate smartphone for power users. Featuring a massive 6.8-inch Dynamic AMOLED 2X display, the S23 Ultra delivers stunning visuals with its 120Hz refresh rate and HDR10+ support. The device is powered by the latest Snapdragon 8 Gen 2 processor, ensuring lightning-fast performance for gaming, multitasking, and productivity.',
  longDescription: `
    <h3>Key Features:</h3>
    <ul>
      <li>6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate</li>
      <li>Snapdragon 8 Gen 2 processor with 12GB RAM</li>
      <li>200MP main camera with 10x optical zoom</li>
      <li>5000mAh battery with 45W fast charging</li>
      <li>IP68 water and dust resistance</li>
      <li>S Pen included for enhanced productivity</li>
    </ul>
    
    <h3>Camera System:</h3>
    <p>The Galaxy S23 Ultra features a revolutionary 200MP main camera that captures incredible detail in any lighting condition. The 10x optical zoom and 100x Space Zoom let you get closer to your subjects than ever before. The Night Mode automatically enhances low-light photos, while the Pro Mode gives you complete control over your photography.</p>
    
    <h3>Performance:</h3>
    <p>Powered by the Snapdragon 8 Gen 2 processor and 12GB of RAM, the S23 Ultra handles everything from intensive gaming to professional video editing with ease. The 256GB of internal storage provides ample space for your apps, photos, and videos.</p>
  `,
  images: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
  ],
  brand: 'Samsung',
  category: 'Mobile Phones',
  stock: 15,
  sku: 'SGS23U-256-BLK',
  weight: 0.234,
  dimensions: { length: 16.3, width: 7.8, height: 0.8 },
  rating: 4.7,
  reviewCount: 128,
  vendor: 'TechStore Uganda',
  vendorId: 'vendor1',
  isNew: true,
  discount: 10,
  specifications: {
    'Display': '6.8" Dynamic AMOLED 2X, 120Hz',
    'Processor': 'Snapdragon 8 Gen 2',
    'RAM': '12GB',
    'Storage': '256GB',
    'Camera': '200MP + 12MP + 10MP + 10MP',
    'Battery': '5000mAh',
    'OS': 'Android 13',
    'Connectivity': '5G, WiFi 6E, Bluetooth 5.3'
  }
}

const mockReviews = [
  {
    id: '1',
    user: 'John Doe',
    rating: 5,
    comment: 'Amazing phone! The camera quality is outstanding and the battery lasts all day. Highly recommended!',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    user: 'Jane Smith',
    rating: 4,
    comment: 'Great phone overall, but the price is quite high. The S Pen is a nice addition for productivity.',
    date: '2024-01-14',
    verified: true
  },
  {
    id: '3',
    user: 'Mike Johnson',
    rating: 5,
    comment: 'The display is absolutely stunning and the performance is top-notch. Worth every penny!',
    date: '2024-01-13',
    verified: false
  }
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productSlug = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [reviews, setReviews] = useState<any[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    if (productSlug) {
      fetchProduct()
    }
  }, [productSlug])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      
      // Check if this is a seller viewing their own product
      const urlParams = new URLSearchParams(window.location.search)
      const vendorId = urlParams.get('vendorId')
      
      let apiUrl = `/api/products/${productSlug}`
      if (vendorId) {
        // Use seller-specific API for seller products
        apiUrl = `/api/seller/products/${productSlug}?vendorId=${vendorId}`
      }
      
      // Try to fetch from API first
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (data.success && data.product) {
        setProduct(data.product)
        setReviews(data.product.reviews || [])
      } else {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data')
        const mockProductData: Product = {
          id: mockProduct.id,
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          originalPrice: mockProduct.originalPrice,
          images: mockProduct.images,
          stock: mockProduct.stock,
          sku: mockProduct.sku,
          brand: mockProduct.brand,
          weight: mockProduct.weight,
          dimensions: `${mockProduct.dimensions.length} × ${mockProduct.dimensions.width} × ${mockProduct.dimensions.height} cm`,
          isActive: true,
          isFeatured: mockProduct.isNew,
          approvalStatus: 'approved',
          slug: 'samsung-galaxy-s23-ultra',
          categoryId: '1',
          vendorId: mockProduct.vendorId,
          deliveryTimeDays: 1,
          deliveryTimeText: 'Next day delivery',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          averageRating: mockProduct.rating,
          totalReviews: mockProduct.reviewCount,
          discount: mockProduct.discount,
          category: {
            id: '1',
            name: mockProduct.category,
            slug: 'mobile-phones'
          },
          vendor: {
            id: mockProduct.vendorId,
            name: mockProduct.vendor,
            email: 'vendor@techstore.ug',
            role: 'vendor'
          }
        }
        setProduct(mockProductData)
        setReviews(mockReviews)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      // Use mock data as fallback
      const mockProductData: Product = {
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        originalPrice: mockProduct.originalPrice,
        images: mockProduct.images,
        stock: mockProduct.stock,
        sku: mockProduct.sku,
        brand: mockProduct.brand,
        weight: mockProduct.weight,
        dimensions: `${mockProduct.dimensions.length} × ${mockProduct.dimensions.width} × ${mockProduct.dimensions.height} cm`,
        isActive: true,
        isFeatured: mockProduct.isNew,
        approvalStatus: 'approved',
          slug: 'samsung-galaxy-s23-ultra',
          categoryId: '1',
          vendorId: mockProduct.vendorId,
          deliveryTimeDays: 1,
          deliveryTimeText: 'Next day delivery',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          averageRating: mockProduct.rating,
          totalReviews: mockProduct.reviewCount,
          discount: mockProduct.discount,
        category: {
          id: '1',
          name: mockProduct.category,
          slug: 'mobile-phones'
        },
        vendor: {
          id: mockProduct.vendorId,
          name: mockProduct.vendor,
          email: 'vendor@techstore.ug',
          role: 'vendor'
        }
        }
        setProduct(mockProductData)
        setReviews(mockReviews)
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

  const getDeliveryTimeText = (product: Product) => {
    if (product.deliveryTimeText) {
      return product.deliveryTimeText
    }
    
    const days = product.deliveryTimeDays || 0
    
    if (days === 0) {
      return 'Same day delivery'
    } else if (days === 1) {
      return 'Next day delivery'
    } else {
      return `${days} days delivery`
    }
  }

  const getDeliveryDate = (product: Product) => {
    const days = product.deliveryTimeDays || 0
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + days)
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getProductImages = (images: string | string[] | undefined): string[] => {
    if (!images) return ['/api/placeholder/600/600']
    if (Array.isArray(images)) return images
    try {
      return JSON.parse(images)
    } catch {
      return [images]
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    const productImages = getProductImages(product.images)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0] || '/api/placeholder/200/200',
      vendorId: product.vendorId
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout page
    router.push('/checkout')
  }

  const handleReviewSubmitted = () => {
    // Refresh the product data to get updated reviews
    fetchProduct()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const productImages = getProductImages(product.images)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/products" className="flex items-center hover:text-gray-700">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.slug}`} className="hover:text-gray-700">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {product.vendor && (
                  <span className="text-sm text-gray-600">{product.vendor.businessName || (product.vendor.role === 'ADMIN' ? 'Beisie' : product.vendor.name)}</span>
                )}
                {product.isFeatured && (
                  <span className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
                {product.stock > 0 && (
                  <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    In Stock
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {product.brand && (
              <p className="text-lg text-gray-600 mb-2">{product.brand}</p>
            )}

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageRating} ({product.totalReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600 font-medium">
                  {getDeliveryTimeText(product)}
                </span>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estimated delivery:</strong> {getDeliveryDate(product)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Delivery time is calculated from order confirmation date
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary btn-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 btn-secondary btn-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free delivery on orders over UGX 100,000</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">1 year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShareIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Share this product</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'description', name: 'Description' },
                { id: 'specifications', name: 'Specifications' },
                { id: 'reviews', name: `Reviews (${product.totalReviews})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: mockProduct.longDescription }}
              />
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                  {(() => {
                    // Parse specifications from product data or use mock data as fallback
                    let specifications = {}
                    if (product.specifications) {
                      try {
                        specifications = JSON.parse(product.specifications)
                      } catch (e) {
                        console.error('Error parsing specifications:', e)
                        specifications = mockProduct.specifications
                      }
                    } else {
                      specifications = mockProduct.specifications
                    }
                    
                    return Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium text-gray-900">{String(value)}</span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">SKU</span>
                    <span className="font-medium text-gray-900">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium text-gray-900">{product.weight} kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium text-gray-900">{product.dimensions}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{product.averageRating || 0}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{product.totalReviews || 0} reviews</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-2">{rating}</span>
                            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <ReviewForm 
                productSlug={product.slug} 
                onReviewSubmitted={handleReviewSubmitted}
              />

              {/* Reviews List */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h4>
                <ReviewList productSlug={product.slug} />
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <RelatedProducts productSlug={product.slug} limit={6} />
        </div>
      </div>
    </div>
  )
}
