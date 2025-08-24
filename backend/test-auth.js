const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test user registration
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+92-300-1234567'
    });

    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Token received:', !!registerResponse.data.token);

    // Test user login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('   User:', loginResponse.data.user.name);
    console.log('   Token received:', !!loginResponse.data.token);

    // Test protected route
    console.log('\n3. Testing protected route (profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('✅ Profile access successful');
    console.log('   Profile name:', profileResponse.data.user.name);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📝 Test credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');

  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running. Start it with: npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testAuth();