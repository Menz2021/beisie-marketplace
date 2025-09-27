'use client'

import { useState, useRef, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'

interface SwipeToDeleteProps {
  children: React.ReactNode
  onDelete: () => void
  deleteText?: string
  className?: string
}

export function SwipeToDelete({ 
  children, 
  onDelete, 
  deleteText = 'Delete',
  className = '' 
}: SwipeToDeleteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [startX, setStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const deleteThreshold = 100 // Minimum swipe distance to trigger delete

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startX
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setDragOffset(Math.max(deltaX, -120)) // Limit swipe distance
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    
    // If swiped far enough, trigger delete
    if (Math.abs(dragOffset) >= deleteThreshold) {
      onDelete()
    }
    
    // Reset position
    setDragOffset(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setDragOffset(Math.max(deltaX, -120))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    
    // If swiped far enough, trigger delete
    if (Math.abs(dragOffset) >= deleteThreshold) {
      onDelete()
    }
    
    // Reset position
    setDragOffset(0)
  }

  // Reset drag offset when not dragging
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setDragOffset(0)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isDragging])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Delete Action Background */}
      <div 
        className="absolute inset-y-0 right-0 bg-red-500 flex items-center justify-center text-white font-medium px-4 transition-opacity duration-200"
        style={{
          width: Math.abs(dragOffset),
          opacity: Math.abs(dragOffset) / 120
        }}
      >
        <div className="flex items-center space-x-2">
          <TrashIcon className="h-5 w-5" />
          <span className="text-sm">{deleteText}</span>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative bg-white transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${dragOffset}px)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>
    </div>
  )
}
