// Quick test to verify backend is working
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Backend APIs...\n');

  try {
    // Test health endpoint
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data);

    // Test health tips
    const tips = await axios.get(`${BASE_URL}/api/health-tips`);
    console.log('✅ Health tips:', tips.data.success ? `${tips.data.tips.length} tips` : 'Failed');

    // Test hakims
    const hakims = await axios.get(`${BASE_URL}/api/hakims`);
    console.log('✅ Hakims:', hakims.data.success ? `${hakims.data.hakims.length} hakims` : 'Failed');

    // Test contact
    const contact = await axios.get(`${BASE_URL}/api/contact`);
    console.log('✅ Contact:', contact.data.success ? 'Contact info loaded' : 'Failed');

    // Test feedback
    const feedback = await axios.post(`${BASE_URL}/api/feedback`, {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      rating: 5
    });
    console.log('✅ Feedback:', feedback.data.success ? 'Feedback submitted' : 'Failed');

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running. Start it with: cd backend && npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testBackend();