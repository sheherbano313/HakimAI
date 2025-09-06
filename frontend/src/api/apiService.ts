import axios from 'axios';
import { storage } from '../utils/storage';
import { CONFIG, getApiUrl } from '../config/config';

// Type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface MedicinalPlant {
  id: string;
  'Scientific Name': string;
  'Local Name': string;
  Uses?: string;
  Symptoms?: string;
  createdAt?: string;
}

export interface PlantsResponse {
  success: boolean;
  count: number;
  data: MedicinalPlant[];
}

export interface RemedySearchResponse {
  success: boolean;
  source: 'local' | 'ai';
  query: string;
  count?: number;
  data?: MedicinalPlant[];
  message?: string;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface HealthTipsResponse {
  success: boolean;
  tips: HealthTip[];
}

export interface Hakim {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  location: string;
  phone: string;
  rating: number;
}

export interface HakimsResponse {
  success: boolean;
  hakims: Hakim[];
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    email: string;
    message: string;
    rating?: number;
    timestamp: string;
  };
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

export interface ContactResponse {
  success: boolean;
  contact: ContactInfo;
}

// API Configuration
const API_BASE_URL = getApiUrl();
const STORAGE_KEYS = CONFIG.STORAGE;
console.log("thehehhhhhhhh",API_BASE_URL, API_BASE_URL);
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: CONFIG.API.TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (method: string, url: string, data?: any) => {
  const authHeaders = await getAuthHeaders();
  const config = {
    method,
    url,
    data,
    headers: {
      ...apiClient.defaults.headers,
      ...authHeaders,
    },
  };
  return apiClient.request(config);
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await storage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // User Registration
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // User Login
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    console.log('API Service: Login called with credentials:', credentials);
    console.log('API Service: Making request to:', `${API_BASE_URL}/auth/login`);
    console.log('API Service: Full URL:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('API Service: Login response received:', response.data);
      if (response.data.token) {
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('API Service: Login error:', error);
      console.error('API Service: Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // User Logout
  logout: async (): Promise<void> => {
    await storage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  },

  // Get User Profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await makeAuthenticatedRequest('GET', '/auth/profile');
    return response.data;
  },

  // Update User Profile
  updateProfile: async (updates: { name?: string; phone?: string }): Promise<AuthResponse> => {
    const response = await makeAuthenticatedRequest('PUT', '/auth/profile', updates);
    if (response.data.user) {
      await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Change Password
  changePassword: async (passwords: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await makeAuthenticatedRequest('PUT', '/auth/change-password', passwords);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  // Get stored user data
  getStoredUser: async (): Promise<User | null> => {
    const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
};

// Medicinal Plants API
export const plantsAPI = {
  // Get all plants
  getAll: async (): Promise<PlantsResponse> => {
    const response = await apiClient.get<PlantsResponse>('/medicinal-plants');
    return response.data;
  },

  // Search plants
  search: async (params: { symptom?: string; name?: string; scientificName?: string }): Promise<PlantsResponse> => {
    const response = await apiClient.get<PlantsResponse>('/medicinal-plants/search', { params });
    return response.data;
  },

  // Get plant by ID
  getById: async (id: string): Promise<ApiResponse<MedicinalPlant>> => {
    const response = await apiClient.get<ApiResponse<MedicinalPlant>>(`/medicinal-plants/${id}`);
    return response.data;
  },

  // Add new plant (requires authentication)
  add: async (plantData: {
    'Scientific Name': string;
    'Local Name': string;
    Uses?: string;
    Symptoms?: string;
  }): Promise<ApiResponse<MedicinalPlant>> => {
    const response = await makeAuthenticatedRequest('POST', '/medicinal-plants', plantData);
    return response.data;
  },

  // Update plant (requires authentication)
  update: async (id: string, updates: Partial<MedicinalPlant>): Promise<ApiResponse<MedicinalPlant>> => {
    const response = await makeAuthenticatedRequest('PUT', `/medicinal-plants/${id}`, updates);
    return response.data;
  },

  // Delete plant (requires authentication)
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await makeAuthenticatedRequest('DELETE', `/medicinal-plants/${id}`);
    return response.data;
  }
};

// Remedies API
export const remediesAPI = {
  // Search remedies (Local + AI)
  search: async (query: string, useAI: boolean = false): Promise<RemedySearchResponse> => {
    const response = await apiClient.post<RemedySearchResponse>('/remedies/search', { query, useAI });
    return response.data;
  },

  // Chatbot - Ask questions about remedies
  askChatbot: async (message: string): Promise<ApiResponse<{
    question: string;
    answer: string;
    timestamp: string;
  }>> => {
    const response = await apiClient.post<ApiResponse<{
      question: string;
      answer: string;
      timestamp: string;
    }>>('/remedies/chatbot', { message });
    return response.data;
  },

  // Get popular remedies
  getPopular: async (): Promise<PlantsResponse> => {
    const response = await apiClient.get<PlantsResponse>('/remedies/popular');
    return response.data;
  },

  // Get remedies by symptom
  getBySymptom: async (symptom: string): Promise<PlantsResponse> => {
    const response = await apiClient.get<PlantsResponse>(`/remedies/symptoms/${symptom}`);
    return response.data;
  },

  // Save remedy to favorites (requires authentication)
  saveToFavorites: async (remedyId: string, notes?: string): Promise<ApiResponse> => {
    const response = await makeAuthenticatedRequest('POST', '/remedies/save', { remedyId, notes });
    return response.data;
  }
};

// Health Tips API
export const healthTipsAPI = {
  getTips: async (): Promise<HealthTipsResponse> => {
    const response = await apiClient.get<HealthTipsResponse>('/health-tips');
    return response.data;
  }
};

// Hakims API
export const hakimsAPI = {
  getHakims: async (): Promise<HakimsResponse> => {
    const response = await apiClient.get<HakimsResponse>('/hakims');
    return response.data;
  }
};

// Feedback API
export const feedbackAPI = {
  submit: async (feedbackData: {
    name: string;
    email: string;
    message: string;
    rating?: number;
  }): Promise<FeedbackResponse> => {
    const response = await apiClient.post<FeedbackResponse>('/feedback', feedbackData);
    return response.data;
  }
};

// Contact API
export const contactAPI = {
  getInfo: async (): Promise<ContactResponse> => {
    const response = await apiClient.get<ContactResponse>('/contact');
    return response.data;
  }
};

export default apiClient;
