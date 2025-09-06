// Configuration file for HakimAI Frontend

export const CONFIG = {
  // API Configuration
  API: {
    // For mobile development, use your computer's IP address
    // Replace 192.168.18.36 with your actual computer's IP address
    // BASE_URL: __DEV__ ? 'http://192.168.18.36:5000/api' : 'http://localhost:5000/api',
    // BASE_URL: __DEV__ ? 'http://192.168.10.33:5000/api' : 'http://localhost:5000/api',
    BASE_URL: __DEV__ ? 'http://192.168.18.22:5000/api' : 'http://localhost:5000/api',
    
    // Alternative: Use localhost for web development
    // BASE_URL: 'http://localhost:5000/api',
    
    TIMEOUT: 15000, // Increased timeout for mobile
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
    // For now, always use IP address in development to ensure mobile connectivity
    // This can be changed back to localhost for web development if needed
    console.log('Using IP address for development:', 'http://192.168.18.22:5000/api');
    return 'http://192.168.18.22:5000/api';
  }
  
  return CONFIG.API.BASE_URL;
};

export default CONFIG;
