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
      const user = JSON.parse(userData)
      if (user.role === 'SELLER') {
        router.push('/seller/dashboard')
        return
      }
    }
  }, [router])

  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <ShopByCategory />
      <TrendingProducts />
      <NewArrivals />
      <MobileAppDownload />
    </div>
  )
}
