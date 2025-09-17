// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (user) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const saveRole = async (role) => {
  try {
    await AsyncStorage.setItem('role', role);
  } catch (error) {
    console.error('Error saving role:', error);
  }
};

export const getRole = async () => {
  try {
    return await AsyncStorage.getItem('role');
  } catch (error) {
    console.error('Error getting role:', error);
    return null;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(['userData', 'authToken', 'role']);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};