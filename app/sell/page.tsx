'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircleIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function SellOnBeisiePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessAddress: '',
    city: '',
    district: '',
    businessDescription: '',
    website: '',
    yearsInBusiness: '',
    productCategories: [] as string[],
    monthlyRevenue: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const businessTypes = [
    'Individual Seller',
    'Small Business (1-10 employees)',
    'Medium Business (11-50 employees)',
    'Large Business (50+ employees)',
    'Manufacturer',
    'Distributor',
    'Retailer'
  ]

  const categories = [
    'Electronics',
    'Mobile Phones',
    'Power Banks',
    'Headphones & Earphones',
    'Wearables',
    'Tablets',
    'Gaming',
    'Gaming Laptops',
    'Gaming Accessories',
    'Gaming Monitors',
    'Games',
    'Consoles',
    'Laptops & Computers',
    'TVs & Accessories',
    'Cameras',
    'Home & Kitchen',
    'Baby Care',
    'Beauty & Health',
    'Makeup',
    'Fragrance',
    'Skincare',
    'Haircare',
    'Grooming',
    'Hair Styling Tools',
    'Groceries',
    'Furniture',
    'Eyewear',
    'Watches',
    'Sports & Fitness',
    'Automotive',
    'Stationery',
    'Fashion',
    "Men's Fashion",
    "Women's Fashion",
    "Kids Fashion",
    'Books & Media'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare data for API call
      const registrationData = {
        name: formData.contactPerson,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        businessType: formData.businessType,
        district: formData.district,
        address: formData.businessAddress
      }

      const response = await fetch('/api/sellers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Application submitted successfully! We will review your application and get back to you within 24 hours.')
        // Clear form
        setFormData({
          businessName: '',
          businessType: '',
          contactPerson: '',
          email: '',
          phone: '',
          businessAddress: '',
          city: '',
          district: '',
          businessDescription: '',
          website: '',
          yearsInBusiness: '',
          productCategories: [],
          monthlyRevenue: '',
          username: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        })
      } else {
        alert(`Registration failed: ${data.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please check your internet connection and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sell on Beisie
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join thousands of successful sellers and grow your business with Uganda's leading marketplace
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center mb-8">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6" />
                <span>500K+ Active Buyers</span>
              </div>
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-6 w-6" />
                <span>10K+ Sellers</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-6 w-6" />
                <span>98% Success Rate</span>
              </div>
            </div>
            
            {/* Sign Up Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-purple-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Sign Up as Seller
              </button>
              <Link
                href="/seller/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-purple-600 transition-colors"
              >
                Already a Seller? Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Sell on Beisie?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to start and grow your online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Shipping
              </h3>
              <p className="text-gray-600">
                Access to our logistics network for fast and reliable delivery across Uganda
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Track your sales, manage inventory, and get insights to grow your business
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Get paid securely with our integrated payment system including Mobile Money
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div id="registration-form" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Become a Seller
              </h2>
              <p className="text-gray-600">
                Fill out the form below to start your seller journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Business Type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+256 700 000 000"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years in Business
                    </label>
                    <select
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Years</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      <option value="Kampala">Kampala</option>
                      <option value="Wakiso">Wakiso</option>
                      <option value="Mukono">Mukono</option>
                      <option value="Jinja">Jinja</option>
                      <option value="Masaka">Masaka</option>
                      <option value="Mbarara">Mbarara</option>
                      <option value="Gulu">Gulu</option>
                      <option value="Lira">Lira</option>
                      <option value="Arua">Arua</option>
                      <option value="Mbale">Mbale</option>
                      <option value="Soroti">Soroti</option>
                      <option value="Kasese">Kasese</option>
                      <option value="Hoima">Hoima</option>
                      <option value="Fort Portal">Fort Portal</option>
                      <option value="Entebbe">Entebbe</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Credentials *</h3>
                <p className="text-sm text-gray-600 mb-4">Create your seller account login details</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Choose a unique username"
                    />
                    <p className="text-xs text-gray-500 mt-1">This will be your seller login username</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Create a strong password"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with letters and numbers</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories *</h3>
                <p className="text-sm text-gray-600 mb-4">Select the categories you plan to sell in</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.productCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Business Details */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      placeholder="Tell us about your business, products, and what makes you unique..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Monthly Revenue
                    </label>
                    <select
                      name="monthlyRevenue"
                      value={formData.monthlyRevenue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Range</option>
                      <option value="0-500k">UGX 0 - 500,000</option>
                      <option value="500k-1m">UGX 500,000 - 1,000,000</option>
                      <option value="1m-5m">UGX 1,000,000 - 5,000,000</option>
                      <option value="5m-10m">UGX 5,000,000 - 10,000,000</option>
                      <option value="10m+">UGX 10,000,000+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                      Privacy Policy
                    </Link>
                    . I understand that my application will be reviewed and I may be contacted for additional information.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.agreeToTerms || formData.productCategories.length === 0 || !formData.username || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                >
                  Submit Application
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  We'll review your application and get back to you within 24 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our successful sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Beisie helped me grow my electronics business by 300% in just 6 months. The platform is easy to use and the support team is amazing."
              </p>
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-sm text-gray-600">Electronics Seller</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The analytics dashboard gives me insights I never had before. I can track what's selling and optimize my inventory accordingly."
              </p>
              <div className="font-semibold text-gray-900">John K.</div>
              <div className="text-sm text-gray-600">Fashion Seller</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Mobile Money integration made payments so much easier for my customers. My sales increased immediately after joining."
              </p>
              <div className="font-semibold text-gray-900">Mary N.</div>
              <div className="text-sm text-gray-600">Home & Kitchen Seller</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
