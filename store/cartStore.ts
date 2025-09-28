import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartService } from '@/lib/cartService'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  vendorId: string
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<boolean>
  removeItem: (id: string) => Promise<boolean>
  updateQuantity: (id: string, quantity: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  getTotalPrice: () => number
  getTotalItems: () => number
  isAuthenticated: () => boolean
  syncWithBackend: () => Promise<void>
  setItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: async (item) => {
        const userData = localStorage.getItem('user_session')
        if (!userData) {
          // If not authenticated, add to local cart only
          const items = get().items
          const existingItem = items.find(i => i.id === item.id)
          
          if (existingItem) {
            set({
              items: items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            })
          } else {
            set({
              items: [...items, { ...item, quantity: 1 }]
            })
          }
          return true
        }

        const user = JSON.parse(userData)
        set({ isLoading: true })

        try {
          const response = await cartService.addToCart(user.id, item.id, 1)
          
          if (response.success && response.data) {
            const newItem = response.data as CartItem
            const items = get().items
            const existingItem = items.find(i => i.id === item.id)
            
            if (existingItem) {
              set({
                items: items.map(i =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
              })
            } else {
              set({
                items: [...items, newItem]
              })
            }
            return true
          }
          return false
        } catch (error) {
          console.error('Error adding to cart:', error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },
      
      removeItem: async (id) => {
        const userData = localStorage.getItem('user_session')
        if (!userData) {
          // If not authenticated, remove from local cart only
          set({
            items: get().items.filter(item => item.id !== id)
          })
          return true
        }

        const user = JSON.parse(userData)
        set({ isLoading: true })

        try {
          const response = await cartService.removeFromCart(user.id, id)
          
          if (response.success) {
            set({
              items: get().items.filter(item => item.id !== id)
            })
            return true
          }
          return false
        } catch (error) {
          console.error('Error removing from cart:', error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },
      
      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(id)
        }

        const userData = localStorage.getItem('user_session')
        if (!userData) {
          // If not authenticated, update local cart only
          set({
            items: get().items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          })
          return true
        }

        const user = JSON.parse(userData)
        set({ isLoading: true })

        try {
          const response = await cartService.updateCartItem(user.id, id, quantity)
          
          if (response.success) {
            set({
              items: get().items.map(item =>
                item.id === id ? { ...item, quantity } : item
              )
            })
            return true
          }
          return false
        } catch (error) {
          console.error('Error updating cart:', error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },
      
      clearCart: async () => {
        const userData = localStorage.getItem('user_session')
        if (!userData) {
          // If not authenticated, clear local cart only
          set({ items: [] })
          return true
        }

        const user = JSON.parse(userData)
        set({ isLoading: true })

        try {
          const response = await cartService.clearCart(user.id)
          
          if (response.success) {
            set({ items: [] })
            return true
          }
          return false
        } catch (error) {
          console.error('Error clearing cart:', error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      isAuthenticated: () => {
        if (typeof window === 'undefined') return false
        const userSession = localStorage.getItem('user_session')
        if (!userSession) return false
        try {
          JSON.parse(userSession)
          return true
        } catch {
          return false
        }
      },

      syncWithBackend: async () => {
        const userData = localStorage.getItem('user_session')
        if (!userData) return

        const user = JSON.parse(userData)
        set({ isLoading: true })

        try {
          const response = await cartService.getCart(user.id)
          
          if (response.success && response.data) {
            const backendItems = response.data as CartItem[]
            set({ items: backendItems })
          }
        } catch (error) {
          console.error('Error syncing cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      setItems: (items) => {
        set({ items })
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
