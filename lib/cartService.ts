import { CartItem } from '@/store/cartStore'

export interface CartServiceResponse {
  success: boolean
  data?: CartItem | CartItem[] | null
  error?: string
  message?: string
}

class CartService {
  private async makeRequest(url: string, options: RequestInit = {}): Promise<CartServiceResponse> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed'
        }
      }

      return data
    } catch (error) {
      console.error('Cart service error:', error)
      return {
        success: false,
        error: 'Network error'
      }
    }
  }

  async getCart(userId: string): Promise<CartServiceResponse> {
    return this.makeRequest(`/api/cart?userId=${userId}`)
  }

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartServiceResponse> {
    return this.makeRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity })
    })
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartServiceResponse> {
    return this.makeRequest('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ userId, productId, quantity })
    })
  }

  async removeFromCart(userId: string, productId: string): Promise<CartServiceResponse> {
    return this.makeRequest(`/api/cart?userId=${userId}&productId=${productId}`, {
      method: 'DELETE'
    })
  }

  async clearCart(userId: string): Promise<CartServiceResponse> {
    // Get all cart items first
    const cartResponse = await this.getCart(userId)
    if (!cartResponse.success || !cartResponse.data) {
      return cartResponse
    }

    const items = cartResponse.data as CartItem[]
    
    // Remove each item
    const deletePromises = items.map(item => 
      this.removeFromCart(userId, item.id)
    )

    await Promise.all(deletePromises)

    return {
      success: true,
      message: 'Cart cleared'
    }
  }
}

export const cartService = new CartService()
