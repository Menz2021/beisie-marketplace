'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string
  category: string
  categorySlug?: string
  slug: string
  brand?: string
  stock: number
  vendor?: string
  isFeatured: boolean
  averageRating: number
  totalReviews: number
  discount: number
  daysSinceAdded: number
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]) // UGX range
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Initialize search query from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('q')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
      setCurrentPage(1) // Reset to first page when search changes
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery) {
      fetchProducts()
    }
  }, [currentPage, sortBy, searchQuery])

  // Reset to first page when search query changes (but not from URL)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy,
        search: searchQuery.trim()
      })
      
      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        if (currentPage === 1) {
          setProducts(data.data)
        } else {
          setProducts(prev => [...prev, ...data.data])
        }
        setTotalPages(data.pagination?.totalPages || 1)
        setHasMore(data.pagination?.hasMore || false)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Since we're using server-side search, we only need client-side filtering for category and price
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesCategory && matchesPrice
  })

  // Server-side sorting is handled by the API, so we don't need client-side sorting
  const sortedProducts = filteredProducts

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results {searchQuery && `for "${searchQuery}"`}
          </h1>
          
          {searchQuery && (
            <p className="text-gray-600">
              {isLoading ? 'Searching...' : `Found ${filteredProducts.length} products`}
            </p>
          )}
        </div>

        {!searchQuery ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No search query</h2>
            <p className="text-gray-600">Please enter a search term to find products.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <ProductFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading && currentPage === 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="btn-outline btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Load More Products'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any products matching "{searchQuery}".
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
