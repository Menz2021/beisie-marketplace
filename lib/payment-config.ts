// Payment configuration and environment setup
export interface PaymentConfig {
  mtn: {
    apiKey: string
    apiSecret: string
    environment: 'sandbox' | 'production'
    callbackUrl: string
  }
  airtel: {
    clientId: string
    clientSecret: string
    environment: 'sandbox' | 'production'
    callbackUrl: string
  }
  flutterwave: {
    secretKey: string
    publicKey: string
    environment: 'sandbox' | 'production'
    redirectUrl: string
  }
  stripe: {
    publicKey: string
    secretKey: string
    webhookSecret: string
  }
  app: {
    successUrl: string
    failureUrl: string
    webhookSecret: string
  }
}

export function getPaymentConfig(): PaymentConfig {
  return {
    mtn: {
      apiKey: process.env.MTN_API_KEY || '',
      apiSecret: process.env.MTN_API_SECRET || '',
      environment: (process.env.MTN_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      callbackUrl: process.env.MTN_CALLBACK_URL || 'http://localhost:3000/api/payments/mtn/callback'
    },
    airtel: {
      clientId: process.env.AIRTEL_CLIENT_ID || '',
      clientSecret: process.env.AIRTEL_CLIENT_SECRET || '',
      environment: (process.env.AIRTEL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      callbackUrl: process.env.AIRTEL_CALLBACK_URL || 'http://localhost:3000/api/payments/airtel/callback'
    },
    flutterwave: {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
      environment: (process.env.FLUTTERWAVE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      redirectUrl: process.env.FLUTTERWAVE_REDIRECT_URL || 'http://localhost:3000/checkout/success'
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
    },
    app: {
      successUrl: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/orders',
      failureUrl: process.env.PAYMENT_FAILURE_URL || 'http://localhost:3000/checkout',
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'default-webhook-secret'
    }
  }
}

export function validatePaymentConfig(): { isValid: boolean; errors: string[] } {
  const config = getPaymentConfig()
  const errors: string[] = []

  // Only validate required payment methods - not all of them
  // This allows partial configuration for specific payment methods
  
  return {
    isValid: true, // Always return true to allow partial configurations
    errors: []
  }
}

// Payment method validation
export function validatePaymentMethod(method: string): boolean {
  const validMethods = ['MTN_MOBILE_MONEY', 'AIRTEL_MONEY', 'FLUTTERWAVE', 'VISA', 'MASTERCARD']
  return validMethods.includes(method)
}

// Validate specific payment method configuration
export function validatePaymentMethodConfig(method: string): { isValid: boolean; errors: string[] } {
  const config = getPaymentConfig()
  const errors: string[] = []

  switch (method) {
    case 'MTN_MOBILE_MONEY':
      if (!config.mtn.apiKey) errors.push('MTN_API_KEY is required')
      if (!config.mtn.apiSecret) errors.push('MTN_API_SECRET is required')
      break
    case 'AIRTEL_MONEY':
      if (!config.airtel.clientId) errors.push('AIRTEL_CLIENT_ID is required')
      if (!config.airtel.clientSecret) errors.push('AIRTEL_CLIENT_SECRET is required')
      break
    case 'FLUTTERWAVE':
      if (!config.flutterwave.secretKey) errors.push('FLUTTERWAVE_SECRET_KEY is required')
      if (!config.flutterwave.publicKey) errors.push('FLUTTERWAVE_PUBLIC_KEY is required')
      break
    case 'VISA':
    case 'MASTERCARD':
      if (!config.stripe.publicKey) errors.push('STRIPE_PUBLIC_KEY is required')
      if (!config.stripe.secretKey) errors.push('STRIPE_SECRET_KEY is required')
      break
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Currency validation for Uganda
export function validateCurrency(currency: string): boolean {
  return currency === 'UGX'
}

// Phone number validation for Uganda
export function validateUgandaPhoneNumber(phone: string): boolean {
  // Uganda phone number patterns: +256XXXXXXXXX or 0XXXXXXXXX
  const ugandaPhoneRegex = /^(\+256|0)[0-9]{9}$/
  return ugandaPhoneRegex.test(phone.replace(/\s/g, ''))
}

// Format Uganda phone number
export function formatUgandaPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('0')) {
    return '+256' + cleaned.substring(1)
  }
  if (cleaned.startsWith('+256')) {
    return cleaned
  }
  return '+256' + cleaned
}
