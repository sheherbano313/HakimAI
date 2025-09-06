const { GoogleGenerativeAI } = require('@google/generative-ai');
const JSONDatabase = require('./database');

class RAGService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_T);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.embeddingModel = this.genAI.getGenerativeModel({ model: "embedding-001" });
    this.plantsDB = new JSONDatabase('medicinal_plants.json');
    
    // Initialize embeddings cache
    this.embeddingsCache = new Map();
    this.plantsData = null;
  }

  // Generate embeddings for text using Gemini
  async generateEmbedding(text) {
    try {
      const result = await this.embeddingModel.embedContent(text);
      const embedding = await result.embedding;
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  // Calculate cosine similarity between two vectors
  calculateCosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
  }

  // Create searchable text from plant data
  createPlantText(plant) {
    return `
      Plant: ${plant['Scientific Name']} (${plant['Local Name']})
      Family: ${plant.Family || 'Not specified'}
      Uses: ${plant.Uses || 'Not specified'}
      Preparation: ${plant['Preparation & Dosage'] || 'Not specified'}
      Side Effects: ${plant['Side Effects / Precautions'] || 'Not specified'}
      Symptoms: ${plant.Symptoms || 'Not specified'}
    `.trim();
  }

  // Get or create embeddings for all plants
  async initializePlantEmbeddings() {
    if (this.plantsData && this.embeddingsCache.size > 0) {
      console.log(`✅ Using cached ${this.embeddingsCache.size} plant embeddings`);
      return; // Already initialized with embeddings
    }
    
    if (this.plantsData && this.embeddingsCache.size === 0) {
      // Plants loaded but no embeddings - use fallback
      console.log('⚠️ No embeddings available, using fallback search');
      return;
    }
    
    console.log('🔄 Loading plant data...');
    this.plantsData = this.plantsDB.read();
    console.log(`📚 Loaded ${this.plantsData.length} plants`);
    
    // For now, skip embedding generation to avoid delays
    // Embeddings can be pre-generated in a separate process
    console.log('⏭️ Skipping embedding generation for faster response');
  }

  // Retrieve relevant plants based on query
  async retrieveRelevantPlants(query, topK = 5) {
    await this.initializePlantEmbeddings();
    
    // If no embeddings available, use keyword-based search
    if (this.embeddingsCache.size === 0) {
      console.log('🔍 Using keyword-based search (no embeddings available)');
      return this.keywordSearch(query, topK);
    }
    
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Calculate similarities and sort
      const similarities = [];
      
      for (const [key, data] of this.embeddingsCache) {
        const similarity = this.calculateCosineSimilarity(queryEmbedding, data.embedding);
        similarities.push({
          key,
          similarity,
          plant: data.plant,
          text: data.text
        });
      }
      
      // Sort by similarity and return top K
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topResults = similarities.slice(0, topK);
      
      console.log(`🔍 Retrieved ${topResults.length} relevant plants for query: "${query}"`);
      console.log(`📊 Top similarity scores: ${topResults.map(r => r.similarity.toFixed(3)).join(', ')}`);
      
      return topResults;
    } catch (error) {
      console.error('Error retrieving relevant plants:', error);
      // Fallback to keyword search
      console.log('🔄 Falling back to keyword search');
      return this.keywordSearch(query, topK);
    }
  }

  // Keyword-based search for faster response
  keywordSearch(query, topK = 5) {
    const lowerQuery = query.toLowerCase();
    const relevantPlants = [];
    
    // Extract key terms from query
    const queryTerms = lowerQuery.split(/\s+/).filter(term => term.length > 2);
    
    for (const plant of this.plantsData) {
      const uses = (plant.Uses || '').toLowerCase();
      const symptoms = (plant.Symptoms || '').toLowerCase();
      const scientificName = (plant['Scientific Name'] || '').toLowerCase();
      const localName = (plant['Local Name'] || '').toLowerCase();
      
      // Calculate relevance score based on multiple terms
      let score = 0;
      
      for (const term of queryTerms) {
        if (uses.includes(term)) score += 3;
        if (symptoms.includes(term)) score += 2;
        if (scientificName.includes(term)) score += 2;
        if (localName.includes(term)) score += 1;
      }
      
      // Also check for broader matches
      if (lowerQuery.includes('fever') && (uses.includes('fever') || uses.includes('temperature'))) score += 2;
      if (lowerQuery.includes('headache') && (uses.includes('headache') || uses.includes('pain') || uses.includes('migraine'))) score += 2;
      if (lowerQuery.includes('stomach') && (uses.includes('stomach') || uses.includes('gastro') || uses.includes('digest'))) score += 2;
      if (lowerQuery.includes('skin') && (uses.includes('skin') || uses.includes('dermat') || uses.includes('wound'))) score += 2;
      if (lowerQuery.includes('diabetes') && (uses.includes('diabetes') || uses.includes('diabetic') || uses.includes('blood sugar') || uses.includes('glucose') || uses.includes('blood glucose') || uses.includes('sugar'))) score += 4;
      if (lowerQuery.includes('cough') && (uses.includes('cough') || uses.includes('respiratory') || uses.includes('bronchitis') || uses.includes('asthma'))) score += 2;
      if (lowerQuery.includes('cold') && (uses.includes('cold') || uses.includes('flu') || uses.includes('respiratory') || uses.includes('nasal'))) score += 2;
      if (lowerQuery.includes('pain') && (uses.includes('pain') || uses.includes('analgesic') || uses.includes('anti-inflammatory'))) score += 2;
      if (lowerQuery.includes('digest') && (uses.includes('digest') || uses.includes('stomach') || uses.includes('gastro') || uses.includes('intestinal'))) score += 2;
      if (lowerQuery.includes('liver') && (uses.includes('liver') || uses.includes('hepat') || uses.includes('jaundice'))) score += 2;
      if (lowerQuery.includes('kidney') && (uses.includes('kidney') || uses.includes('renal') || uses.includes('urinary'))) score += 2;
      
      if (score > 0) {
        relevantPlants.push({
          key: plant['Scientific Name'],
          similarity: Math.min(score / 10, 1), // Normalize to 0-1 range
          plant: plant,
          text: this.createPlantText(plant)
        });
      }
    }
    
    // Sort by relevance score and return top K
    relevantPlants.sort((a, b) => b.similarity - a.similarity);
    const topResults = relevantPlants.slice(0, topK);
    
    console.log(`🔍 Keyword search found ${topResults.length} relevant plants for query: "${query}"`);
    if (topResults.length > 0) {
      console.log(`📊 Top relevance scores: ${topResults.map(r => r.similarity.toFixed(3)).join(', ')}`);
    }
    
    return topResults;
  }

  // Generate answer using RAG
  async generateRAGAnswer(query) {
    try {
      console.log(`🤖 RAG: Processing query: "${query}"`);
      
      // Step 1: Retrieve relevant plants
      const relevantPlants = await this.retrieveRelevantPlants(query, 3);
      
      if (relevantPlants.length === 0) {
        // Use the improved fallback method
        return this.generateFallbackAnswer(query, this.plantsData || []);
      }
      
      // Step 2: Create context from relevant plants
      const context = relevantPlants.map(result => result.text).join('\n\n');
      
      // Step 3: Generate answer using LLM or fallback to improved response
      try {
        const prompt = `You are a knowledgeable herbal medicine expert specializing in traditional remedies from the Himalayan region.

CRITICAL INSTRUCTIONS:
1. Base your answer ONLY on the provided medicinal plants data
2. If the question cannot be answered using the available data, clearly state: "I don't have enough information about that specific condition in my database. Please consult a healthcare professional."
3. NEVER make up information or suggest remedies not in the data
4. Always emphasize consulting healthcare professionals for serious conditions
5. Include safety warnings and side effects from the data
6. For diabetes questions, look for plants that mention diabetes, blood sugar, glucose, or anti-diabetic properties
7. Provide specific plant names, preparation methods, and dosages from the data

Available medicinal plants data:
${context}

User Question: ${query}

Please provide a helpful response based ONLY on the available medicinal plants data. Include specific plant recommendations, preparation methods, and safety warnings when applicable.`;

        const result = await this.model.generateContent(prompt);
        const answer = result.response.text();
        
        console.log(`✅ RAG: Generated answer for query: "${query}"`);
        
        return {
          answer,
          sources: relevantPlants.map(r => ({
            plant: r.plant['Scientific Name'],
            localName: r.plant['Local Name'],
            similarity: r.similarity
          })),
          confidence: relevantPlants[0].similarity > 0.7 ? 'high' : 'medium'
        };
      } catch (llmError) {
        console.log('⚠️ LLM failed, using improved fallback with found plants');
        // Use improved fallback with the found plants
        const plants = relevantPlants.map(r => r.plant);
        return this.generateFallbackAnswer(query, plants);
      }
      
    } catch (error) {
      console.error('Error generating RAG answer:', error);
      throw error;
    }
  }

  // Fallback method when RAG fails
  generateFallbackAnswer(query, plants) {
    const lowerQuery = query.toLowerCase();
    
    // Handle general greetings and questions
    if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('hey')) {
      return {
        answer: `Hello! I'm your Herbal Medicine AI Assistant specializing in Himalayan medicinal plants. I can help you with:

🌿 Information about specific medicinal plants
💊 Traditional remedies for various health conditions
📚 Preparation methods and dosages
⚠️ Safety precautions and side effects

What would you like to know about herbal medicine? You can ask about specific conditions like diabetes, fever, cough, or any other health concerns.`,
        sources: [],
        confidence: 'high'
      };
    }
    
    // Handle general questions about capabilities
    if (lowerQuery.includes('what') && (lowerQuery.includes('can') || lowerQuery.includes('do'))) {
      return {
        answer: `I can help you with information about Himalayan medicinal plants! Here's what I can do:

🔍 **Search for specific plants** - Ask about any plant by name
💊 **Find remedies for conditions** - Tell me about symptoms or health issues
📋 **Get preparation methods** - Learn how to prepare herbal remedies
⚠️ **Safety information** - Understand precautions and side effects
🌿 **Plant identification** - Learn about local and scientific names

My database contains ${plants.length} medicinal plants from the Himalayan region. Try asking something like:
- "What herbs help with diabetes?"
- "Tell me about chamomile"
- "How to treat fever naturally?"
- "What plants help with digestive issues?"`,
        sources: [],
        confidence: 'high'
      };
    }
    
    // Simple keyword matching for specific queries
    const relevantPlants = plants.filter(plant => {
      const uses = (plant.Uses || '').toLowerCase();
      const symptoms = (plant.Symptoms || '').toLowerCase();
      const scientificName = (plant['Scientific Name'] || '').toLowerCase();
      const localName = (plant['Local Name'] || '').toLowerCase();
      
      return uses.includes(lowerQuery) || 
             symptoms.includes(lowerQuery) ||
             scientificName.includes(lowerQuery) ||
             localName.includes(lowerQuery);
    });
    
    if (relevantPlants.length > 0) {
      const plant = relevantPlants[0];
      return {
        answer: `Based on my database, I found some relevant information:

🌿 **Plant:** ${plant['Scientific Name']} (${plant['Local Name']})
📋 **Uses:** ${plant.Uses || 'Not specified'}
🧪 **Preparation:** ${plant['Preparation & Dosage'] || 'Not specified'}
⚠️ **Side Effects:** ${plant['Side Effects / Precautions'] || 'Not specified'}

**Note:** This is basic information from my database. For comprehensive medical advice, please consult a healthcare professional.`,
        sources: [{
          plant: plant['Scientific Name'],
          localName: plant['Local Name'],
          similarity: 0.7
        }],
        confidence: 'medium'
      };
    }
    
    // Enhanced response for no matches
    return {
      answer: `I understand you're asking about "${query}". While I have a comprehensive database of ${plants.length} Himalayan medicinal plants, I couldn't find specific matches for your query.

**Here's how I can help you better:**

🔍 **Be more specific** - Try asking about particular conditions like:
   - "What herbs help with diabetes?"
   - "Plants for treating fever"
   - "Remedies for cough and cold"

🌿 **Ask about specific plants** - You can ask about any plant by name:
   - "Tell me about chamomile"
   - "What is Rhodiola used for?"

💊 **Describe symptoms** - Tell me about specific health concerns:
   - "I have digestive issues"
   - "Help with skin problems"

**Remember:** Always consult healthcare professionals for serious medical conditions. I'm here to provide information about traditional herbal remedies, not replace medical advice.`,
      sources: [],
      confidence: 'medium'
    };
  }
}

module.exports = RAGService;
