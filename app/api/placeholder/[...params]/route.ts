import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const [width, height, ...rest] = params.params
    const w = parseInt(width) || 300
    const h = parseInt(height) || 300
    const text = rest.join('/') || 'Image'
    
    // Create a simple PNG placeholder using canvas-like approach
    // For now, let's try a simple colored rectangle as SVG
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <rect x="20" y="20" width="${w-40}" height="${h-40}" fill="#ffffff" stroke="#d1d5db" stroke-width="2" rx="8"/>
        <text x="50%" y="45%" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold"
              fill="#1f2937" textAnchor="middle" dy=".3em">
          ${text}
        </text>
        <text x="50%" y="55%" fontFamily="Arial, sans-serif" fontSize="14"
              fill="#6b7280" textAnchor="middle" dy=".3em">
          ${w} × ${h}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new NextResponse('Error generating placeholder', { status: 500 })
  }
}
