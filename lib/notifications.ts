// Push notifications system for order updates and promotions

export interface Notification {
  id: string
  title: string
  message: string
  type: 'ORDER_UPDATE' | 'PROMOTION' | 'SYSTEM' | 'PAYMENT' | 'DELIVERY'
  isRead: boolean
  data?: any
  createdAt: Date
}

export interface NotificationPreferences {
  orderUpdates: boolean
  promotions: boolean
  systemAlerts: boolean
  paymentAlerts: boolean
  deliveryUpdates: boolean
}

class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private preferences: NotificationPreferences = {
    orderUpdates: true,
    promotions: true,
    systemAlerts: true,
    paymentAlerts: true,
    deliveryUpdates: true
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Send push notification
  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    const hasPermission = await this.requestPermission()
    
    if (!hasPermission) {
      console.log('Notification permission denied')
      return
    }

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    }

    this.notifications.unshift(newNotification)
    this.saveNotifications()

    // Show browser notification
    if (this.shouldShowNotification(notification.type)) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: (notification as any).id,
        requireInteraction: notification.type === 'PAYMENT' || notification.type === 'DELIVERY'
      })

      browserNotification.onclick = () => {
        window.focus()
        browserNotification.close()
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }
  }

  // Check if notification should be shown based on preferences
  private shouldShowNotification(type: Notification['type']): boolean {
    switch (type) {
      case 'ORDER_UPDATE':
        return this.preferences.orderUpdates
      case 'PROMOTION':
        return this.preferences.promotions
      case 'SYSTEM':
        return this.preferences.systemAlerts
      case 'PAYMENT':
        return this.preferences.paymentAlerts
      case 'DELIVERY':
        return this.preferences.deliveryUpdates
      default:
        return true
    }
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
      this.saveNotifications()
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true)
    this.saveNotifications()
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.saveNotifications()
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = []
    this.saveNotifications()
  }

  // Update notification preferences
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences }
    this.savePreferences()
  }

  // Get notification preferences
  getPreferences(): NotificationPreferences {
    return this.preferences
  }

  // Save notifications to localStorage
  private saveNotifications(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('beisie-notifications', JSON.stringify(this.notifications))
    }
  }

  // Load notifications from localStorage
  private loadNotifications(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beisie-notifications')
      if (saved) {
        try {
          this.notifications = JSON.parse(saved).map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }))
        } catch (error) {
          console.error('Error loading notifications:', error)
        }
      }
    }
  }

  // Save preferences to localStorage
  private savePreferences(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('beisie-notification-preferences', JSON.stringify(this.preferences))
    }
  }

  // Load preferences from localStorage
  private loadPreferences(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beisie-notification-preferences')
      if (saved) {
        try {
          this.preferences = { ...this.preferences, ...JSON.parse(saved) }
        } catch (error) {
          console.error('Error loading preferences:', error)
        }
      }
    }
  }

  // Initialize the service
  init(): void {
    this.loadNotifications()
    this.loadPreferences()
  }

  // Order-specific notification methods
  async notifyOrderPlaced(orderNumber: string, total: number): Promise<void> {
    await this.sendNotification({
      title: 'Order Placed Successfully!',
      message: `Your order #${orderNumber} has been placed for UGX ${total.toLocaleString()}`,
      type: 'ORDER_UPDATE',
      isRead: false
    })
  }

  async notifyOrderStatusUpdate(orderNumber: string, status: string): Promise<void> {
    const statusMessages = {
      'PROCESSING': 'Your order is being prepared',
      'SHIPPED': 'Your order has been shipped',
      'DELIVERED': 'Your order has been delivered',
      'CANCELLED': 'Your order has been cancelled'
    }

    await this.sendNotification({
      title: 'Order Update',
      message: `Order #${orderNumber}: ${statusMessages[status as keyof typeof statusMessages] || status}`,
      type: 'ORDER_UPDATE',
      isRead: false
    })
  }

  async notifyPaymentSuccess(orderNumber: string, amount: number): Promise<void> {
    await this.sendNotification({
      title: 'Payment Successful!',
      message: `Payment of UGX ${amount.toLocaleString()} for order #${orderNumber} has been processed`,
      type: 'PAYMENT',
      isRead: false
    })
  }

  async notifyPaymentFailed(orderNumber: string, reason: string): Promise<void> {
    await this.sendNotification({
      title: 'Payment Failed',
      message: `Payment for order #${orderNumber} failed: ${reason}`,
      type: 'PAYMENT',
      isRead: false
    })
  }

  async notifyDeliveryUpdate(orderNumber: string, status: string): Promise<void> {
    await this.sendNotification({
      title: 'Delivery Update',
      message: `Order #${orderNumber} delivery status: ${status}`,
      type: 'DELIVERY',
      isRead: false
    })
  }

  async notifyPromotion(title: string, message: string): Promise<void> {
    await this.sendNotification({
      title,
      message,
      type: 'PROMOTION',
      isRead: false
    })
  }

  async notifySystemAlert(title: string, message: string): Promise<void> {
    await this.sendNotification({
      title,
      message,
      type: 'SYSTEM',
      isRead: false
    })
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()

// Initialize on client side
if (typeof window !== 'undefined') {
  notificationService.init()
}
