'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  DocumentTextIcon,
  TruckIcon,
  CreditCardIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'New to Beisie? Learn the basics of shopping with us.',
      icon: UserIcon,
      color: 'bg-blue-500',
      topics: [
        'Creating an account',
        'How to place your first order',
        'Understanding our platform',
        'Account verification'
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping & Orders',
      description: 'Everything you need to know about browsing and ordering.',
      icon: QuestionMarkCircleIcon,
      color: 'bg-green-500',
      topics: [
        'Finding products',
        'Adding items to cart',
        'Placing orders',
        'Order modifications'
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      description: 'Payment methods, billing, and refund information.',
      icon: CreditCardIcon,
      color: 'bg-purple-500',
      topics: [
        'Payment methods',
        'Billing questions',
        'Refund process',
        'Payment security'
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      description: 'Delivery options, tracking, and shipping policies.',
      icon: TruckIcon,
      color: 'bg-orange-500',
      topics: [
        'Delivery areas',
        'Shipping costs',
        'Order tracking',
        'Delivery issues'
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      description: 'Return policies and exchange procedures.',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      topics: [
        'Return policy',
        'How to return items',
        'Exchange process',
        'Refund timeline'
      ]
    },
    {
      id: 'account',
      title: 'Account & Security',
      description: 'Managing your account and security settings.',
      icon: ShieldCheckIcon,
      color: 'bg-indigo-500',
      topics: [
        'Profile management',
        'Password security',
        'Address management',
        'Account settings'
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Track Your Order',
      description: 'Check the status of your current orders',
      icon: TruckIcon,
      href: '/account',
      color: 'bg-blue-600'
    },
    {
      title: 'Request a Return',
      description: 'Start the return process for your items',
      icon: ExclamationTriangleIcon,
      href: '/account',
      color: 'bg-red-600'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account information',
      icon: UserIcon,
      href: '/account',
      color: 'bg-green-600'
    },
    {
      title: 'View Order History',
      description: 'See all your past and current orders',
      icon: DocumentTextIcon,
      href: '/account',
      color: 'bg-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you today?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions, get help with your orders, or contact our support team. 
            We're here to make your shopping experience as smooth as possible.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse Help Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{category.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-1">
                    {category.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-500 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/faq"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium mt-4"
                  >
                    Learn more →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with any questions or concerns. 
              Get in touch with us for personalized assistance.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3" />
              Contact Our Support Team
            </Link>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/faq"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            >
              <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">FAQs</h4>
              <p className="text-sm text-gray-600">Frequently asked questions</p>
            </Link>
            
            <Link
              href="/returns"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            >
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Return Policy</h4>
              <p className="text-sm text-gray-600">Returns and refunds</p>
            </Link>
            
            <Link
              href="/terms"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            >
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Terms of Service</h4>
              <p className="text-sm text-gray-600">Legal terms and conditions</p>
            </Link>
            
            <Link
              href="/privacy"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            >
              <ShieldCheckIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Privacy Policy</h4>
              <p className="text-sm text-gray-600">Data protection and privacy</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
