'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  contactMethod: 'email' | 'phone' | 'chat'
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactMethod: 'email'
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Visit Our Office',
      details: [
        'Plot 123, Kampala Road',
        'Kampala, Uganda',
        'East Africa'
      ],
      color: 'bg-blue-600'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: [
        '+256 700 123456',
        '+256 700 654321',
        'Mon-Fri: 8AM-6PM'
      ],
      color: 'bg-green-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: [
        'support@beisie.com',
        'info@beisie.com',
        'Response within 24 hours'
      ],
      color: 'bg-purple-600'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      details: [
        'Available 24/7',
        'Instant responses',
        'Click to start chat'
      ],
      color: 'bg-orange-600'
    }
  ]

  const departments = [
    {
      name: 'Customer Support',
      email: 'support@beisie.com',
      phone: '+256 700 123456',
      description: 'General inquiries, order issues, returns, and refunds'
    },
    {
      name: 'Sales & Partnerships',
      email: 'sales@beisie.com',
      phone: '+256 700 123457',
      description: 'Business partnerships, bulk orders, and seller onboarding'
    },
    {
      name: 'Technical Support',
      email: 'tech@beisie.com',
      phone: '+256 700 123458',
      description: 'Website issues, account problems, and technical assistance'
    },
    {
      name: 'Media & Press',
      email: 'media@beisie.com',
      phone: '+256 700 123459',
      description: 'Press inquiries, media partnerships, and public relations'
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
            <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're here to help! Whether you have questions about our products, need support with an order, 
            or want to partner with us, we'd love to hear from you.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+256 700 000 000"
                  />
                </div>
                <div>
                  <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    id="contactMethod"
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="chat">Live Chat</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information & Departments */}
          <div className="space-y-8">
            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <ClockIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Live Chat:</strong> Available 24/7 for instant support
                  </p>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact by Department</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                        {dept.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        <PhoneIcon className="h-4 w-4 inline mr-1" />
                        {dept.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Need Immediate Help?</h3>
              <div className="space-y-3">
                <Link
                  href="/faq"
                  className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-3" />
                    <span>Browse FAQs</span>
                  </div>
                </Link>
                <Link
                  href="/help"
                  className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" />
                    <span>Help Center</span>
                  </div>
                </Link>
                <Link
                  href="/returns"
                  className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                    <span>Return Policy</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Find Us</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map coming soon</p>
              <p className="text-sm text-gray-500 mt-2">
                Plot 123, Kampala Road, Kampala, Uganda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
