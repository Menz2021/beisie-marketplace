'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
}

const districts = [
  'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Masaka', 'Mbarara', 'Gulu', 'Lira',
  'Arua', 'Mbale', 'Soroti', 'Kasese', 'Hoima', 'Fort Portal', 'Entebbe'
]

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    discountedPrice: '',
    categoryId: '',
    brand: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    images: [] as string[],
    isActive: true,
    isFeatured: false,
    tags: '',
    shippingInfo: {
      weight: '',
      dimensions: '',
      shippingClass: 'standard'
    },
    deliveryTimeDays: 0,
    deliveryTimeText: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Fetch categories on component mount
  useEffect(() => {
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
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Generate delivery time options based on stock
  const getDeliveryTimeOptions = () => {
    const stock = parseInt(formData.stock) || 0
    const options = []
    
    // Always show basic options regardless of stock
    options.push({ 
      value: 0, 
      label: 'Same day delivery', 
      description: 'Delivered on the same day order is confirmed (0 days)',
      available: stock > 0
    })
    
    options.push({ 
      value: 1, 
      label: 'Next day delivery', 
      description: 'Delivered 1 day after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 2, 
      label: '2 days delivery', 
      description: 'Delivered 2 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 3, 
      label: '3 days delivery', 
      description: 'Delivered 3 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 5, 
      label: '5 days delivery', 
      description: 'Delivered 5 days after order confirmation',
      available: stock > 0
    })
    
    options.push({ 
      value: 7, 
      label: '1 week delivery', 
      description: 'Delivered 7 days after order confirmation',
      available: stock > 0
    })
    
    // Always add custom option
    options.push({ 
      value: -1, 
      label: 'Custom delivery time', 
      description: 'Set your own number of days from order confirmation',
      available: true
    })
    
    return options
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev] as any
        return {
          ...prev,
          [parent]: {
            ...(parentValue || {}),
            [child]: value
          }
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        // Check if image dimensions are within acceptable range
        // Minimum: 300x300, Maximum: 2000x2000, Aspect ratio: 0.5 to 2.0
        const minDimension = 300
        const maxDimension = 2000
        const aspectRatio = img.width / img.height
        
        if (img.width < minDimension || img.height < minDimension) {
          resolve(false)
        } else if (img.width > maxDimension || img.height > maxDimension) {
          resolve(false)
        } else if (aspectRatio < 0.5 || aspectRatio > 2.0) {
          resolve(false)
        } else {
          resolve(true)
        }
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(false)
      }
      
      img.src = url
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      alert('Please select only image files (JPEG, PNG, WebP)')
      return
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert('Image files must be smaller than 5MB')
      return
    }

    // Validate image dimensions
    const dimensionValidationPromises = fileArray.map(file => validateImageDimensions(file))
    const dimensionResults = await Promise.all(dimensionValidationPromises)
    
    const invalidDimensionFiles = fileArray.filter((_, index) => !dimensionResults[index])
    
    if (invalidDimensionFiles.length > 0) {
      alert('Images must be between 300x300 and 2000x2000 pixels with aspect ratio between 0.5 and 2.0')
      return
    }

    // Limit to 5 images
    const currentImageCount = formData.images.length
    const newFiles = fileArray.slice(0, 5 - currentImageCount)
    
    if (newFiles.length === 0) {
      alert('Maximum 5 images allowed')
      return
    }

    const imageUrls = newFiles.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Get seller ID from localStorage or session
      const sellerSession = localStorage.getItem('seller_session')
      if (!sellerSession) {
        alert('Please log in to add products')
        return
      }
      
      const seller = JSON.parse(sellerSession)
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add product data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('originalPrice', formData.originalPrice || '')
      formDataToSend.append('discountedPrice', formData.discountedPrice || '')
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('vendorId', seller.id)
      formDataToSend.append('deliveryTimeDays', formData.deliveryTimeDays.toString())
      formDataToSend.append('sku', formData.sku || '')
      formDataToSend.append('brand', formData.brand || '')
      formDataToSend.append('deliveryTimeText', formData.deliveryTimeText || '')
      formDataToSend.append('isActive', 'true')
      formDataToSend.append('isFeatured', 'false')
      
      // Add images (for now, we'll use placeholder images)
      // In a real app, you'd handle file uploads here
      formDataToSend.append('images', new Blob(['placeholder'], { type: 'image/jpeg' }))

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        alert('Product added successfully and submitted for approval!')
        // Redirect to products page
        window.location.href = '/seller/products'
      } else {
        alert(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('An error occurred while adding the product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/seller/products"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">Create a new product listing</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Basic Info', active: currentStep >= 1 },
              { number: 2, title: 'Details', active: currentStep >= 2 },
              { number: 3, title: 'Images & Settings', active: currentStep >= 3 }
            ].map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.active 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.active ? '✓' : step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.active ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step.active ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of the product"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoadingCategories}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">
                      {isLoadingCategories ? 'Loading categories...' : 'Select Category'}
                    </option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Product SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Delivery Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (Days from Order Confirmation) *
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Select how many days after an order is confirmed the product will be delivered. 
                  This is calculated from the order confirmation date, not from when the product is listed.
                </p>
                <div className="space-y-3">
                  {getDeliveryTimeOptions().map((option) => (
                    <label 
                      key={option.value} 
                      className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        option.available 
                          ? 'border-gray-200 hover:bg-gray-50' 
                          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryTimeDays"
                        value={option.value}
                        checked={formData.deliveryTimeDays === option.value}
                        onChange={handleInputChange}
                        disabled={!option.available}
                        className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{option.label}</span>
                          {option.value >= 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {option.value} day{option.value !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                        {!option.available && (
                          <div className="text-xs text-red-500 mt-1">Requires stock &gt; 0</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Custom delivery time input */}
                {formData.deliveryTimeDays === -1 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Delivery Time</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Days from Order Confirmation
                        </label>
                        <input
                          type="number"
                          name="deliveryTimeDays"
                          value={formData.deliveryTimeDays === -1 ? '' : formData.deliveryTimeDays}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            setFormData(prev => ({
                              ...prev,
                              deliveryTimeDays: value
                            }))
                          }}
                          min="0"
                          max="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 4"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the number of days after order confirmation
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Delivery Text (Optional)
                        </label>
                        <input
                          type="text"
                          name="deliveryTimeText"
                          value={formData.deliveryTimeText}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 4-6 business days"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Custom text to display to customers (optional)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Important:</strong> Delivery time is calculated from the order confirmation date, not from when the product is listed. 
                  Make sure you can fulfill orders within the selected timeframe.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Pricing and Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (UGX) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter original price"
                  />
                  <p className="text-xs text-gray-500 mt-1">The original price before any discounts</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price (UGX)
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter discounted price (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">The discounted price customers will pay (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Selling Price (UGX) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter current selling price"
                  />
                  <p className="text-xs text-gray-500 mt-1">The price customers will actually pay (usually the discounted price if available)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Detailed product description, features, specifications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-gray-500 mt-1">Help customers find your product with relevant tags</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images and Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Images & Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload product images
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Settings</h3>
                
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Product is active and visible to customers
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Feature this product (appears in featured sections)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
