'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token')
      router.push('/auth/forgot-password')
      return
    }

    // Validate the token
    validateToken()
  }, [token, router])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setIsValidToken(true)
      } else {
        toast.error(data.error || 'Invalid or expired reset token')
        router.push('/auth/forgot-password')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      toast.error('Failed to validate reset token')
      router.push('/auth/forgot-password')
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Password reset successfully!')
      } else {
        toast.error(data.error || 'Failed to reset password. Please try again.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset token...</p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/auth/login"
              className="w-full btn-primary btn-md"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary-600">Beisie</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset password'}
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
