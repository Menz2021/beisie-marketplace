'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Products on{' '}
              <span className="text-secondary-300">Beisie</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-lg">
              Your ultimate marketplace for finding quality products from trusted vendors. 
              Shop with confidence and discover something amazing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Shop Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
              >
                Sell on Beisie
              </Link>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square bg-white/10 rounded-2xl backdrop-blur-sm p-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm text-primary-100">Products</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-primary-100">Vendors</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-sm text-primary-100">Happy Customers</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-primary-100">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}
