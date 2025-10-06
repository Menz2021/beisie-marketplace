require('dotenv').config({ path: '.env.local' })
const { PaymentFactory } = require('./lib/payments')
const { getPaymentConfig } = require('./lib/payment-config')

async function testMTNAPI() {
  console.log('🧪 Testing MTN Mobile Money API Call...')
  
  const config = getPaymentConfig()
  console.log('📋 Configuration:')
  console.log(`   API Key: ${config.mtn.apiKey.substring(0, 8)}...`)
  console.log(`   Environment: ${config.mtn.environment}`)
  console.log(`   Callback URL: ${config.mtn.callbackUrl}`)
  
  const testPaymentRequest = {
    amount: 1000, // 1000 UGX
    currency: 'UGX',
    orderId: 'test-order-' + Date.now(),
    customerPhone: '+256700000000', // Test phone number
    customerEmail: 'test@example.com',
    description: 'Test payment'
  }
  
  console.log('📱 Payment Request:')
  console.log(`   Amount: ${testPaymentRequest.amount} ${testPaymentRequest.currency}`)
  console.log(`   Phone: ${testPaymentRequest.customerPhone}`)
  console.log(`   Order ID: ${testPaymentRequest.orderId}`)
  
  try {
    const mtnProvider = PaymentFactory.createPaymentProvider('MTN_MOBILE_MONEY', config.mtn)
    console.log('🔄 Initiating payment...')
    
    const response = await mtnProvider.initiatePayment(testPaymentRequest)
    
    console.log('📊 Response:')
    console.log(`   Success: ${response.success}`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Message: ${response.message}`)
    console.log(`   Transaction ID: ${response.transactionId}`)
    
    if (!response.success) {
      console.log('❌ Payment initiation failed!')
      console.log('🔍 Possible causes:')
      console.log('   1. Invalid API credentials')
      console.log('   2. Wrong phone number format')
      console.log('   3. Network connectivity issues')
      console.log('   4. MTN API endpoint issues')
    } else {
      console.log('✅ Payment initiated successfully!')
    }
    
  } catch (error) {
    console.error('💥 Error during payment initiation:', error.message)
    console.log('🔍 Error details:', error)
  }
}

testMTNAPI().catch(console.error)
