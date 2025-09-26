const fetch = require('node-fetch');

async function testAdminProductCreation() {
  const baseUrl = 'http://localhost:3000'; // Change to your production URL if testing live
  
  console.log('Testing admin product creation...');
  
  // Test data
  const testProduct = {
    name: 'Test Product',
    description: 'This is a test product description',
    price: 100,
    stock: 10,
    categoryId: 'test-category-id', // This might not exist
    vendorId: 'test-vendor-id', // This might not exist
    isActive: 'true',
    isFeatured: 'false',
    deliveryTimeDays: '1',
    deliveryTimeText: 'Next day delivery'
  };
  
  // Create FormData
  const formData = new FormData();
  Object.keys(testProduct).forEach(key => {
    formData.append(key, testProduct[key]);
  });
  
  try {
    const response = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Error creating product:', data.error);
      if (data.details) {
        console.error('Validation details:', data.details);
      }
    } else {
      console.log('Product created successfully!');
    }
    
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testAdminProductCreation();
