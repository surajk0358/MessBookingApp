import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user data to AsyncStorage
export const saveUserData = async (user) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data');
  }
};

// Save auth token to AsyncStorage
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('Failed to save token');
  }
};

// Save user role to AsyncStorage
export const saveRole = async (role) => {
  try {
    await AsyncStorage.setItem('role', role);
  } catch (error) {
    console.error('Error saving role:', error);
    throw new Error('Failed to save role');
  }
};

// Get user data from AsyncStorage
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

// Get auth token from AsyncStorage
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Get user role from AsyncStorage
export const getRole = async () => {
  try {
    return await AsyncStorage.getItem('role');
  } catch (error) {
    console.error('Error retrieving role:', error);
    return null;
  }
};

// Clear all stored data
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage');
  }
};