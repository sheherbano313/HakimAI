const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testEndpoints() {
  console.log('🧪 Testing HakimAI Backend Endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${BASE_URL}/health`
    },
    {
      name: 'Root Endpoint',
      method: 'GET',
      url: `${BASE_URL}/`
    },
    {
      name: 'Health Tips',
      method: 'GET',
      url: `${BASE_URL}/api/health-tips`
    },
    {
      name: 'Hakims Directory',
      method: 'GET',
      url: `${BASE_URL}/api/hakims`
    },
    {
      name: 'Contact Info',
      method: 'GET',
      url: `${BASE_URL}/api/contact`
    },
    {
      name: 'Medicinal Plants',
      method: 'GET',
      url: `${BASE_URL}/api/medicinal-plants`
    },
    {
      name: 'Popular Remedies',
      method: 'GET',
      url: `${BASE_URL}/api/remedies/popular`
    },
    {
      name: 'Search Remedies (Local)',
      method: 'POST',
      url: `${BASE_URL}/api/remedies/search`,
      data: { query: 'fever', useAI: false }
    },
    {
      name: 'Submit Feedback',
      method: 'POST',
      url: `${BASE_URL}/api/feedback`,
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test feedback',
        rating: 5
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      let response;
      if (test.method === 'GET') {
        response = await axios.get(test.url, { timeout: 5000 });
      } else if (test.method === 'POST') {
        response = await axios.post(test.url, test.data, { timeout: 5000 });
      }

      console.log(`✅ ${test.name}: ${response.status} - ${response.statusText}`);
      
      // Show some response data for key endpoints
      if (test.name === 'Medicinal Plants' && response.data.data) {
        console.log(`   📊 Found ${response.data.count} plants`);
      } else if (test.name === 'Health Tips' && response.data.tips) {
        console.log(`   📊 Found ${response.data.tips.length} tips`);
      } else if (test.name === 'Hakims Directory' && response.data.hakims) {
        console.log(`   📊 Found ${response.data.hakims.length} hakims`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${test.name}: Server not running (Connection refused)`);
      } else if (error.response) {
        console.log(`❌ ${test.name}: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('🏁 Testing completed!');
  console.log('\n💡 To start the server, run: npm run dev');
  console.log('💡 To test with a real device, update the BASE_URL in frontend config');
}

// Run tests
testEndpoints().catch(console.error);