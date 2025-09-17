'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  productSlug: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productSlug, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      // Get user from localStorage (in a real app, this would come from authentication)
      const userSession = localStorage.getItem('user_session')
      if (!userSession) {
        toast.error('Please log in to submit a review')
        return
      }

      const user = JSON.parse(userSession)

      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
          userId: user.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Review submitted successfully!')
        setRating(0)
        setComment('')
        onReviewSubmitted?.()
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                {(hoveredRating >= star || rating >= star) ? (
                  <StarSolidIcon className="h-8 w-8 text-yellow-400" />
                ) : (
                  <StarIcon className="h-8 w-8 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                rating === 1 ? 'Poor' :
                rating === 2 ? 'Fair' :
                rating === 3 ? 'Good' :
                rating === 4 ? 'Very Good' :
                'Excellent'
              )}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Review (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Share your experience with this product..."
            maxLength={1000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}
