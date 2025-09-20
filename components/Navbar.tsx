'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Notifications } from './Notifications'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { items } = useCartStore()
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  const pathname = usePathname()
  const router = useRouter()
  
  // Only show categories on homepage
  const isHomepage = pathname === '/'

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_session')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('user_session')
    localStorage.removeItem('cart-storage')
    localStorage.removeItem('wishlist-storage')
    localStorage.removeItem('user_preferences')
    localStorage.removeItem('recent_searches')
    
    // Reset user state
    setUser(null)
    setShowUserMenu(false)
    
    // Redirect to homepage
    window.location.href = '/'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Beisie</span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </form>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden flex-1 mx-2">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-2 flex items-center hover:bg-gray-50 rounded-r-md"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </form>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Language/Country Selector - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">UG</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Account */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex flex-col items-center text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-purple-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-medium mt-1 hidden sm:block">Account</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium mt-1 hidden sm:block">Account</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs font-medium mt-1 hidden sm:block">Wishlist</span>
              </Link>

              {/* Cart */}
              {user ? (
                <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium mt-1 hidden sm:block">Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              ) : (
                <Link href="/auth/login?redirect=/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium mt-1 hidden sm:block">Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Only show on homepage */}
      {isHomepage && (
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap gap-2 sm:gap-4 lg:gap-8 py-3 overflow-x-auto">
              <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium">
                All Categories
              </Link>
              <Link href="/categories/electronics" className="text-gray-700 hover:text-gray-900 font-medium">
                Electronics
              </Link>
              <div className="relative group">
                <Link href="/categories/mobile-phones" className="text-gray-700 hover:text-gray-900 font-medium">
                  Mobile Phones
                </Link>
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/categories/mobile-phones" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Mobile Phones
                    </Link>
                    <Link href="/categories/power-banks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Power Banks
                    </Link>
                    <Link href="/categories/headphones-earphones" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Headphones & Earphones
                    </Link>
                    <Link href="/categories/wearables" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Wearables
                    </Link>
                    <Link href="/categories/tablets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Tablets
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/categories/laptops-computers" className="text-gray-700 hover:text-gray-900 font-medium">
                Laptops & Computers
              </Link>
              <Link href="/categories/tvs-accessories" className="text-gray-700 hover:text-gray-900 font-medium">
                TVs & Accessories
              </Link>
              <Link href="/categories/cameras" className="text-gray-700 hover:text-gray-900 font-medium">
                Cameras
              </Link>
              <div className="relative group">
                <Link href="/categories/fashion" className="text-gray-700 hover:text-gray-900 font-medium">
                  Fashion
                </Link>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/categories/fashion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Fashion
                    </Link>
                    <Link href="/categories/mens-fashion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Men's Fashion
                    </Link>
                    <Link href="/categories/womens-fashion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Women's Fashion
                    </Link>
                    <Link href="/categories/kids-fashion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Kids Fashion
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <Link href="/categories/beauty-health" className="text-gray-700 hover:text-gray-900 font-medium">
                  Beauty & Health
                </Link>
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/categories/beauty-health" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Beauty & Health
                    </Link>
                    <Link href="/categories/makeup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Makeup
                    </Link>
                    <Link href="/categories/fragrance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Fragrance
                    </Link>
                    <Link href="/categories/skincare" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Skincare
                    </Link>
                    <Link href="/categories/haircare" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Haircare
                    </Link>
                    <Link href="/categories/grooming" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Grooming
                    </Link>
                    <Link href="/categories/hair-styling-tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Hair Styling Tools
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/categories/home-kitchen" className="text-gray-700 hover:text-gray-900 font-medium">
                Home & Kitchen
              </Link>
              <div className="relative group">
                <Link href="/categories/gaming" className="text-gray-700 hover:text-gray-900 font-medium">
                  Gaming
                </Link>
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/categories/gaming" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Gaming
                    </Link>
                    <Link href="/categories/gaming-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Gaming Laptops
                    </Link>
                    <Link href="/categories/gaming-accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Gaming Accessories
                    </Link>
                    <Link href="/categories/gaming-monitors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Gaming Monitors
                    </Link>
                    <Link href="/categories/games" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Games
                    </Link>
                    <Link href="/categories/consoles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Consoles
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/categories/sports-fitness" className="text-gray-700 hover:text-gray-900 font-medium">
                Sports & Fitness
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
