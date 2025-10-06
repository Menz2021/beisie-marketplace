// Simple payment configuration test
require('dotenv').config({ path: '.env.local' })

function testPaymentConfiguration() {
  console.log('🔧 Testing Payment Configuration...')
  
  const errors = []
  
  // Check MTN Mobile Money
  if (!process.env.MTN_API_KEY) {
    errors.push('MTN_API_KEY is required')
  } else {
    console.log('✅ MTN_API_KEY is set')
  }
  
  if (!process.env.MTN_API_SECRET) {
    errors.push('MTN_API_SECRET is required')
  } else {
    console.log('✅ MTN_API_SECRET is set')
  }
  
  if (!process.env.MTN_ENVIRONMENT) {
    errors.push('MTN_ENVIRONMENT is required')
  } else {
    console.log(`✅ MTN_ENVIRONMENT is set to: ${process.env.MTN_ENVIRONMENT}`)
  }
  
  if (errors.length > 0) {
    console.error('❌ Payment configuration errors:')
    errors.forEach(error => console.error(`  - ${error}`))
    return false
  }
  
  console.log('✅ Payment configuration is valid')
  return true
}

function testUgandaPhoneNumber(phone) {
  const ugandaPhoneRegex = /^(\+256|256|0)?[7][0-9]{8}$/
  return ugandaPhoneRegex.test(phone.replace(/\s/g, ''))
}

// Test phone numbers
const testPhones = [
  '+256701234567',
  '0701234567',
  '256701234567',
  '+1234567890' // Invalid
]

console.log('📱 Testing Uganda phone number validation...')
testPhones.forEach(phone => {
  const isValid = testUgandaPhoneNumber(phone)
  console.log(`${isValid ? '✅' : '❌'} ${phone} - ${isValid ? 'Valid' : 'Invalid'}`)
})

// Run the main test
testPaymentConfiguration()
