import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.id === item.id)
        
        if (!existingItem) {
          set({
            items: [...items, { ...item, addedAt: new Date().toISOString() }]
          })
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        })
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      getTotalItems: () => {
        return get().items.length
      },
      
      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

