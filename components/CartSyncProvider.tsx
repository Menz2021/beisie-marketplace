'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const { syncWithBackend, isAuthenticated } = useCartStore()

  useEffect(() => {
    // Only sync when session is loaded and user is authenticated
    if (status === 'authenticated' && session?.user?.id) {
      syncWithBackend()
    }
  }, [status, session?.user?.id, syncWithBackend])

  return <>{children}</>
}
