import axios from 'axios';
import { Platform } from 'react-native';

// For Expo, use process.env only if you have configured it via babel-plugin-dotenv or expo-constants
import Constants from 'expo-constants';

// const API_BASE = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8000';
const API_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://192.168.18.36:5000';

export const fetchRemedies = async () => {
  const res = await axios.get(`${API_BASE}/api/remedies`);
  return res.data;
};

export const fetchHealthTips = async () => {
  const res = await axios.get(`${API_BASE}/api/health-tips`);
  return res.data;
};
