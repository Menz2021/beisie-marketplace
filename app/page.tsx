import { HeroCarousel } from '@/components/HeroCarousel'
import { ShopByCategory } from '@/components/ShopByCategory'
import { TrendingProducts } from '@/components/TrendingProducts'
import { NewArrivals } from '@/components/NewArrivals'
import { MobileAppDownload } from '@/components/MobileAppDownload'

export default function HomePage() {
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
