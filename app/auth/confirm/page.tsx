'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No confirmation token provided')
      return
    }

    confirmEmail(token)
  }, [token])

  const confirmEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Your email has been confirmed successfully! You can now log in.')
      } else {
        if (data.error === 'Token has expired') {
          setStatus('expired')
          setMessage('This confirmation link has expired. Please request a new one.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Email confirmation failed. Please try again.')
        }
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while confirming your email. Please try again.')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <ClockIcon className="h-16 w-16 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />
      case 'error':
      case 'expired':
        return <XCircleIcon className="h-16 w-16 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
      case 'expired':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className={`text-2xl font-bold ${getStatusColor()} mb-4`}>
              {status === 'loading' && 'Confirming Email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
              {status === 'expired' && 'Link Expired'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="space-y-4">
              {status === 'success' && (
                <Link
                  href="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Go to Login
                </Link>
              )}
              
              {(status === 'error' || status === 'expired') && (
                <div className="space-y-2">
                  <Link
                    href="/auth/register"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Register Again
                  </Link>
                  <Link
                    href="/auth/login"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
              
              {status === 'loading' && (
                <p className="text-sm text-gray-500">
                  Please wait while we confirm your email...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
