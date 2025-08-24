// Test frontend connection to backend
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🧪 Testing Frontend to Backend Connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend is reachable:', healthResponse.data.status);

    // Test CORS preflight (OPTIONS request)
    console.log('\n2. Testing CORS preflight...');
    const optionsResponse = await axios.options(`${BASE_URL}/auth/login`);
    console.log('✅ CORS preflight successful:', optionsResponse.status);

    // Test actual login request
    console.log('\n3. Testing login request...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ Login request successful!');
    console.log('Response status:', loginResponse.status);
    console.log('Response data:', JSON.stringify(loginResponse.data, null, 2));

    console.log('\n🎉 All connection tests passed!');
    console.log('The frontend should be able to connect to the backend.');

  } catch (error) {
    if (error.response) {
      console.log('❌ HTTP Error:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running. Start it with:');
      console.log('   cd backend && npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testConnection();