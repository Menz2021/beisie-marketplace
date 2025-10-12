'use client'

import { useState } from 'react'

interface ImageTestProps {
  images: string[]
  title?: string
}

export function ImageTest({ images, title = "Image Test Results" }: ImageTestProps) {
  const [results, setResults] = useState<Record<string, 'loading' | 'success' | 'error'>>({})

  const testImage = (src: string) => {
    setResults(prev => ({ ...prev, [src]: 'loading' }))
    
    const img = new Image()
    img.onload = () => {
      setResults(prev => ({ ...prev, [src]: 'success' }))
      console.log(`✅ ${src} loaded successfully`)
    }
    img.onerror = () => {
      setResults(prev => ({ ...prev, [src]: 'error' }))
      console.error(`❌ ${src} failed to load`)
    }
    img.src = src
  }

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '❓'
    }
  }

  const getStatusColor = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading': return 'text-yellow-600'
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => images.forEach(testImage)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Test All Images
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 truncate" title={src}>
                {src.split('/').pop()}
              </span>
              <span className={`text-lg ${getStatusColor(results[src] || 'loading')}`}>
                {getStatusIcon(results[src] || 'loading')}
              </span>
            </div>
            
            <div className="mb-2">
              <img
                src={src}
                alt={`Test ${index}`}
                className="w-full h-24 object-cover border border-gray-200 rounded"
                onLoad={() => testImage(src)}
                onError={() => testImage(src)}
              />
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Path: {src}</p>
              <p>Status: {results[src] || 'Not tested'}</p>
            </div>
            
            <button
              onClick={() => testImage(src)}
              className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs transition-colors"
            >
              Test This Image
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click "Test All Images" to test all images at once</li>
          <li>• Click individual "Test This Image" buttons to test specific images</li>
          <li>• Check browser console (F12) for detailed error messages</li>
          <li>• ✅ = Image loads successfully</li>
          <li>• ❌ = Image failed to load (check console for details)</li>
          <li>• ⏳ = Image is currently being tested</li>
        </ul>
      </div>
    </div>
  )
}

// Predefined test sets for common image categories
export const imageTestSets = {
  wearables: [
    '/images/watch.avif',
    '/images/watches.jpg',
    '/images/wearables1.jpg',
    '/images/Apple watch series.jpg',
    '/images/smartphones.jpg',
    '/watches.avif'
  ],
  appleProducts: [
    '/images/Apple watch series.jpg',
    '/images/iphone-17.jpg'
  ],
  kids: [
    '/images/kids.gif',
    '/images/kids-test.gif'
  ],
  mobile: [
    '/images/iphone-17.jpg',
    '/images/Mobile phones.jpg',
    '/images/smartphones.jpg'
  ],
  all: [
    '/images/watch.avif',
    '/images/watches.jpg',
    '/images/wearables1.jpg',
    '/images/Apple watch series.jpg',
    '/images/smartphones.jpg',
    '/images/kids.gif',
    '/images/iphone-17.jpg',
    '/images/Mobile phones.jpg',
    '/watches.avif',
    '/images/phones.jpg'
  ]
}
