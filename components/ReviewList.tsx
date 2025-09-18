'use client'

import { useState, useEffect } from 'react'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface ReviewListProps {
  productSlug: string
}

export function ReviewList({ productSlug }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchReviews = async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${productSlug}/reviews?page=${page}&limit=5`)
      const data = await response.json()
      
      if (data.success) {
        if (append) {
          setReviews(prev => [...prev, ...data.data])
        } else {
          setReviews(data.data)
        }
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1, false)
  }, [productSlug])

  const loadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchReviews(nextPage, true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-purple-600">
                {getInitials(review.user.name)}
              </span>
            </div>

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{review.user.name}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="btn-outline btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  )
}
