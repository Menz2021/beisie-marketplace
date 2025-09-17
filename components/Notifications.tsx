'use client'

import { useState, useEffect } from 'react'
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { notificationService, type Notification } from '@/lib/notifications'

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      setNotifications(notificationService.getNotifications())
      setUnreadCount(notificationService.getUnreadCount())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id)
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return '📦'
      case 'PAYMENT':
        return '💳'
      case 'DELIVERY':
        return '🚚'
      case 'PROMOTION':
        return '🎉'
      case 'SYSTEM':
        return '⚙️'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return 'bg-blue-100 text-blue-800'
      case 'PAYMENT':
        return 'bg-green-100 text-green-800'
      case 'DELIVERY':
        return 'bg-purple-100 text-purple-800'
      case 'PROMOTION':
        return 'bg-yellow-100 text-yellow-800'
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notifications Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getNotificationColor(notification.type)}`}>
                              {notification.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-primary-600 hover:text-primary-700"
                                >
                                  <CheckIcon className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    notificationService.clearAll()
                    setNotifications([])
                    setUnreadCount(0)
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-700"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
