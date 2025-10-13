'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Pages that should show the homepage navbar and footer
  const publicPages = [
    '/',
    '/products',
    '/products/[id]',
    '/categories',
    '/categories/[id]',
    '/search',
    '/about',
    '/contact',
    '/help',
    '/faq',
    '/returns',
    '/terms',
    '/privacy',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ]
  
  // Check if current page should show navbar and footer
  const shouldShowNavbar = publicPages.some(page => {
    if (page.includes('[') && page.includes(']')) {
      // Handle dynamic routes like /products/[id]
      const basePath = page.split('[')[0]
      return pathname.startsWith(basePath)
    }
    return pathname === page
  })
  
  if (shouldShowNavbar) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 m-0 p-0 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    )
  }
  
  // For dashboard pages (admin, seller, etc.), return just the content
  return (
    <div className="min-h-screen bg-transparent">
      {children}
    </div>
  )
}
