'use client'

import { SessionProvider } from 'next-auth/react'
import { CartSyncProvider } from './CartSyncProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSyncProvider>
        {children}
      </CartSyncProvider>
    </SessionProvider>
  )
}
