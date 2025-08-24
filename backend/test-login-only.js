const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testLogin() {
  console.log('🧪 Testing Login with existing user...\n');

  try {
    // Test user login
    console.log('Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));

    // Test protected route
    console.log('\nTesting protected route (profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('✅ Profile access successful!');
    console.log('Profile response:', JSON.stringify(profileResponse.data, null, 2));

    console.log('\n🎉 Authentication is working correctly!');
    console.log('\n📝 You can now use these credentials in the frontend:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');

  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running. Start it with: npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testLogin();