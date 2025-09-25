// Simple test script to verify admin login flow
const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing admin login flow...')
    
    // Test 1: Login
    console.log('1. Testing admin login...')
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@beisie.com',
        password: 'admin123'
      }),
      credentials: 'include'
    })
    
    const loginData = await loginResponse.json()
    console.log('Login response:', loginData)
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData.error)
      return
    }
    
    console.log('✅ Login successful')
    
    // Test 2: Verify session
    console.log('2. Testing admin verification...')
    const verifyResponse = await fetch('http://localhost:3000/api/admin/verify', {
      method: 'GET',
      credentials: 'include'
    })
    
    const verifyData = await verifyResponse.json()
    console.log('Verify response:', verifyData)
    
    if (!verifyResponse.ok) {
      console.error('❌ Verification failed:', verifyData.error)
      return
    }
    
    console.log('✅ Verification successful')
    console.log('🎉 Admin login flow working correctly!')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testAdminLogin()
}

module.exports = { testAdminLogin }
