import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistService } from '@/lib/wishlistService'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
  vendorId: string
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => Promise<boolean>
  removeItem: (id: string) => Promise<boolean>
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
  clearWishlist: () => void
  syncWithBackend: (userId: string) => Promise<void>
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: async (item) => {
        const items = get().items
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          return false
        }

        // Get current user from localStorage
        const userData = localStorage.getItem('user_session')
        if (!userData) {
          console.error('User not logged in')
          return false
        }

        const user = JSON.parse(userData)
        
        // Add to backend first
        const success = await wishlistService.addToWishlist(user.id, item.id)
        
        if (success) {
          // Add to local store
          set({
            items: [...items, { ...item, addedAt: new Date().toISOString() }]
          })
          return true
        }
        
        return false
      },
      
      removeItem: async (id) => {
        // Get current user from localStorage
        const userData = localStorage.getItem('user_session')
        if (!userData) {
          console.error('User not logged in')
          return false
        }

        const user = JSON.parse(userData)
        
        // Remove from backend first
        const success = await wishlistService.removeFromWishlist(user.id, id)
        
        if (success) {
          // Remove from local store
          set({
            items: get().items.filter(item => item.id !== id)
          })
          return true
        }
        
        return false
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      getTotalItems: () => {
        return get().items.length
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },

      syncWithBackend: async (userId) => {
        try {
          const backendItems = await wishlistService.getWishlist(userId)
          
          // Transform backend data to match local store format
          const transformedItems = backendItems.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images,
            slug: item.product.slug,
            vendorId: item.product.vendorId,
            addedAt: item.createdAt
          }))
          
          set({ items: transformedItems })
        } catch (error) {
          console.error('Error syncing wishlist with backend:', error)
        }
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

