'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  HeartIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const pathname = usePathname()

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const categories = [
    {
      name: 'All Categories',
      href: '/categories',
      icon: ShoppingBagIcon
    },
    {
      name: 'Electronics',
      href: '/categories/electronics',
      icon: ShoppingBagIcon,
      subcategories: [
        { name: 'All Electronics', href: '/categories/electronics' },
        { name: 'Mobiles and Accessories', href: '/categories/mobile-phones' },
        { name: 'Laptops & Computers', href: '/categories/laptops-computers' },
        { name: 'TVs & Accessories', href: '/categories/tvs-accessories' },
        { name: 'Cameras', href: '/categories/cameras' },
        { name: 'Audio & Headphones', href: '/categories/headphones-earphones' },
        { name: 'Wearables', href: '/categories/wearables' },
        { name: 'Power Banks', href: '/categories/power-banks' },
        { name: 'Tablets', href: '/categories/tablets' }
      ]
    },
    {
      name: 'Fashion',
      href: '/categories/fashion',
      icon: UserGroupIcon,
      subcategories: [
        { name: 'All Fashion', href: '/categories/fashion' },
        { name: "Men's Fashion", href: '/categories/mens-fashion' },
        { name: "Women's Fashion", href: '/categories/womens-fashion' },
        { name: "Kids Fashion", href: '/categories/kids-fashion' }
      ]
    },
    {
      name: 'Beauty & Health',
      href: '/categories/beauty-health',
      icon: HeartIcon,
      subcategories: [
        { name: 'All Beauty & Health', href: '/categories/beauty-health' },
        { name: 'Makeup', href: '/categories/makeup' },
        { name: 'Fragrance', href: '/categories/fragrance' },
        { name: 'Skincare', href: '/categories/skincare' },
        { name: 'Haircare', href: '/categories/haircare' },
        { name: 'Grooming', href: '/categories/grooming' },
        { name: 'Hair Styling Tools', href: '/categories/hair-styling-tools' }
      ]
    },
    {
      name: 'Home & Kitchen',
      href: '/categories/home-kitchen',
      icon: HomeIcon,
      subcategories: [
        { name: 'All Home & Kitchen', href: '/categories/home-kitchen' },
        { name: 'Furniture', href: '/categories/furniture' },
        { name: 'Kitchen Appliances', href: '/categories/kitchen-appliances' },
        { name: 'Home Decor', href: '/categories/home-decor' }
      ]
    },
    {
      name: 'Gaming',
      href: '/categories/gaming',
      icon: CogIcon,
      subcategories: [
        { name: 'All Gaming', href: '/categories/gaming' },
        { name: 'Gaming Laptops', href: '/categories/gaming-laptops' },
        { name: 'Gaming Accessories', href: '/categories/gaming-accessories' },
        { name: 'Gaming Monitors', href: '/categories/gaming-monitors' },
        { name: 'Games', href: '/categories/games' },
        { name: 'Consoles', href: '/categories/consoles' }
      ]
    },
    {
      name: 'Sports & Fitness',
      href: '/categories/sports-fitness',
      icon: HeartIcon
    }
  ]

  const otherLinks = [
    { name: 'Help & Support', href: '/help', icon: QuestionMarkCircleIcon },
    { name: 'Contact Us', href: '/contact', icon: PhoneIcon },
    { name: 'Returns', href: '/returns', icon: ArrowRightOnRectangleIcon }
  ]

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[data-sidebar]')) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300" />
      )}

      {/* Sidebar */}
      <div 
        data-sidebar
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* Categories */}
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center">
                    {category.subcategories ? (
                      // For categories with subcategories, make the entire area clickable for dropdown
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleCategory(category.name)
                        }}
                        className="flex-1 flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-left"
                      >
                        <category.icon className="h-4 w-4 mr-3 text-gray-500" />
                        {category.name}
                      </button>
                    ) : (
                      // For categories without subcategories, use regular link
                      <Link
                        href={category.href}
                        className="flex-1 flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={onClose}
                      >
                        <category.icon className="h-4 w-4 mr-3 text-gray-500" />
                        {category.name}
                      </Link>
                    )}
                    {category.subcategories && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleCategory(category.name)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {openCategories.includes(category.name) ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Subcategories */}
                  {category.subcategories && openCategories.includes(category.name) && (
                    <div className="ml-6 mt-1 space-y-1">
                      <Link
                        href={category.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-medium"
                        onClick={onClose}
                      >
                        View All {category.name}
                      </Link>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={subcategory.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={onClose}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Other Links */}
              {otherLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={onClose}
                >
                  <link.icon className="h-4 w-4 mr-3" />
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
