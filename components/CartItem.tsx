'use client'

import { memo } from 'react'
import Image from 'next/image'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { SwipeToDelete } from './SwipeToDelete'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    vendorId: string
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  formatCurrency: (amount: number) => string
}

export const CartItem = memo(function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  formatCurrency 
}: CartItemProps) {
  return (
    <SwipeToDelete
      key={item.id}
      onDelete={() => onRemoveItem(item.id)}
      deleteText="Remove"
      className="rounded-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 py-3 sm:py-4 border-b border-gray-200 last:border-b-0 bg-white">
        {/* Mobile: Image and basic info */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 64px, 80px"
              priority={false}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 sm:truncate">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Vendor ID: {item.vendorId}</p>
            <p className="text-sm sm:text-lg font-semibold text-gray-900 mt-1">
              {formatCurrency(item.price)}
            </p>
          </div>
        </div>
        
        {/* Mobile: Quantity controls and actions */}
        <div className="flex items-center justify-between sm:justify-end space-x-4">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <MinusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          
          {/* Price and Remove */}
          <div className="text-right">
            <p className="text-sm sm:text-lg font-semibold text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-red-600 hover:text-red-700 mt-1 p-1 rounded-md hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center sm:hidden"
              aria-label={`Remove ${item.name} from cart`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </SwipeToDelete>
  )
})
