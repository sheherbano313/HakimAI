require('dotenv').config();
const RAGService = require('./utils/ragService');

async function testRAGDirect() {
  console.log('🧪 Testing HakimAI RAG System Directly...\n');

  try {
    // Initialize RAG service
    const ragService = new RAGService();
    console.log('✅ RAG Service initialized');

    const testQueries = [
      'What herbs help with fever?',
      'How to treat headache naturally?',
      'Remedies for stomach pain',
      'Plants for skin problems'
    ];

    for (const query of testQueries) {
      try {
        console.log(`\n🔍 Testing query: "${query}"`);
        
        // Test RAG answer generation
        const result = await ragService.generateRAGAnswer(query);
        
        console.log('✅ RAG Response:');
        console.log(`   Confidence: ${result.confidence}`);
        console.log(`   Sources: ${result.sources.length} plants`);
        
        if (result.sources.length > 0) {
          console.log('   Top sources:');
          result.sources.slice(0, 2).forEach((source, index) => {
            console.log(`     ${index + 1}. ${source.plant} (${source.localName}) - Similarity: ${source.similarity.toFixed(3)}`);
          });
        }
        
        console.log(`   Answer preview: ${result.answer.substring(0, 150)}...`);
        
      } catch (error) {
        console.log(`❌ Error testing query "${query}":`, error.message);
      }
    }

    console.log('\n🏁 Direct RAG testing completed!');

  } catch (error) {
    console.error('❌ RAG Service initialization failed:', error.message);
  }
}

// Run the test
testRAGDirect().catch(console.error);
