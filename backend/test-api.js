const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1234567890'
};

let authToken = '';

async function testAPI() {
  console.log('🧪 Testing HakimAI Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', health.data.status);

    // Test 2: User registration
    console.log('\n2️⃣ Testing user registration...');
    const register = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', register.data.message);
    authToken = register.data.token;

    // Test 3: User login
    console.log('\n3️⃣ Testing user login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', login.data.message);

    // Test 4: Get user profile (protected route)
    console.log('\n4️⃣ Testing protected route (profile)...');
    const profile = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile access successful:', profile.data.user.name);

    // Test 5: Get medicinal plants
    console.log('\n5️⃣ Testing medicinal plants endpoint...');
    const plants = await axios.get(`${BASE_URL}/medicinal-plants`);
    console.log('✅ Plants fetched successfully:', plants.data.count, 'plants found');

    // Test 6: Search remedies
    console.log('\n6️⃣ Testing remedy search...');
    const search = await axios.post(`${BASE_URL}/remedies/search`, {
      query: 'headache'
    });
    console.log('✅ Remedy search successful:', search.data.source, 'results');

    // Test 7: Get popular remedies
    console.log('\n7️⃣ Testing popular remedies...');
    const popular = await axios.get(`${BASE_URL}/remedies/popular');
    console.log('✅ Popular remedies fetched:', popular.data.count, 'remedies');

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Make sure you have a valid JWT_SECRET in your .env file');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

// Run tests
testAPI();
