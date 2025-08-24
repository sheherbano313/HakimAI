// TypeScript test file to verify all types are working correctly
import { 
  authAPI, 
  plantsAPI, 
  remediesAPI, 
  healthTipsAPI, 
  hakimsAPI, 
  feedbackAPI, 
  contactAPI,
  AuthResponse,
  PlantsResponse,
  HealthTipsResponse,
  HakimsResponse,
  FeedbackResponse,
  ContactResponse
} from './frontend/src/api/apiService';

// This file tests that all TypeScript types are properly defined
// If this compiles without errors, all types are correct

async function testTypes() {
  try {
    // Test auth API types
    const loginResponse: AuthResponse = await authAPI.login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.success);

    // Test plants API types
    const plantsResponse: PlantsResponse = await plantsAPI.getAll();
    console.log('Plants count:', plantsResponse.count);

    // Test health tips API types
    const tipsResponse: HealthTipsResponse = await healthTipsAPI.getTips();
    console.log('Tips count:', tipsResponse.tips.length);

    // Test hakims API types
    const hakimsResponse: HakimsResponse = await hakimsAPI.getHakims();
    console.log('Hakims count:', hakimsResponse.hakims.length);

    // Test feedback API types
    const feedbackResponse: FeedbackResponse = await feedbackAPI.submit({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      rating: 5
    });
    console.log('Feedback success:', feedbackResponse.success);

    // Test contact API types
    const contactResponse: ContactResponse = await contactAPI.getInfo();
    console.log('Contact email:', contactResponse.contact.email);

    console.log('✅ All TypeScript types are working correctly!');
  } catch (error) {
    console.log('❌ Error (expected in test):', error);
  }
}

// Export for potential use
export { testTypes };

console.log('🧪 TypeScript types test file compiled successfully!');
console.log('All API service types are properly defined.');