// Payment integration for Uganda - MTN Mobile Money, Airtel Money, Visa/MasterCard

export interface FlutterwaveConfig {
  secretKey: string
  publicKey: string
  environment: 'sandbox' | 'production'
  redirectUrl: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerPhone?: string
  customerEmail: string
  description: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  message: string
  paymentUrl?: string
}

export interface MTNMobileMoneyConfig {
  apiKey: string
  apiSecret: string
  environment: 'sandbox' | 'production'
  callbackUrl: string
}

export interface AirtelMoneyConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
  callbackUrl: string
}

// MTN Mobile Money Integration
export class MTNMobileMoney {
  private config: MTNMobileMoneyConfig

  constructor(config: MTNMobileMoneyConfig) {
    this.config = config
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const baseUrl = this.config.environment === 'production' 
        ? 'https://api.mtn.com/v1' 
        : 'https://sandbox.momodeveloper.mtn.com/v1'

      // Step 1: Get access token
      const tokenResponse = await fetch(`${baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'X-Target-Environment': this.config.environment
        }
      })

      if (!tokenResponse.ok) {
        return {
          success: false,
          status: 'FAILED',
          message: 'Failed to get access token'
        }
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Step 2: Make collection request (this prompts user for PIN)
      const collectionResponse = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Target-Environment': this.config.environment,
          'X-Reference-Id': request.orderId,
          'X-Callback-Url': this.config.callbackUrl
        },
        body: JSON.stringify({
          amount: request.amount.toString(),
          currency: request.currency,
          externalId: request.orderId,
          payer: {
            partyIdType: 'MSISDN',
            partyId: (request.customerPhone || '').replace(/^\+/, '') // Remove + prefix for MTN API
          },
          payerMessage: request.description,
          payeeNote: `Payment for order ${request.orderId}`
        })
      })

      const data = await collectionResponse.json()

      if (collectionResponse.ok) {
        return {
          success: true,
          transactionId: request.orderId, // Use orderId as reference
          status: 'PENDING',
          message: 'Payment request sent. Please check your phone and enter your MoMo PIN to complete the payment.',
          paymentUrl: undefined // MTN doesn't provide a payment URL, user gets SMS/USSD prompt
        }
      } else {
        console.error('MTN API Error:', {
          status: collectionResponse.status,
          statusText: collectionResponse.statusText,
          data: data
        })
        return {
          success: false,
          status: 'FAILED',
          message: data.message || `Payment request failed: ${collectionResponse.statusText}`
        }
      }
    } catch (error) {
      console.error('MTN Payment Error:', error)
      return {
        success: false,
        status: 'FAILED',
        message: 'Network error occurred'
      }
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const baseUrl = this.config.environment === 'production' 
        ? 'https://api.mtn.com/v1' 
        : 'https://sandbox.momodeveloper.mtn.com/v1'

      // Step 1: Get access token
      const tokenResponse = await fetch(`${baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'X-Target-Environment': this.config.environment
        }
      })

      if (!tokenResponse.ok) {
        return {
          success: false,
          status: 'FAILED',
          message: 'Failed to get access token'
        }
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Step 2: Check payment status
      const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.config.environment
        }
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          transactionId,
          status: data.status === 'SUCCESSFUL' ? 'COMPLETED' : 'PENDING',
          message: 'Payment status retrieved'
        }
      } else {
        return {
          success: false,
          status: 'FAILED',
          message: 'Failed to check payment status'
        }
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Network error occurred'
      }
    }
  }
}

// Airtel Money Integration
export class AirtelMoney {
  private config: AirtelMoneyConfig

  constructor(config: AirtelMoneyConfig) {
    this.config = config
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const baseUrl = this.config.environment === 'production' 
        ? 'https://openapiuat.airtel.africa' 
        : 'https://openapiuat.airtel.africa'

      // Get access token
      const tokenResponse = await fetch(`${baseUrl}/auth/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenResponse.ok) {
        return {
          success: false,
          status: 'FAILED',
          message: 'Failed to get access token'
        }
      }

      // Initiate payment
      const paymentResponse = await fetch(`${baseUrl}/merchant/v1/payments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
          'X-Country': 'UG',
          'X-Currency': request.currency
        },
        body: JSON.stringify({
          reference: request.orderId,
          subscriber: {
            msisdn: request.customerPhone
          },
          transaction: {
            amount: request.amount,
            id: request.orderId
          }
        })
      })

      const data = await paymentResponse.json()

      if (paymentResponse.ok) {
        return {
          success: true,
          transactionId: data.data.transaction.id,
          status: 'PENDING',
          message: 'Payment initiated successfully'
        }
      } else {
        return {
          success: false,
          status: 'FAILED',
          message: data.message || 'Payment initiation failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Network error occurred'
      }
    }
  }
}

// Flutterwave Integration
export class FlutterwavePayment {
  private config: FlutterwaveConfig

  constructor(config: FlutterwaveConfig) {
    this.config = config
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const baseUrl = this.config.environment === 'production' 
        ? 'https://api.flutterwave.com/v3' 
        : 'https://api.flutterwave.com/v3'

      const payload = {
        tx_ref: request.orderId,
        amount: request.amount,
        currency: request.currency,
        redirect_url: this.config.redirectUrl,
        customer: {
          email: request.customerEmail,
          phone_number: request.customerPhone,
          name: 'Customer'
        },
        customizations: {
          title: 'Beisie Marketplace',
          description: request.description,
          logo: 'https://beisie-marketplace.vercel.app/logo.png'
        },
        meta: {
          orderId: request.orderId
        }
      }

      const response = await fetch(`${baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        return {
          success: true,
          transactionId: data.data.tx_ref,
          status: 'PENDING',
          message: 'Payment initiated successfully. Redirecting to payment page...',
          paymentUrl: data.data.link
        }
      } else {
        console.error('Flutterwave API Error:', data)
        return {
          success: false,
          status: 'FAILED',
          message: data.message || 'Payment initiation failed'
        }
      }
    } catch (error) {
      console.error('Flutterwave Payment Error:', error)
      return {
        success: false,
        status: 'FAILED',
        message: 'Network error occurred'
      }
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const baseUrl = this.config.environment === 'production' 
        ? 'https://api.flutterwave.com/v3' 
        : 'https://api.flutterwave.com/v3'

      const response = await fetch(`${baseUrl}/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        const transaction = data.data
        return {
          success: true,
          transactionId: transaction.tx_ref,
          status: transaction.status === 'successful' ? 'COMPLETED' : 'PENDING',
          message: 'Payment status retrieved'
        }
      } else {
        return {
          success: false,
          status: 'FAILED',
          message: data.message || 'Failed to check payment status'
        }
      }
    } catch (error) {
      console.error('Flutterwave Status Check Error:', error)
      return {
        success: false,
        status: 'FAILED',
        message: 'Network error occurred'
      }
    }
  }
}

// Stripe Integration for Visa/MasterCard
export class StripePayment {
  private stripe: any

  constructor(stripeSecretKey: string) {
    // In a real implementation, you would import Stripe
    // const Stripe = require('stripe')
    // this.stripe = new Stripe(stripeSecretKey)
  }

  async createPaymentIntent(amount: number, currency: string, orderId: string): Promise<PaymentResponse> {
    try {
      // Mock implementation - replace with actual Stripe integration
      const mockPaymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        status: 'requires_payment_method'
      }

      return {
        success: true,
        transactionId: mockPaymentIntent.id,
        status: 'PENDING',
        message: 'Payment intent created successfully',
        paymentUrl: `/checkout/payment?intent=${mockPaymentIntent.id}`
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Failed to create payment intent'
      }
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      // Mock implementation - replace with actual Stripe integration
      return {
        success: true,
        transactionId: paymentIntentId,
        status: 'COMPLETED',
        message: 'Payment confirmed successfully'
      }
    } catch (error) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Failed to confirm payment'
      }
    }
  }
}

// Payment Factory
export class PaymentFactory {
  static createPaymentProvider(method: string, config: any) {
    switch (method) {
      case 'MTN_MOBILE_MONEY':
        return new MTNMobileMoney(config)
      case 'AIRTEL_MONEY':
        return new AirtelMoney(config)
      case 'FLUTTERWAVE':
        return new FlutterwavePayment(config)
      case 'VISA':
      case 'MASTERCARD':
        return new StripePayment(config.stripeSecretKey)
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }
}

// Payment utilities
export function formatUgandaCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(amount)
}

export function validateUgandaPhoneNumber(phone: string): boolean {
  // Uganda phone number validation
  const ugandaPhoneRegex = /^(\+256|256|0)?[7][0-9]{8}$/
  return ugandaPhoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatUgandaPhoneNumber(phone: string): string {
  // Format phone number to +256XXXXXXXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('256')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+256${cleaned.substring(1)}`
  } else if (cleaned.startsWith('7')) {
    return `+256${cleaned}`
  }
  return phone
}
