# 🤖 HakimAI RAG (Retrieval-Augmented Generation) System

## Overview

The HakimAI chatbot now uses a sophisticated RAG system that provides more accurate and contextually relevant responses by:

1. **Embedding User Queries** - Converting natural language questions into vector representations
2. **Retrieving Relevant Herbs** - Finding the most similar medicinal plants from the database
3. **Generating Contextual Answers** - Using the retrieved information to generate accurate responses

## 🔄 How It Works

### Step 1: User Query → Embed Query
- User asks a question like "What herbs help with fever?"
- The system converts this into a vector embedding using Gemini's embedding model

### Step 2: Retrieve Relevant Herb Records
- The system compares the query embedding with pre-computed embeddings of all medicinal plants
- Uses cosine similarity to find the most relevant plants (top 3-5 matches)
- Returns plants with highest similarity scores

### Step 3: Send Records + Query to LLM
- Creates a context string with the retrieved plant information
- Sends both the context and original query to Gemini for answer generation

### Step 4: Generate Answer
- LLM generates a comprehensive answer based on the retrieved plant data
- Includes specific plant recommendations, preparation methods, and safety warnings

## 🛠️ Technical Implementation

### Core Components

#### `RAGService` (`utils/ragService.js`)
- **Embedding Generation**: Uses Gemini's embedding model
- **Similarity Calculation**: Cosine similarity between vectors
- **Plant Text Creation**: Formats plant data for embedding
- **Retrieval Logic**: Finds most relevant plants
- **Answer Generation**: Creates contextual responses

#### Enhanced Chatbot Endpoint (`routes/remedies.js`)
- **RAG Integration**: Uses RAG service for primary responses
- **Fallback System**: Simple keyword matching when RAG fails
- **Confidence Scoring**: Indicates response reliability
- **Source Attribution**: Shows which plants were referenced

### API Endpoints

#### `POST /api/remedies/chatbot`
Main chatbot endpoint with RAG integration

**Request:**
```json
{
  "message": "What herbs help with fever?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "RAG response generated successfully",
  "data": {
    "question": "What herbs help with fever?",
    "answer": "Based on my database, I found several herbs that may help with fever...",
    "confidence": "high",
    "sources": [
      {
        "plant": "Artemisia absinthium",
        "localName": "Wormwood",
        "similarity": 0.85
      }
    ],
    "timestamp": "2025-08-24T11:30:00.000Z",
    "method": "rag"
  }
}
```

#### `POST /api/remedies/test-rag`
Testing endpoint for RAG system

## 🧪 Testing

### Run RAG Tests
```bash
cd backend
npm run test-rag
```

### Test Queries
The system is tested with various queries:
- "What herbs help with fever?"
- "How to treat headache naturally?"
- "Remedies for stomach pain"
- "Plants for skin problems"

## 📊 Performance Metrics

### Confidence Levels
- **High** (>0.7 similarity): Very relevant plants found
- **Medium** (0.5-0.7 similarity): Moderately relevant plants
- **Low** (<0.5 similarity): Limited relevance, fallback used

### Response Quality
- **RAG Method**: Contextual, accurate, source-attributed responses
- **Fallback Method**: Basic keyword matching when RAG unavailable

## 🔧 Configuration

### Environment Variables
```bash
GEMINI_API_KEY_T=your_gemini_api_key_here
```

### Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "node-fetch": "^3.3.2"
}
```

## 🚀 Benefits

### Accuracy
- **Contextual Responses**: Answers based on actual plant data
- **Source Attribution**: Shows which plants were referenced
- **Confidence Scoring**: Indicates response reliability

### Reliability
- **Fallback System**: Works even when AI services are down
- **Error Handling**: Graceful degradation on failures
- **Caching**: Embeddings cached for performance

### User Experience
- **Faster Responses**: Pre-computed embeddings reduce latency
- **Better Answers**: More relevant and accurate information
- **Transparency**: Users can see source plants and confidence levels

## 🔮 Future Enhancements

### Planned Improvements
- **Vector Database**: Store embeddings in dedicated vector DB
- **Semantic Search**: More sophisticated similarity algorithms
- **User Feedback**: Learn from user interactions
- **Multi-language**: Support for multiple languages
- **Image Recognition**: Identify plants from photos

### Scalability
- **Batch Processing**: Process multiple queries efficiently
- **Caching Strategy**: Intelligent embedding caching
- **Load Balancing**: Distribute RAG processing across servers

## 📝 Usage Examples

### Frontend Integration
```typescript
const response = await remediesAPI.chatbot({
  message: "What herbs help with fever?"
});

console.log('Confidence:', response.data.confidence);
console.log('Sources:', response.data.sources);
console.log('Answer:', response.data.answer);
```

### Direct API Testing
```bash
curl -X POST http://localhost:5000/api/remedies/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What herbs help with fever?"}'
```

## 🛡️ Safety & Ethics

### Medical Disclaimer
- All responses include safety warnings
- Users advised to consult healthcare professionals
- Traditional knowledge clearly distinguished from medical advice

### Data Privacy
- No user queries stored permanently
- Embeddings generated on-demand
- Secure API key management

---

*The RAG system represents a significant improvement in the HakimAI chatbot's ability to provide accurate, contextual, and reliable information about traditional herbal medicine.*
