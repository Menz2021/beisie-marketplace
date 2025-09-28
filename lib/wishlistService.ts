'use client'

import toast from 'react-hot-toast'

interface WishlistService {
  addToWishlist: (userId: string, productId: string) => Promise<boolean>
  removeFromWishlist: (userId: string, productId: string) => Promise<boolean>
  getWishlist: (userId: string) => Promise<any[]>
  isInWishlist: (userId: string, productId: string) => Promise<boolean>
}

export const wishlistService: WishlistService = {
  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Added to wishlist!')
        return true
      } else if (response.status === 409) {
        toast.error('Item already in wishlist')
        return false
      } else {
        toast.error(data.error || 'Failed to add to wishlist')
        return false
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
      return false
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}&productId=${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Removed from wishlist!')
        return true
      } else {
        toast.error(data.error || 'Failed to remove from wishlist')
        return false
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
      return false
    }
  },

  async getWishlist(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        return data.data
      } else {
        console.error('Error fetching wishlist:', data.error)
        return []
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      return []
    }
  },

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}&productId=${productId}`)
      const data = await response.json()

      return data.success && data.data
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      return false
    }
  },
}
