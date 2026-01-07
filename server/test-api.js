// Simple test script to verify the order API endpoint
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testHealthCheck() {
  console.log('Testing health check endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testOrdersByEmail(email) {
  console.log(`\nTesting orders by email endpoint with: ${email}`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Orders fetched successfully. Found ${data.length} orders.`);
      if (data.length > 0) {
        console.log('First order:', {
          id: data[0]._id,
          status: data[0].status,
          total: data[0].totalPrice,
          items: data[0].orderItems.length,
        });
      }
    } else {
      console.log('⚠️ Response not OK:', data);
    }
    return true;
  } catch (error) {
    console.error('❌ Orders by email test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('=== API Endpoint Tests ===\n');
  
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.log('\n❌ Server is not running. Please start the server first:');
    console.log('   cd server && npm run dev');
    return;
  }
  
  // Test with a sample email (replace with actual email from your database)
  await testOrdersByEmail('jeevasathya@gmail.com');
  
  console.log('\n=== Tests Complete ===');
}

runTests();
