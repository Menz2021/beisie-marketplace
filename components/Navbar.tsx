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
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '@/store/cartStore'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Notifications } from './Notifications'
import { Sidebar } from './Sidebar'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { items } = useCartStore()
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_session')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    // Close user menu when clicking outside or touching outside
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    // Add both click and touch event listeners for better mobile support
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
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
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center h-16">
            {/* Sidebar Toggle & Logo */}
            <div className="flex items-center">
              {/* Sidebar Toggle Button - Show on all pages */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Beisie</span>
              </Link>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl mx-8">
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

            {/* Right side icons - Desktop */}
            <div className="flex items-center space-x-6">
              {/* Language/Country Selector */}
              <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
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
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-medium mt-1">Account</span>
                  </button>
                  
                  {/* User Dropdown Menu - Desktop */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingBagIcon className="h-4 w-4 mr-3 text-gray-400" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                  <UserIcon className="h-6 w-6" />
                  <span className="text-xs font-medium mt-1">Account</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                <HeartIcon className="h-6 w-6" />
                <span className="text-xs font-medium mt-1">Wishlist</span>
              </Link>

              {/* Cart */}
              {user ? (
                <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="text-xs font-medium mt-1">Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              ) : (
                <Link href="/auth/login?redirect=/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="text-xs font-medium mt-1">Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Top row: Sidebar toggle, Logo, and Right icons */}
            <div className="flex justify-between items-center h-12">
              {/* Left side: Sidebar toggle and Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                
                <Link href="/" className="flex items-center">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Beisie</span>
                </Link>
              </div>

              {/* Right side: Account, Wishlist, Cart */}
              <div className="flex items-center space-x-4">
                {/* Account */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center justify-center p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
                    >
                      <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>
                    
                    {/* User Dropdown Menu - Mobile Optimized */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBagIcon className="h-4 w-4 mr-3 text-gray-400" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login" className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <UserIcon className="h-5 w-5" />
              </Link>
                )}

                {/* Wishlist */}
                <Link href="/wishlist" className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <HeartIcon className="h-5 w-5" />
                </Link>

                {/* Cart */}
                {user ? (
                  <Link href="/cart" className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                    </Link>
                ) : (
                  <Link href="/auth/login?redirect=/cart" className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                    </Link>
                )}
              </div>
            </div>

            {/* Bottom row: Search Bar */}
            <div className="pb-3">
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
          </div>

        </div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  )
}
