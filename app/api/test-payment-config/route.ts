import { NextRequest, NextResponse } from 'next/server'
import { getPaymentConfig, validatePaymentConfig } from '@/lib/payment-config'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing payment configuration...')
    
    const config = getPaymentConfig()
    const validation = validatePaymentConfig()
    
    console.log('📋 Configuration:', {
      mtnApiKey: config.mtn.apiKey ? `${config.mtn.apiKey.substring(0, 8)}...` : 'NOT SET',
      mtnApiSecret: config.mtn.apiSecret ? `${config.mtn.apiSecret.substring(0, 8)}...` : 'NOT SET',
      mtnEnvironment: config.mtn.environment,
      mtnCallbackUrl: config.mtn.callbackUrl,
      isValid: validation.isValid,
      errors: validation.errors
    })
    
    return NextResponse.json({
      success: true,
      config: {
        mtnApiKey: config.mtn.apiKey ? `${config.mtn.apiKey.substring(0, 8)}...` : 'NOT SET',
        mtnApiSecret: config.mtn.apiSecret ? `${config.mtn.apiSecret.substring(0, 8)}...` : 'NOT SET',
        mtnEnvironment: config.mtn.environment,
        mtnCallbackUrl: config.mtn.callbackUrl,
        isValid: validation.isValid,
        errors: validation.errors
      }
    })
  } catch (error) {
    console.error('❌ Payment config test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
