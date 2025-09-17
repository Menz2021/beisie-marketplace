'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function ReturnsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Return & Refund Policy</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Return & Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              At Beisie, we want you to be completely satisfied with your purchase. We understand that sometimes 
              things don't work out as expected, and we're here to help make the return process as smooth as possible.
            </p>
          </div>

          {/* Return Eligibility */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
              Return Eligibility
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>30-Day Return Window:</strong> Items must be returned within 30 days of delivery date</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Original Condition:</strong> Products must be in original condition with all tags, packaging, and accessories included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Working Electronics:</strong> Electronic items must be in working condition and free from damage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Proof of Purchase:</strong> Original receipt or order confirmation required</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
              Non-Returnable Items
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Personalized Items:</strong> Custom-made or personalized products</span>
                </li>
                <li className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Perishable Goods:</strong> Food items, flowers, and other perishable products</span>
                </li>
                <li className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Intimate Items:</strong> Underwear, swimwear, and other intimate apparel</span>
                </li>
                <li className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Digital Products:</strong> Software, digital downloads, and online services</span>
                </li>
                <li className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Damaged Items:</strong> Products damaged by misuse or normal wear and tear</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Refund Process */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
              Refund Process
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Step 1: Submit Request</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Log into your account</li>
                    <li>• Go to "Returns & Refunds" section</li>
                    <li>• Select the order you want to return</li>
                    <li>• Choose refund type (full or partial)</li>
                    <li>• Provide reason and details</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Step 2: Review & Approval</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• We review your request within 2-3 business days</li>
                    <li>• You'll receive email notification of decision</li>
                    <li>• If approved, you'll get return instructions</li>
                    <li>• If rejected, we'll explain the reason</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Step 3: Return Items</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Package items securely in original packaging</li>
                    <li>• Include return label (if provided)</li>
                    <li>• Drop off at designated location</li>
                    <li>• Keep tracking number for reference</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Step 4: Refund Processing</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• We inspect returned items (1-2 business days)</li>
                    <li>• Process refund to original payment method</li>
                    <li>• Refund appears in 5-7 business days</li>
                    <li>• You'll receive confirmation email</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Methods */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Refund Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Original Payment Method</h4>
                <p className="text-sm text-gray-600">Refunds are issued to the same payment method used for the original purchase</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Store Credit</h4>
                <p className="text-sm text-gray-600">In some cases, we may offer store credit as an alternative refund method</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer</h4>
                <p className="text-sm text-gray-600">For large amounts, we may process refunds via direct bank transfer</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
              Important Notes
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-700">
                <li>• Return shipping costs are the responsibility of the customer unless the return is due to our error</li>
                <li>• Refunds may take 5-7 business days to appear in your account after processing</li>
                <li>• We reserve the right to refuse returns that don't meet our policy requirements</li>
                <li>• Sale items and clearance products may have different return policies</li>
                <li>• International returns may be subject to additional fees and longer processing times</li>
              </ul>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Our customer support team is here to help with any questions about returns or refunds.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@testmarketplace.ug</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">+256 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/account"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Request a Return
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
