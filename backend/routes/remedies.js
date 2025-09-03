const express = require('express');
const JSONDatabase = require('../utils/database');
const auth = require('../middleware/auth');
const RAGService = require('../utils/ragService');

const router = express.Router();
const plantsDB = new JSONDatabase('medicinal_plants.json');
const ragService = new RAGService();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY_T;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Log API configuration status
console.log('🔧 Remedies API Configuration:');
console.log('🔑 Gemini API Key configured:', !!GEMINI_API_KEY);
console.log('📡 Gemini API URL configured:', !!GEMINI_API_URL);
if (!GEMINI_API_KEY) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in environment variables');
}


// POST /api/remedies/search - Search for remedies (Local + AI fallback)
router.post('/search', async (req, res) => {
  try {
    const { query, useAI = false } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1️⃣ Local dataset search
    const plants = plantsDB.read();
    const localResults = plants.filter(plant => 
      plant['Scientific Name']?.toLowerCase().includes(query.toLowerCase()) ||
      plant['Local Name']?.toLowerCase().includes(query.toLowerCase()) ||
      plant['Uses']?.toLowerCase().includes(query.toLowerCase()) ||
      plant['Symptoms']?.toLowerCase().includes(query.toLowerCase())
    );

    if (localResults.length > 0) {
      console.log(`✅ Found ${localResults.length} local matches for "${query}"`);
      return res.json({
        success: true,
        source: 'local',
        query,
        count: localResults.length,
        data: localResults
      });
    }

    // 2️⃣ AI fallback (if requested or no local results)
    if (useAI || localResults.length === 0) {
      try {
        // Check if Gemini API key is available
        if (!GEMINI_API_KEY) {
          throw new Error('Gemini API key is not configured');
        }
        
        console.log(`🤖 Querying Gemini for: "${query}"`);
        
        const geminiResponse = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a knowledgeable herbal medicine expert. Provide detailed, accurate information about herbal remedies for various health conditions. 
                Include: plant names, preparation methods, dosage recommendations, safety precautions, and contraindications.
                Format your response in a clear, structured way that's easy to understand.
                
                Find herbal remedies and natural treatments for: ${query}. 
                Please provide comprehensive information including plant names, how to prepare them, dosage, and safety warnings.`
              }]
            }]
          })
        });

        if (!geminiResponse.ok) {
          throw new Error(`Gemini API error: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        const aiResponse = geminiData.candidates[0].content.parts[0].text;

        return res.json({
          success: true,
          source: 'ai',
          query,
          data: {
            remedy: aiResponse,
            note: 'This information is AI-generated and should be verified with healthcare professionals before use.'
          }
        });
      } catch (aiError) {
        console.error('❌ Gemini API error:', aiError.message);
        
        // If AI fails, return local results even if empty
        return res.json({
          success: true,
          source: 'local',
          query,
          count: 0,
          data: [],
          message: 'No local remedies found, and AI service is currently unavailable.'
        });
      }
    }

    // Fallback response
    res.json({
      success: true,
      source: 'local',
      query,
      count: 0,
      data: [],
      message: 'No remedies found for your query.'
    });

  } catch (error) {
    console.error('Remedy search error:', error);
    res.status(500).json({ error: 'Failed to search remedies' });
  }
});

// GET /api/remedies/popular - Get popular/common remedies
router.get('/popular', (req, res) => {
  try {
    const plants = plantsDB.read();
    
    // Get first 10 plants as popular (you can implement more sophisticated logic)
    const popularRemedies = plants.slice(0, 10).map(plant => ({
      id: plant.id,
      name: plant['Local Name'],
      scientificName: plant['Scientific Name'],
      uses: plant['Uses'],
      symptoms: plant['Symptoms']
    }));

    res.json({
      success: true,
      count: popularRemedies.length,
      data: popularRemedies
    });
  } catch (error) {
    console.error('Error fetching popular remedies:', error);
    res.status(500).json({ error: 'Failed to fetch popular remedies' });
  }
});

// GET /api/remedies/symptoms - Get remedies by symptom
router.get('/symptoms/:symptom', (req, res) => {
  try {
    const { symptom } = req.params;
    const plants = plantsDB.read();
    
    const remedies = plants.filter(plant => 
      plant['Uses']?.toLowerCase().includes(symptom.toLowerCase()) ||
      plant['Symptoms']?.toLowerCase().includes(symptom.toLowerCase())
    );

    res.json({
      success: true,
      symptom,
      count: remedies.length,
      data: remedies
    });
  } catch (error) {
    console.error('Error fetching remedies by symptom:', error);
    res.status(500).json({ error: 'Failed to fetch remedies' });
  }
});

// POST /api/remedies/save - Save a remedy to user's favorites (Protected route)
router.post('/save', auth, (req, res) => {
  try {
    const { remedyId, notes } = req.body;
    
    if (!remedyId) {
      return res.status(400).json({ error: 'Remedy ID is required' });
    }

    // Here you could implement a user favorites system
    // For now, just return success
    res.json({
      success: true,
      message: 'Remedy saved to favorites',
      data: { remedyId, notes, userId: req.user.userId }
    });
  } catch (error) {
    console.error('Error saving remedy:', error);
    res.status(500).json({ error: 'Failed to save remedy' });
  }
});



// Chatbot endpoint with RAG (Retrieval-Augmented Generation)
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    console.log('🤖 RAG Chatbot: Processing query:', message);

    // Get all medicinal plants data for fallback
    const allPlants = plantsDB.read();
    
    if (!allPlants || allPlants.length === 0) {
      throw new Error('No medicinal plants data available');
    }

    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.log('⚠️ Gemini API key not available, using fallback response');
      const fallbackResult = ragService.generateFallbackAnswer(message, allPlants);
      
      return res.json({
        success: true,
        message: 'Fallback response generated (AI service unavailable)',
        data: {
          question: message,
          answer: fallbackResult.answer,
          confidence: fallbackResult.confidence,
          sources: fallbackResult.sources,
          timestamp: new Date().toISOString(),
          method: 'fallback',
          note: 'This is a fallback response as the AI service is currently unavailable. Please consult healthcare professionals for medical advice.'
        }
      });
    }

    // Set a timeout for the RAG operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('RAG operation timeout')), 20000); // 20 seconds timeout
    });

    try {
      // Use RAG system to generate answer with timeout
      const ragResult = await Promise.race([
        ragService.generateRAGAnswer(message),
        timeoutPromise
      ]);
      
      console.log(`✅ RAG: Generated answer with confidence: ${ragResult.confidence}`);
      
      return res.json({
        success: true,
        message: 'RAG response generated successfully',
        data: {
          question: message,
          answer: ragResult.answer,
          confidence: ragResult.confidence,
          sources: ragResult.sources,
          timestamp: new Date().toISOString(),
          method: 'rag'
        }
      });
      
    } catch (ragError) {
      console.error('❌ RAG system failed:', ragError.message);
      
      // Fallback to simple keyword matching
      console.log('🔄 Using fallback response from local data...');
      
      const fallbackResult = ragService.generateFallbackAnswer(message, allPlants);
      
      return res.json({
        success: true,
        message: 'Fallback response generated (RAG system unavailable)',
        data: {
          question: message,
          answer: fallbackResult.answer,
          confidence: fallbackResult.confidence,
          sources: fallbackResult.sources,
          timestamp: new Date().toISOString(),
          method: 'fallback',
          note: 'This is a fallback response as the RAG system is currently unavailable. Please consult healthcare professionals for medical advice.'
        }
      });
    }

  } catch (error) {
    console.error('Chatbot error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Gemini API key is invalid or missing.'
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('429')) {
      return res.status(429).json({
        success: false,
        error: 'Gemini API quota exceeded. Please try again later.'
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'Request timeout. Please try again.'
      });
    }

    // Provide a helpful fallback response even for unexpected errors
    const fallbackMessage = `I understand you're asking about "${message}". While I'm experiencing some technical difficulties, here are some general tips about herbal medicine:

• Always consult with healthcare professionals before using any herbal remedies
• Research the specific herb and its potential side effects
• Start with small doses and monitor your body's response
• Be aware of potential interactions with medications
• Purchase herbs from reputable sources

For specific advice about "${message}", I recommend consulting with a qualified herbalist or healthcare provider.`;

    return res.json({
      success: true,
      message: 'Fallback response due to technical issues',
      data: {
        question: message,
        answer: fallbackMessage,
        confidence: 0.5,
        sources: [],
        timestamp: new Date().toISOString(),
        method: 'error-fallback',
        note: 'This response was generated due to technical difficulties. Please consult healthcare professionals for medical advice.'
      }
    });
  }
});

// Test RAG system endpoint
router.post('/test-rag', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    console.log('🧪 Testing RAG system with query:', query);

    // Test the RAG system
    const ragResult = await ragService.generateRAGAnswer(query);
    
    res.json({
      success: true,
      message: 'RAG test completed',
      data: {
        query,
        answer: ragResult.answer,
        confidence: ragResult.confidence,
        sources: ragResult.sources,
        method: 'rag'
      }
    });

  } catch (error) {
    console.error('RAG test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test RAG system'
    });
  }
});

module.exports = router;
