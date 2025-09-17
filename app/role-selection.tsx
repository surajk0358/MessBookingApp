// app/role-selection.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import RoleCard from '../components/RoleCard';
import { saveRole, saveUserData, getUserData } from '../utils/storage';
import { API } from '../utils/api';

export default function RoleSelection() {
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: 'consumer' | 'owner') => {
    try {
      setLoading(true);
      
      // Get user data from storage (phone number from previous screen)
      const existingUserData = await getUserData();
      let userData;

      if (existingUserData?.mobileNumber) {
        // Update existing user's role
        userData = await API.updateUser(existingUserData._id, { role });
      } else {
        // This shouldn't happen in normal flow, but handle edge case
        Alert.alert('Error', 'User data not found. Please restart the registration process.');
        router.replace('/');
        return;
      }

      // Save updated user data and role
      await saveUserData(userData);
      await saveRole(role);
      
      // Navigate to appropriate dashboard
      router.replace(`/${role}`);
    } catch (error: any) {
      console.error('Role selection error:', error);
      Alert.alert('Error', 'Failed to set user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20, fontSize: 16 }}>
            Setting up your profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

return (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How would you like to use MessApp?</Text>
      </View>

      <View style={styles.roleContainer}>
        <RoleCard
          icon="👤"
          title="Consumer"
          subtitle="Find and book mess services"
          description="Browse local mess options, view menus, and book meals"
          onPress={() => router.replace('/consumer')}
        />

        <RoleCard
          icon="🏪"
          title="Mess Owner"
          subtitle="Manage your mess business"
          description="Create listings, manage orders, and grow your business"
          onPress={() => router.replace('/owner')}
        />
      </View>
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  roleContainer: {
    gap: 20,
  },
});