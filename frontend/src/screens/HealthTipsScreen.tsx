import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { healthTipsAPI, HealthTip, HealthTipsResponse } from '../api/apiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function HealthTipsScreen() {
  const [viewMode, setViewMode] = useState<'chat' | 'tips'>('chat'); // 'chat' or 'tips'
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "💚 Hello! I'm your Health & Wellness AI Assistant. I can provide personalized health tips, nutrition advice, lifestyle recommendations, and wellness guidance. What health topic would you like to discuss?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const response: HealthTipsResponse = await healthTipsAPI.getTips();
      if (response.success) {
        setTips(response.tips);
      } else {
        Alert.alert('Error', 'Failed to fetch health tips');
      }
    } catch (error: any) {
      console.error('❌ Error fetching health tips:', error);
      Alert.alert('Error', 'Failed to fetch health tips');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log('Sending health message to chatbot:', currentInput);
      
      // For now, we'll use a simple response system
      // In the future, you can integrate with a health-specific AI service
      const healthResponse = generateHealthResponse(currentInput);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: healthResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Health chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHealthResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('diet') || lowerQuery.includes('nutrition') || lowerQuery.includes('food')) {
      return "🍎 **Nutrition Tips:**\n\n• Eat a rainbow of fruits and vegetables daily\n• Include lean proteins like fish, chicken, and legumes\n• Choose whole grains over refined grains\n• Stay hydrated with 8-10 glasses of water\n• Limit processed foods and added sugars\n\nRemember: A balanced diet is key to good health!";
    }
    
    if (lowerQuery.includes('exercise') || lowerQuery.includes('workout') || lowerQuery.includes('fitness')) {
      return "💪 **Fitness Recommendations:**\n\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 times per week\n• Don't forget flexibility exercises like yoga\n• Start slowly and gradually increase intensity\n• Find activities you enjoy to stay motivated\n\nConsistency is more important than intensity!";
    }
    
    if (lowerQuery.includes('sleep') || lowerQuery.includes('rest')) {
      return "😴 **Sleep Hygiene Tips:**\n\n• Aim for 7-9 hours of quality sleep\n• Maintain a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens 1 hour before bedtime\n• Limit caffeine after 2 PM\n\nGood sleep is essential for health and recovery!";
    }
    
    if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || lowerQuery.includes('mental')) {
      return "🧘 **Mental Health & Stress Management:**\n\n• Practice deep breathing exercises\n• Try meditation or mindfulness\n• Engage in regular physical activity\n• Maintain social connections\n• Set boundaries and learn to say no\n• Consider talking to a mental health professional\n\nYour mental health is just as important as physical health!";
    }
    
    if (lowerQuery.includes('weight') || lowerQuery.includes('obesity') || lowerQuery.includes('fat')) {
      return "⚖️ **Healthy Weight Management:**\n\n• Focus on sustainable lifestyle changes\n• Combine diet and exercise for best results\n• Set realistic, achievable goals\n• Track your progress but don't obsess\n• Get adequate sleep and manage stress\n• Consult a healthcare provider for personalized advice\n\nRemember: Health is more than just a number on the scale!";
    }
    
    if (lowerQuery.includes('immunity') || lowerQuery.includes('immune') || lowerQuery.includes('cold')) {
      return "🛡️ **Boosting Immunity:**\n\n• Eat a diet rich in fruits and vegetables\n• Get adequate vitamin D and C\n• Exercise regularly but moderately\n• Get 7-9 hours of quality sleep\n• Manage stress through relaxation techniques\n• Practice good hygiene habits\n• Consider probiotics for gut health\n\nA strong immune system starts with healthy lifestyle choices!";
    }
    
    // Default response
    return "💚 **General Health Tips:**\n\n• Stay hydrated throughout the day\n• Eat a balanced diet with plenty of vegetables\n• Exercise regularly for at least 30 minutes\n• Get 7-9 hours of quality sleep\n• Manage stress through relaxation techniques\n• Maintain regular health check-ups\n• Practice good hygiene habits\n\nIs there a specific health topic you'd like to know more about? I can help with nutrition, exercise, sleep, stress management, and more!";
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.type === 'user' ? styles.userText : styles.botText
        ]}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderLoadingIndicator = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2e7d32" />
        <Text style={styles.loadingText}>AI is thinking...</Text>
      </View>
    );
  };

  const renderTipCard = ({ item }: { item: HealthTip }) => (
    <View style={styles.card}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  const suggestedQuestions = [
    "How can I improve my diet and nutrition?",
    "What exercises are best for beginners?",
    "How can I get better sleep?",
    "How do I manage stress and anxiety?",
    "What are tips for healthy weight management?",
    "How can I boost my immune system?",
    "What are good habits for mental health?",
    "How much water should I drink daily?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (viewMode === 'tips') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌿 Health Tips</Text>
          <Text style={styles.headerSubtitle}>
            Natural wellness advice for better health
          </Text>
          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setViewMode('chat')}
          >
            <Text style={styles.switchButtonText}>💬 Chat with AI</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tips}
          keyExtractor={(item) => item.id}
          renderItem={renderTipCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchHealthTips}
        />

        <TouchableOpacity style={styles.refreshButton} onPress={fetchHealthTips}>
          <Text style={styles.refreshButtonText}>Refresh Tips</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💚 Health & Wellness AI</Text>
        <Text style={styles.headerSubtitle}>Get personalized health advice and tips</Text>
        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setViewMode('tips')}
        >
          <Text style={styles.switchButtonText}>📋 View Tips</Text>
        </TouchableOpacity>
      </View>



      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContentContainer}
        showsVerticalScrollIndicator={true}
        ListFooterComponent={renderLoadingIndicator}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 Try asking about:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestedQuestion(question)}
              >
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about health, nutrition, exercise, or wellness..."
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          onKeyPress={handleKeyPress}
          blurOnSubmit={false}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e8f5e9',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  switchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messagesContentContainer: {
    paddingBottom: 100, // Add padding at the bottom to prevent content from being hidden behind the input
  },
  messageContainer: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#4caf50",
  },
  botBubble: {
    backgroundColor: "#e0f2f7",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
  suggestionsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  suggestionChip: {
    backgroundColor: "#e0f2f7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#28a745",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Styles for tips view
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: '#2e7d32',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
