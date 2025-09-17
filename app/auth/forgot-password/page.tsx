'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEmailSent(true)
        toast.success('Password reset link sent to your email!')
      } else {
        toast.error(data.error || 'Failed to send reset link. Please try again.')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Failed to send reset link. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsEmailSent(false)}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                try again
              </button>
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary-600">Beisie</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
