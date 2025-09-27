'use client'

import { useState } from 'react'

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mobile Phones', label: 'Mobile Phones' },
  { value: 'Power Banks', label: '→ Power Banks' },
  { value: 'Headphones & Earphones', label: '→ Headphones & Earphones' },
  { value: 'Wearables', label: '→ Wearables' },
  { value: 'Tablets', label: '→ Tablets' },
  { value: 'TVs & Accessories', label: 'TVs & Accessories' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Gaming Laptops', label: '→ Gaming Laptops' },
  { value: 'Gaming Accessories', label: '→ Gaming Accessories' },
  { value: 'Gaming Monitors', label: '→ Gaming Monitors' },
  { value: 'Games', label: '→ Games' },
  { value: 'Consoles', label: '→ Consoles' },
  { value: 'Cameras', label: 'Cameras' },
  { value: 'Fashion', label: 'Fashion' },
  { value: "Men's Fashion", label: '→ Men\'s Fashion' },
  { value: "Women's Fashion", label: '→ Women\'s Fashion' },
  { value: "Kids Fashion", label: '→ Kids Fashion' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports & Fitness', label: 'Sports & Fitness' },
  { value: 'Books & Media', label: 'Books & Media' },
  { value: 'Beauty & Health', label: 'Beauty & Health' },
  { value: 'Makeup', label: '→ Makeup' },
  { value: 'Fragrance', label: '→ Fragrance' },
  { value: 'Skincare', label: '→ Skincare' },
  { value: 'Haircare', label: '→ Haircare' },
  { value: 'Grooming', label: '→ Grooming' },
  { value: 'Hair Styling Tools', label: '→ Hair Styling Tools' }
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
]

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full input"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.value} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={selectedCategory === category.value}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Price Range: Ush {priceRange[0].toLocaleString()} - Ush {priceRange[1].toLocaleString()}
            </h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Ush 0</span>
                <span>Ush 1,000</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              onCategoryChange('all')
              onPriceRangeChange([0, 1000])
              onSortChange('featured')
            }}
            className="w-full btn-outline btn-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
