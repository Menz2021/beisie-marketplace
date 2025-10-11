'use client'

import { ImageTest, imageTestSets } from '@/components/ImageTest'

export default function ImageTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Image Testing Dashboard
        </h1>
        
        <div className="space-y-8">
          {/* Apple Products Images */}
          <ImageTest 
            images={imageTestSets.appleProducts}
            title="Apple Products Images Test"
          />
          
          {/* Wearables Images */}
          <ImageTest 
            images={imageTestSets.wearables}
            title="Wearables Images Test"
          />
          
          {/* Kids Images */}
          <ImageTest 
            images={imageTestSets.kids}
            title="Kids Images Test"
          />
          
          {/* Mobile Images */}
          <ImageTest 
            images={imageTestSets.mobile}
            title="Mobile Images Test"
          />
          
          {/* All Images */}
          <ImageTest 
            images={imageTestSets.all}
            title="All Images Test"
          />
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Use:</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1. Test Images:</strong> Click "Test All Images" or individual test buttons</p>
            <p><strong>2. Check Results:</strong> Look for ✅ (success) or ❌ (failed) icons</p>
            <p><strong>3. Check Console:</strong> Press F12 → Console tab for detailed error messages</p>
            <p><strong>4. Use Working Images:</strong> Only use images that show ✅ in your website</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Quick Test for New Images:</h4>
          <p className="text-sm text-yellow-700">
            To test new images, add them to the <code className="bg-yellow-100 px-1 rounded">imageTestSets</code> object 
            in <code className="bg-yellow-100 px-1 rounded">components/ImageTest.tsx</code> and refresh this page.
          </p>
        </div>
      </div>
    </div>
  )
}
