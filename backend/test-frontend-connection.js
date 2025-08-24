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
    try {
      const optionsResponse = await axios.options(`${BASE_URL}/auth/login`);
      console.log('✅ CORS preflight successful:', optionsResponse.status);
    } catch (optionsError) {
      console.log('ℹ️ OPTIONS request info:', optionsError.response?.status || 'No response');
    }

    // Test actual login request with CORS headers
    console.log('\n3. Testing login request with CORS headers...');
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
    console.log('Success:', loginResponse.data.success);
    console.log('Message:', loginResponse.data.message);
    console.log('User:', loginResponse.data.user?.name);
    console.log('Token received:', !!loginResponse.data.token);

    console.log('\n🎉 All connection tests passed!');
    console.log('The frontend should be able to connect to the backend.');

  } catch (error) {
    if (error.response) {
      console.log('❌ HTTP Error:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      if (error.response.headers) {
        console.log('CORS Headers:');
        console.log('  Access-Control-Allow-Origin:', error.response.headers['access-control-allow-origin']);
        console.log('  Access-Control-Allow-Methods:', error.response.headers['access-control-allow-methods']);
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running. Start it with:');
      console.log('   cd backend && npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testConnection();