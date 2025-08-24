// Storage utility that works on both web and mobile
// On web: uses localStorage
// On mobile: uses AsyncStorage

import { webStorage } from './webStorage';

let AsyncStorage: any = null;

// Try to import AsyncStorage, but don't fail if it's not available
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.log('AsyncStorage not available, using localStorage fallback');
}

// Check if we're running on web
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

class Storage {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return window.localStorage.getItem(key);
      } else if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      } else {
        // Fallback for web without AsyncStorage
        return webStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error getting item from storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        return webStorage.getItem(key);
      }
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage.setItem(key, value);
      } else if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
      } else {
        // Fallback for web without AsyncStorage
        webStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        webStorage.setItem(key, value);
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage.removeItem(key);
      } else if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
      } else {
        // Fallback for web without AsyncStorage
        webStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        webStorage.removeItem(key);
      }
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      if (isWeb) {
        keys.forEach(key => window.localStorage.removeItem(key));
      } else if (AsyncStorage) {
        await AsyncStorage.multiRemove(keys);
      } else {
        // Fallback for web without AsyncStorage
        webStorage.multiRemove(keys);
      }
    } catch (error) {
      console.error('Error removing multiple items from storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        webStorage.multiRemove(keys);
      }
    }
  }

  async clear(): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage.clear();
      } else if (AsyncStorage) {
        await AsyncStorage.clear();
      } else {
        // Fallback for web without AsyncStorage
        webStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        webStorage.clear();
      }
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      if (isWeb) {
        return Object.keys(window.localStorage);
      } else if (AsyncStorage) {
        return await AsyncStorage.getAllKeys();
      } else {
        // Fallback for web without AsyncStorage
        return webStorage.getAllKeys();
      }
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      // Fallback to webStorage if AsyncStorage fails
      if (isWeb) {
        return webStorage.getAllKeys();
      }
      return [];
    }
  }
}

export const storage = new Storage();
export default storage;
