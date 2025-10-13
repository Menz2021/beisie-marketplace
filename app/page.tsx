'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeroCarousel } from '@/components/HeroCarousel'
import { ShopByCategory } from '@/components/ShopByCategory'
import { TrendingProducts } from '@/components/TrendingProducts'
import { NewArrivals } from '@/components/NewArrivals'
import { MobileAppDownload } from '@/components/MobileAppDownload'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is a seller and redirect to seller dashboard
    const userData = localStorage.getItem('user_session')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.role === 'SELLER') {
          // Verify the session is still valid before redirecting
          fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include'
          })
          .then(response => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Session invalid')
          })
          .then(data => {
            if (data.user && data.user.role === 'SELLER') {
              router.push('/seller/dashboard')
            } else {
              // User is not a seller or session is invalid, clear localStorage
              localStorage.removeItem('user_session')
            }
          })
          .catch(() => {
            // Session is invalid, clear localStorage and stay on home page
            localStorage.removeItem('user_session')
          })
          return
        }
      } catch (error) {
        // Invalid JSON in localStorage, clear it
        localStorage.removeItem('user_session')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-transparent">
      <HeroCarousel />
      <ShopByCategory />
      <TrendingProducts />
      <NewArrivals />
      <MobileAppDownload />
    </div>
  )
}
