import AsyncStorage from '@react-native-async-storage/async-storage';

const ROLE_KEY = 'user_role';

export const saveRole = async (role: 'consumer' | 'owner'): Promise<void> => {
  try {
    await AsyncStorage.setItem(ROLE_KEY, role);
    console.log('Role saved:', role);
  } catch (error) {
    console.error('Error saving role:', error);
  }
};

export const getStoredRole = async (): Promise<string | null> => {
  try {
    const role = await AsyncStorage.getItem(ROLE_KEY);
    console.log('Retrieved role:', role);
    return role;
  } catch (error) {
    console.error('Error getting stored role:', error);
    return null;
  }
};

export const clearRole = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ROLE_KEY);
    console.log('Role cleared');
  } catch (error) {
    console.error('Error clearing role:', error);
  }
};