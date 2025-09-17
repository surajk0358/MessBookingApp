// app/index.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PhoneInput from '../components/PhoneInput';
import { API } from '../utils/api';
import { saveUserData } from '../utils/storage';

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (number: string): boolean => {
    if (!number || number.trim() === '') return false;
    if (number.length !== 10) return false;
    if (!/^\d+$/.test(number)) return false;
    if (number.startsWith('0')) return false;
    return true;
  };

  const handleNext = async () => {
    const trimmedNumber = phoneNumber.trim();

    if (!validatePhoneNumber(trimmedNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number (without 0 at start).');
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+91${trimmedNumber}`;
      
      // Check if user exists in backend
      try {
        const existingUser = await API.getUser(formattedPhone);
        if (existingUser) {
          await saveUserData(existingUser);
          // User exists, go directly to role selection or their dashboard
          router.push({ pathname: '/otp', params: { phone: formattedPhone, userExists: 'true' } });
          return;
        }
      } catch (error) {
        // User doesn't exist, proceed with OTP verification for new user
      }

      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        router.push({ pathname: '/otp', params: { phone: formattedPhone, userExists: 'false' } });
      }, 1000);
    } catch (error: any) {
      console.error('Phone verification error:', error);
      Alert.alert('Error', 'Failed to process phone number. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🍽</Text>
          <Text style={styles.title}>MessApp</Text>
          <Text style={styles.subtitle}>Connect with local mess services</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputTitle}>Enter Mobile Number</Text>
          <Text style={styles.inputSubtitle}>We'll send you a verification code</Text>

          <PhoneInput 
            value={phoneNumber} 
            onChangeText={setPhoneNumber} 
            placeholder="9876543210" 
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleNext} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5' },
  content: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 60 },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  inputSection: { backgroundColor: 'white', borderRadius: 20, padding: 30, marginBottom: 40 },
  inputTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  inputSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#4F46E5', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});