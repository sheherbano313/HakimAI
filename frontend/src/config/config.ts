// Configuration file for HakimAI Frontend

export const CONFIG = {
  // API Configuration
  API: {
    // Change this to your backend URL
    BASE_URL: 'http://localhost:5000/api',
    
    // For development on physical device, use your computer's IP address
    // BASE_URL: 'http://192.168.1.100:5000/api',
    
    // For Expo Go on physical device, you might need to use your computer's IP
    // BASE_URL: 'http://YOUR_COMPUTER_IP:5000/api',
    
    TIMEOUT: 10000,
  },
  
  // App Configuration
  APP: {
    NAME: 'HakimAI',
    VERSION: '1.0.0',
    DESCRIPTION: 'Herbal Medicine AI Assistant',
  },
  
  // Storage Keys
  STORAGE: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    SETTINGS: 'app_settings',
  },
  
  // UI Configuration
  UI: {
    COLORS: {
      PRIMARY: '#2e7d32',
      SECONDARY: '#388e3c',
      ACCENT: '#4caf50',
      BACKGROUND: '#f0f8f5',
      TEXT: '#2c3e50',
      TEXT_LIGHT: '#666',
      ERROR: '#e74c3c',
      SUCCESS: '#27ae60',
      WARNING: '#f39c12',
    },
    SPACING: {
      SMALL: 8,
      MEDIUM: 16,
      LARGE: 24,
      XLARGE: 32,
    },
    BORDER_RADIUS: {
      SMALL: 8,
      MEDIUM: 12,
      LARGE: 16,
    },
  },
};

// Helper function to get the correct API URL based on environment
export const getApiUrl = () => {
  // In development, you might want to use different URLs for different platforms
  if (__DEV__) {
    // For web development
    if (typeof window !== 'undefined') {
      return CONFIG.API.BASE_URL;
    }
    
    // For mobile development, you might want to use your computer's IP
    // return 'http://192.168.1.100:5000/api';
  }
  
  return CONFIG.API.BASE_URL;
};

export default CONFIG;
