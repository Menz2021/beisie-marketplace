'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const faqs: FAQ[] = [
    // General Questions
    {
      id: '1',
      question: 'What is Beisie?',
      answer: 'Beisie is Uganda\'s premier online marketplace where you can buy and sell a wide variety of products. We connect customers with local sellers to provide a convenient and secure shopping experience.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click on "Sign Up" in the top right corner, fill in your details (name, email, phone number), and verify your email address. You\'ll be ready to start shopping in minutes.',
      category: 'general'
    },
    {
      id: '3',
      question: 'Is my personal information secure?',
      answer: 'Yes, absolutely! We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your consent, and all transactions are processed securely.',
      category: 'general'
    },

    // Shopping & Orders
    {
      id: '4',
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. Enter your shipping address, select a payment method, and confirm your order. You\'ll receive an order confirmation via email.',
      category: 'shopping'
    },
    {
      id: '5',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it, as long as it hasn\'t been processed for shipping. Go to "My Orders" in your account dashboard and look for the "Cancel Order" option.',
      category: 'shopping'
    },
    {
      id: '6',
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also track your order by logging into your account and going to "My Orders" section.',
      category: 'shopping'
    },
    {
      id: '7',
      question: 'What if I receive a damaged or wrong item?',
      answer: 'If you receive a damaged or incorrect item, please contact our customer support immediately. We\'ll arrange for a replacement or full refund. You can also request a return through your account dashboard.',
      category: 'shopping'
    },

    // Payment & Billing
    {
      id: '8',
      question: 'What payment methods do you accept?',
      answer: 'We accept MTN Mobile Money, Airtel Money, Visa, Mastercard, and American Express. All payments are processed securely through our encrypted payment gateway.',
      category: 'payment'
    },
    {
      id: '9',
      question: 'When will I be charged?',
      answer: 'You\'ll be charged immediately when you place your order. The payment is processed securely and you\'ll receive a payment confirmation via email.',
      category: 'payment'
    },
    {
      id: '10',
      question: 'Can I get a refund?',
      answer: 'Yes! We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days after we receive your returned items.',
      category: 'payment'
    },
    {
      id: '11',
      question: 'How do refunds work?',
      answer: 'Refunds are issued to the original payment method used for the purchase. For mobile money payments, refunds are sent directly to your mobile money account. For card payments, refunds appear on your statement within 5-7 business days.',
      category: 'payment'
    },

    // Shipping & Delivery
    {
      id: '12',
      question: 'Do you deliver nationwide?',
      answer: 'Yes! We deliver to all major cities and towns across Uganda. Delivery times vary by location, typically 1-3 business days for Kampala and 3-7 business days for other areas.',
      category: 'shipping'
    },
    {
      id: '13',
      question: 'How much does shipping cost?',
      answer: 'Shipping costs vary by location and order size. Standard delivery within Kampala is usually free for orders over UGX 50,000. For other areas, shipping costs start from UGX 10,000. Exact costs are calculated at checkout.',
      category: 'shipping'
    },
    {
      id: '14',
      question: 'Can I choose my delivery time?',
      answer: 'Yes! During checkout, you can select your preferred delivery time slot. We offer same-day delivery in Kampala for orders placed before 2 PM, and next-day delivery for orders placed after 2 PM.',
      category: 'shipping'
    },
    {
      id: '15',
      question: 'What if I\'m not available for delivery?',
      answer: 'If you\'re not available, our delivery team will attempt delivery twice. After the second attempt, you can arrange a convenient time for redelivery or pick up your order from our nearest collection point.',
      category: 'shipping'
    },

    // Account & Profile
    {
      id: '16',
      question: 'How do I update my profile information?',
      answer: 'Log into your account and go to "My Account" → "Profile". You can update your name, email, phone number, and other personal information. Remember to save your changes.',
      category: 'account'
    },
    {
      id: '17',
      question: 'How do I change my password?',
      answer: 'Go to "My Account" → "Security" → "Change Password". Enter your current password and your new password twice to confirm. Make sure your new password is strong and secure.',
      category: 'account'
    },
    {
      id: '18',
      question: 'Can I have multiple addresses?',
      answer: 'Yes! You can save multiple delivery addresses in your account. Go to "My Account" → "Addresses" to add, edit, or delete addresses. You can also set a default address for faster checkout.',
      category: 'account'
    },
    {
      id: '19',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to "My Account" → "Security" → "Delete Account". Please note that this action is permanent and cannot be undone. All your data will be permanently removed.',
      category: 'account'
    },

    // Returns & Exchanges
    {
      id: '20',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like personalized products, perishables, and intimate apparel cannot be returned.',
      category: 'returns'
    },
    {
      id: '21',
      question: 'How do I return an item?',
      answer: 'Log into your account, go to "Returns & Refunds", select the order you want to return, and follow the instructions. You\'ll receive a return label and detailed instructions for packaging and shipping.',
      category: 'returns'
    },
    {
      id: '22',
      question: 'Who pays for return shipping?',
      answer: 'If the return is due to our error (wrong item, damaged item), we cover the return shipping costs. If you\'re returning an item for other reasons, you\'ll be responsible for the return shipping costs.',
      category: 'returns'
    },
    {
      id: '23',
      question: 'How long do refunds take?',
      answer: 'Once we receive your returned item and verify its condition, refunds are processed within 5-7 business days. You\'ll receive an email confirmation when the refund is processed.',
      category: 'returns'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions', icon: QuestionMarkCircleIcon },
    { id: 'general', name: 'General', icon: UserIcon },
    { id: 'shopping', name: 'Shopping & Orders', icon: ShoppingBagIcon },
    { id: 'payment', name: 'Payment & Billing', icon: CreditCardIcon },
    { id: 'shipping', name: 'Shipping & Delivery', icon: TruckIcon },
    { id: 'account', name: 'Account & Profile', icon: ShieldCheckIcon },
    { id: 'returns', name: 'Returns & Exchanges', icon: QuestionMarkCircleIcon }
  ]

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about shopping, orders, payments, shipping, and more. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openFAQ === faq.id ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try selecting a different category or contact our support team.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-700 mb-6">
              Our customer support team is here to help you 24/7. Get in touch with us for personalized assistance.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Contact Support
              </Link>
              <Link
                href="/returns"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/returns"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">Returns & Refunds</h4>
              <p className="text-sm text-gray-600">Learn about our return policy and how to process returns</p>
            </Link>
            <Link
              href="/account"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">Account Management</h4>
              <p className="text-sm text-gray-600">Manage your profile, addresses, and payment methods</p>
            </Link>
            <Link
              href="/help"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
              <p className="text-sm text-gray-600">Delivery times, costs, and tracking your orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
