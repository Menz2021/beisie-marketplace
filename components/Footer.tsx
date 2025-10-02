'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Footer() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  useEffect(() => {
    // Check if any user is logged in (admin, seller, or regular user)
    const adminSession = localStorage.getItem('admin_session')
    const userSession = localStorage.getItem('user_session')
    const isLoggedIn = !!(adminSession || userSession)
    setIsUserLoggedIn(isLoggedIn)
  }, [])
  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg sm:text-xl">B</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">Beisie</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              Your premier marketplace in Uganda. Shop with confidence and convenience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721v8.562h8.558V7.707z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation">
                <span className="sr-only">YouTube</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Sell on Beisie
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Contact Us
                </Link>
              </li>
              {!isUserLoggedIn && (
                <li>
                  <Link 
                    href="/admin/login" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation"
                  >
                    Admin Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1 touch-manipulation">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">We Accept</h3>
            <div className="space-y-4">
              {/* Credit/Debit Cards */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Cards</p>
                <div className="flex space-x-2">
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">MC</span>
                  </div>
                </div>
              </div>
              
              {/* Mobile Money */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Mobile Money</p>
                <div className="flex space-x-2">
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">MTN</span>
                  </div>
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">Airtel</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/contact" 
                className="inline-flex items-center text-purple-400 hover:text-white transition-colors text-sm font-medium py-2 touch-manipulation"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Beisie. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm touch-manipulation">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm touch-manipulation">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
