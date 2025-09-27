// Test script to debug registration issue
const testData = {
  email: 'test@example.com',
  phone: '+256700000000',
  name: 'Test User',
  password: 'password123',
  role: 'CUSTOMER'
}

console.log('Testing registration with data:', testData)

fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('Response status:', response.status)
  return response.json()
})
.then(data => {
  console.log('Response data:', data)
})
.catch(error => {
  console.error('Error:', error)
})
