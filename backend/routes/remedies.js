const express = require('express');
const JSONDatabase = require('../utils/database');
const auth = require('../middleware/auth');

const router = express.Router();
const plantsDB = new JSONDatabase('medicinal_plants.json');

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

// Helper function to generate fallback responses
function generateFallbackResponse(message, plants) {
  const lowerMessage = message.toLowerCase();
  
  // Search for relevant plants based on the question
  const relevantPlants = plants.filter(plant => {
    const uses = (plant.Uses || '').toLowerCase();
    const symptoms = (plant.Symptoms || '').toLowerCase();
    const scientificName = (plant['Scientific Name'] || '').toLowerCase();
    const localName = (plant['Local Name'] || '').toLowerCase();
    
    return uses.includes(lowerMessage) || 
           symptoms.includes(lowerMessage) ||
           scientificName.includes(lowerMessage) ||
           localName.includes(lowerMessage);
  });
  
  if (relevantPlants.length > 0) {
    const plant = relevantPlants[0];
    return `Based on my database, I found some relevant information:

🌿 Plant: ${plant['Scientific Name']} (${plant['Local Name']})
📋 Uses: ${plant.Uses || 'Not specified'}
🧪 Preparation: ${plant['Preparation & Dosage'] || 'Not specified'}
⚠️ Side Effects: ${plant['Side Effects / Precautions'] || 'Not specified'}

Note: This is basic information from my database. For comprehensive medical advice, please consult a healthcare professional.`;
  }
  
  // Generic response if no specific plants found
  return `I understand you're asking about "${message}". While I have a database of traditional medicinal plants, I'm currently unable to provide a comprehensive AI-generated response. 

However, I can tell you that my database contains information about ${plants.length} medicinal plants from the Himalayan region, including their uses, preparation methods, and safety precautions.

For specific medical advice, I recommend:
1. Consulting a healthcare professional
2. Researching from reliable medical sources
3. Being cautious with traditional remedies

Would you like me to search my database for specific plants or conditions?`;
}

// Chatbot endpoint
router.post('/chatbot', async (req, res) => {
  try {
    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured. Please check your environment variables.'
      });
    }

    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    console.log('Chatbot request received:', message);

    // Get all medicinal plants data
    const allPlants = plantsDB.read();
    console.log(`📚 Loaded ${allPlants.length} medicinal plants for context`);
    
    if (!allPlants || allPlants.length === 0) {
      throw new Error('No medicinal plants data available');
    }
    
    // Create a context string with relevant plant information
    const plantsContext = allPlants.map(plant => {
      return `Plant: ${plant['Scientific Name']} (${plant['Local Name']})
 Family: ${plant.Family}
 Uses: ${plant.Uses || 'Not specified'}
 Preparation: ${plant['Preparation & Dosage'] || 'Not specified'}
 Side Effects: ${plant['Side Effects / Precautions'] || 'Not specified'}
 ---`;
    }).join('\n');
    
    console.log('📝 Plants context length:', plantsContext.length);
    console.log('📝 Sample context (first 500 chars):', plantsContext.substring(0, 500));

    const systemPrompt = `You are a knowledgeable herbal medicine expert specializing in traditional remedies from the Himalayan region. You have access to a comprehensive database of medicinal plants and their properties.

CRITICAL INSTRUCTIONS:
1. ALWAYS base your answers on the provided medicinal plants data
2. If a question cannot be answered using the available data, clearly state: "I don't have enough information about that specific condition in my database. Please consult a healthcare professional."
3. NEVER make up information or suggest remedies not in the data
4. Always emphasize consulting healthcare professionals for serious conditions
5. Include safety warnings and side effects from the data

When providing remedies:
- Reference specific plants from the data when possible
- Include preparation methods and dosages from the data
- Always mention safety precautions and side effects
- Be clear about traditional vs. modern medical advice
- Use the exact plant names from the data

Available medicinal plants data:
${plantsContext}

Remember: Your role is to provide information based on traditional knowledge, but always prioritize safety and recommend professional medical consultation when appropriate.`;

    const userPrompt = `User Question: ${message}

Please provide a helpful response based ONLY on the available medicinal plants data. If the question cannot be answered with the available data, clearly state that and suggest consulting a healthcare professional. Include specific plant recommendations, preparation methods, and safety warnings when applicable.`;

    const fullPrompt = `${systemPrompt}

${userPrompt}`;

    console.log('📝 Full prompt length:', fullPrompt.length);
    
    // Gemini has input limits, so we might need to truncate the context
    const maxPromptLength = 30000; // Conservative limit for Gemini
    let finalPrompt = fullPrompt;
    
    if (fullPrompt.length > maxPromptLength) {
      console.log('⚠️ Prompt too long, truncating context...');
      const contextLength = plantsContext.length;
      const availableLength = maxPromptLength - (fullPrompt.length - contextLength);
      
      if (availableLength > 1000) {
        const truncatedContext = plantsContext.substring(0, availableLength - 1000) + '...';
        finalPrompt = `${systemPrompt.replace(plantsContext, truncatedContext)}

${userPrompt}`;
        console.log('📝 Truncated prompt length:', finalPrompt.length);
      } else {
        throw new Error('Prompt too long even after truncation');
      }
    }

    // Call Gemini API
    try {
      console.log('🌿 Sending request to Gemini API...');
      console.log('🔑 API Key available:', !!GEMINI_API_KEY);
      console.log('📡 API URL:', GEMINI_API_URL.replace(GEMINI_API_KEY, '***HIDDEN***'));

      const geminiResponse = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${finalPrompt}`
            }]
          }]
        })
      });

      console.log('📥 Gemini response status:', geminiResponse.status);
      console.log('📥 Gemini response headers:', Object.fromEntries(geminiResponse.headers.entries()));

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('❌ Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }

      const geminiData = await geminiResponse.json();
      console.log('📋 Gemini response data structure:', Object.keys(geminiData));

      // Check if Gemini response has the expected structure
      if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
        console.error('❌ Unexpected Gemini response structure:', JSON.stringify(geminiData, null, 2));
        throw new Error('Invalid response structure from Gemini API');
      }

      const aiResponse = geminiData.candidates[0].content.parts[0].text;
      console.log('✅ Gemini response text length:', aiResponse.length);

      console.log('Gemini response generated successfully');

      // Return successful response inside the try block where aiResponse is defined
      return res.json({
        success: true,
        message: 'Chatbot response generated',
        data: {
          question: message,
          answer: aiResponse,
          timestamp: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError);

      // Fallback: Provide basic information from local data
      console.log('🔄 Using fallback response from local data...');

      const fallbackResponse = generateFallbackResponse(message, allPlants);

      return res.json({
        success: true,
        message: 'Fallback response generated (Gemini API unavailable)',
        data: {
          question: message,
          answer: fallbackResponse,
          timestamp: new Date().toISOString(),
          note: 'This is a fallback response as the AI service is currently unavailable. Please consult healthcare professionals for medical advice.'
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

    res.status(500).json({
      success: false,
      error: 'Failed to generate chatbot response. Please try again.'
    });
  }
});

module.exports = router;
