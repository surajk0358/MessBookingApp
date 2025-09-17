// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { API } from '../../utils/api';
import { saveUserData, saveToken, saveRole } from '../../utils/storage';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', {
        identifier,
        password
      });
      await saveUserData(response.user);
      await saveToken(response.token);
      await saveRole(response.role === 'Mess User' ? 'consumer' : 'owner');
      Alert.alert('Success', 'Login successful!');
      router.replace(`/${response.role === 'Mess User' ? 'consumer' : 'owner'}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Identifier (Username/Email/Mobile)</Text>
            <TextInput style={styles.input} placeholder="Enter identifier" value={identifier} onChangeText={setIdentifier} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <TouchableOpacity  style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin} 
          // onPress={() => router.push('/role-selection')}
          disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  emoji: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  formContainer: { flex: 1, padding: 20 },
  section: { backgroundColor: 'white', borderRadius: 20, padding: 25, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#F8FAFC' },
  loginButton: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#9CA3AF' },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  backButton: { alignSelf: 'center', padding: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});