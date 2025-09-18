// Coupon and promo codes system

export interface Coupon {
  id: string
  code: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  validFrom: Date
  validUntil: Date
  applicableCategories?: string[]
  applicableProducts?: string[]
  applicableUsers?: string[]
}

export interface CouponValidationResult {
  isValid: boolean
  discount: number
  message: string
  coupon?: Coupon
}

export interface CartItem {
  id: string
  price: number
  quantity: number
  categoryId?: string
  vendorId?: string
}

class CouponService {
  private static instance: CouponService
  private coupons: Coupon[] = []

  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService()
    }
    return CouponService.instance
  }

  // Initialize with sample coupons
  init(): void {
    this.coupons = [
      {
        id: '1',
        code: 'WELCOME10',
        description: 'Welcome discount for new users',
        type: 'PERCENTAGE',
        value: 10,
        minOrderAmount: 50000,
        maxDiscount: 100000,
        usageLimit: 1000,
        usedCount: 245,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31')
      },
      {
        id: '2',
        code: 'SAVE5000',
        description: 'Fixed amount discount',
        type: 'FIXED_AMOUNT',
        value: 5000,
        minOrderAmount: 25000,
        usageLimit: 500,
        usedCount: 89,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-06-30')
      },
      {
        id: '3',
        code: 'ELECTRONICS20',
        description: '20% off on electronics',
        type: 'PERCENTAGE',
        value: 20,
        minOrderAmount: 100000,
        maxDiscount: 200000,
        usageLimit: 200,
        usedCount: 45,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        applicableCategories: ['electronics', 'mobile-phones', 'laptops-computers']
      },
      {
        id: '4',
        code: 'FREESHIP',
        description: 'Free shipping on orders over UGX 100,000',
        type: 'FIXED_AMOUNT',
        value: 15000,
        minOrderAmount: 100000,
        usageLimit: 1000,
        usedCount: 156,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31')
      }
    ]
  }

  // Validate coupon code
  validateCoupon(
    code: string, 
    cartItems: CartItem[], 
    userId?: string
  ): CouponValidationResult {
    const coupon = this.coupons.find(c => 
      c.code.toUpperCase() === code.toUpperCase() && 
      c.isActive
    )

    if (!coupon) {
      return {
        isValid: false,
        discount: 0,
        message: 'Invalid coupon code'
      }
    }

    // Check if coupon is within validity period
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return {
        isValid: false,
        discount: 0,
        message: 'Coupon has expired'
      }
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discount: 0,
        message: 'Coupon usage limit exceeded'
      }
    }

    // Check if user is applicable
    if (coupon.applicableUsers && userId && !coupon.applicableUsers.includes(userId)) {
      return {
        isValid: false,
        discount: 0,
        message: 'Coupon not applicable for this user'
      }
    }

    // Calculate cart total
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        discount: 0,
        message: `Minimum order amount of UGX ${coupon.minOrderAmount.toLocaleString()} required`
      }
    }

    // Check if products/categories are applicable
    if (coupon.applicableCategories || coupon.applicableProducts) {
      const hasApplicableItem = cartItems.some(item => {
        if (coupon.applicableProducts && coupon.applicableProducts.includes(item.id)) {
          return true
        }
        if (coupon.applicableCategories && item.categoryId && coupon.applicableCategories.includes(item.categoryId)) {
          return true
        }
        return false
      })

      if (!hasApplicableItem) {
        return {
          isValid: false,
          discount: 0,
          message: 'Coupon not applicable for items in your cart'
        }
      }
    }

    // Calculate discount
    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = (cartTotal * coupon.value) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else {
      discount = coupon.value
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal)

    return {
      isValid: true,
      discount,
      message: `Coupon applied! You saved UGX ${discount.toLocaleString()}`,
      coupon
    }
  }

  // Apply coupon (increment usage count)
  applyCoupon(code: string): boolean {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase())
    if (coupon) {
      coupon.usedCount++
      return true
    }
    return false
  }

  // Get all active coupons
  getActiveCoupons(): Coupon[] {
    const now = new Date()
    return this.coupons.filter(coupon => 
      coupon.isActive && 
      now >= coupon.validFrom && 
      now <= coupon.validUntil
    )
  }

  // Get coupon by code
  getCouponByCode(code: string): Coupon | undefined {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase())
  }

  // Create new coupon (admin function)
  createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const newCoupon: Coupon = {
      ...couponData,
      id: Date.now().toString(),
      usedCount: 0
    }
    this.coupons.push(newCoupon)
    return newCoupon
  }

  // Update coupon (admin function)
  updateCoupon(id: string, updates: Partial<Coupon>): boolean {
    const index = this.coupons.findIndex(c => c.id === id)
    if (index !== -1) {
      this.coupons[index] = { ...this.coupons[index], ...updates }
      return true
    }
    return false
  }

  // Delete coupon (admin function)
  deleteCoupon(id: string): boolean {
    const index = this.coupons.findIndex(c => c.id === id)
    if (index !== -1) {
      this.coupons.splice(index, 1)
      return true
    }
    return false
  }

  // Get coupon statistics
  getCouponStats() {
    const totalCoupons = this.coupons.length
    const activeCoupons = this.getActiveCoupons().length
    const totalUsage = this.coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)
    
    return {
      totalCoupons,
      activeCoupons,
      totalUsage,
      averageUsage: totalCoupons > 0 ? totalUsage / totalCoupons : 0
    }
  }

  // Generate coupon code
  generateCouponCode(prefix?: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = prefix || ''
    
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    // Ensure code is unique
    while (this.coupons.some(c => c.code === code)) {
      code = prefix || ''
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    }
    
    return code
  }

  // Format currency for Uganda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }
}

// Export singleton instance
export const couponService = CouponService.getInstance()

// Initialize with sample data
couponService.init()
