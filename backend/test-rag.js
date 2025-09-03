const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRAG() {
  console.log('🧪 Testing HakimAI RAG System...\n');

  const testQueries = [
    'What herbs help with fever?',
    'How to treat headache naturally?',
    'Remedies for stomach pain',
    'Plants for skin problems'
  ];

  for (const query of testQueries) {
    try {
      console.log(`Testing query: "${query}"`);
      
      const response = await axios.post(`${BASE_URL}/remedies/test-rag`, {
        query: query
      });

      console.log('✅ Response received:');
      console.log(`   Confidence: ${response.data.data.confidence}`);
      console.log(`   Method: ${response.data.data.method}`);
      console.log(`   Sources: ${response.data.data.sources.length} plants`);
      
      if (response.data.data.sources.length > 0) {
        console.log('   Top sources:');
        response.data.data.sources.slice(0, 2).forEach((source, index) => {
          console.log(`     ${index + 1}. ${source.plant} (${source.localName}) - Similarity: ${source.similarity.toFixed(3)}`);
        });
      }
      
      console.log(`   Answer preview: ${response.data.data.answer.substring(0, 100)}...`);
      console.log('');

    } catch (error) {
      console.log(`❌ Error testing query "${query}":`, error.response?.data?.error || error.message);
      console.log('');
    }
  }

  console.log('🏁 RAG testing completed!');
}

// Run the test
testRAG().catch(console.error);
