// Payment testing and validation utilities
const { getPaymentConfig, validatePaymentConfig } = require('./lib/payment-config')
const { PaymentFactory } = require('./lib/payments')

async function testPaymentConfiguration() {
  console.log('🔧 Testing Payment Configuration...')
  
  const configValidation = validatePaymentConfig()
  
  if (!configValidation.isValid) {
    console.error('❌ Payment configuration errors:')
    configValidation.errors.forEach(error => console.error(`  - ${error}`))
    return false
  }
  
  console.log('✅ Payment configuration is valid')
  
  const config = getPaymentConfig()
  
  // Test MTN Mobile Money
  console.log('📱 Testing MTN Mobile Money...')
  try {
    const mtnProvider = PaymentFactory.createPaymentProvider('MTN_MOBILE_MONEY', config.mtn)
    console.log('✅ MTN Mobile Money provider created successfully')
  } catch (error) {
    console.error('❌ MTN Mobile Money provider creation failed:', error)
  }
  
  // Test Airtel Money
  console.log('📱 Testing Airtel Money...')
  try {
    const airtelProvider = PaymentFactory.createPaymentProvider('AIRTEL_MONEY', config.airtel)
    console.log('✅ Airtel Money provider created successfully')
  } catch (error) {
    console.error('❌ Airtel Money provider creation failed:', error)
  }
  
  // Test Stripe
  console.log('💳 Testing Stripe...')
  try {
    const stripeProvider = PaymentFactory.createPaymentProvider('VISA', config.stripe)
    console.log('✅ Stripe provider created successfully')
  } catch (error) {
    console.error('❌ Stripe provider creation failed:', error)
  }
  
  return true
}

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Flow...')
  
  const testPaymentRequest = {
    amount: 1000, // 1000 UGX
    currency: 'UGX',
    orderId: 'test-order-123',
    customerPhone: '+256700000000',
    customerEmail: 'test@example.com',
    description: 'Test payment'
  }
  
  const config = getPaymentConfig()
  
  // Test MTN Mobile Money payment initiation
  console.log('📱 Testing MTN Mobile Money payment...')
  try {
    const mtnProvider = PaymentFactory.createPaymentProvider('MTN_MOBILE_MONEY', config.mtn)
    const mtnResponse = await mtnProvider.initiatePayment(testPaymentRequest)
    
    if (mtnResponse.success) {
      console.log('✅ MTN payment initiated successfully')
      console.log(`   Transaction ID: ${mtnResponse.transactionId}`)
    } else {
      console.error('❌ MTN payment initiation failed:', mtnResponse.message)
    }
  } catch (error) {
    console.error('❌ MTN payment test error:', error)
  }
  
  // Test Airtel Money payment initiation
  console.log('📱 Testing Airtel Money payment...')
  try {
    const airtelProvider = PaymentFactory.createPaymentProvider('AIRTEL_MONEY', config.airtel)
    const airtelResponse = await airtelProvider.initiatePayment(testPaymentRequest)
    
    if (airtelResponse.success) {
      console.log('✅ Airtel payment initiated successfully')
      console.log(`   Transaction ID: ${airtelResponse.transactionId}`)
    } else {
      console.error('❌ Airtel payment initiation failed:', airtelResponse.message)
    }
  } catch (error) {
    console.error('❌ Airtel payment test error:', error)
  }
  
  // Test Stripe payment initiation
  console.log('💳 Testing Stripe payment...')
  try {
    const stripeProvider = PaymentFactory.createPaymentProvider('VISA', config.stripe)
    const stripeResponse = await stripeProvider.createPaymentIntent(
      testPaymentRequest.amount,
      testPaymentRequest.currency,
      testPaymentRequest.orderId
    )
    
    if (stripeResponse.success) {
      console.log('✅ Stripe payment intent created successfully')
      console.log(`   Payment Intent ID: ${stripeResponse.transactionId}`)
    } else {
      console.error('❌ Stripe payment intent creation failed:', stripeResponse.message)
    }
  } catch (error) {
    console.error('❌ Stripe payment test error:', error)
  }
}

function validateUgandaPhoneNumber(phone) {
  const ugandaPhoneRegex = /^(\+256|256|0)?[7][0-9]{8}$/
  return ugandaPhoneRegex.test(phone.replace(/\s/g, ''))
}

function formatUgandaPhoneNumber(phone) {
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

// Test phone numbers for different providers
const TEST_PHONE_NUMBERS = {
  MTN: '+256700000000',
  AIRTEL: '+256700000001',
  VALID_UGANDA: '+256701234567',
  INVALID: '+1234567890'
}

// Test card numbers for Stripe
const TEST_CARD_NUMBERS = {
  VISA_SUCCESS: '4242424242424242',
  VISA_DECLINE: '4000000000000002',
  MASTERCARD_SUCCESS: '5555555555554444',
  INSUFFICIENT_FUNDS: '4000000000009995'
}

// Run tests if this file is executed directly
if (require.main === module) {
  testPaymentConfiguration()
    .then(() => testPaymentFlow())
    .catch(console.error)
}
