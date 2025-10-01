
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { API } from '../../utils/api';
import { saveUserData, saveToken, saveRole } from '../../utils/storage';

interface FormData {
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  address: string;
  messName: string;
  ownerName: string;
  messAddress: string;
}

export default function RegisterScreen() {
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'owner' | ''>('');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    address: '',
    messName: '',
    ownerName: '',
    messAddress: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { username, email, mobile, password, confirmPassword } = formData;

    // Role validation
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role (Mess User or Mess Owner)');
      return false;
    }

    // Required fields
    if (!username.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }

    // Username validation (matches validateUsername in validation.js)
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      Alert.alert('Error', 'Username must be 3-30 characters long and contain only letters, numbers, or underscores');
      return false;
    }

    // Email validation (matches validateEmail in validation.js)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Mobile validation (matches validateMobile in validation.js)
    if (!/^(\+91|91)?[6-9]\d{9}$/.test(mobile.replace(/[\s-()]/g, ''))) {
      Alert.alert('Error', 'Please enter a valid mobile number (e.g., +919876543210)');
      return false;
    }

    // Password validation (matches validatePassword in validation.js)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    // Role-specific validation
    if (selectedRole === 'consumer') {
      if (!formData.fullName.trim() || !formData.address.trim()) {
        Alert.alert('Error', 'Full Name and Address are required for Mess User');
        return false;
      }
      if (formData.address.length > 500) {
        Alert.alert('Error', 'Address must not exceed 500 characters');
        return false;
      }
    }

    if (selectedRole === 'owner') {
      if (!formData.messName.trim() || !formData.ownerName.trim() || !formData.messAddress.trim()) {
        Alert.alert('Error', 'Mess Name, Owner Name, and Mess Address are required for Mess Owner');
        return false;
      }
      if (formData.messName.length > 100 || formData.ownerName.length > 100 || formData.messAddress.length > 500) {
        Alert.alert('Error', 'Mess Name and Owner Name must not exceed 100 characters, Mess Address must not exceed 500 characters');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === 'consumer' && {
          fullName: formData.fullName.trim(),
          address: formData.address.trim(),
        }),
        ...(selectedRole === 'owner' && {
          messName: formData.messName.trim(),
          ownerName: formData.ownerName.trim(),
          messAddress: formData.messAddress.trim(),
        }),
      };

      const response = await API.register(registrationData);

      if (response.success) {
        // Save user data, token, and role
        await saveUserData(response.data.user);
        await saveToken(response.data.token);
        await saveRole(response.data.role);

        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to appropriate dashboard based on role
              const redirectPath = selectedRole === 'consumer' ? '../consumer' : '../owner';
              router.replace(redirectPath);
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('Registration error:', error.message);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (selectedRole === 'consumer') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={value => handleInputChange('fullName', value)}
              autoCapitalize="words"
              maxLength={100}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your complete address"
              value={formData.address}
              onChangeText={value => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </>
      );
    }

    if (selectedRole === 'owner') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mess Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your mess name"
              value={formData.messName}
              onChangeText={value => handleInputChange('messName', value)}
              autoCapitalize="words"
              maxLength={100}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter owner's full name"
              value={formData.ownerName}
              onChangeText={value => handleInputChange('ownerName', value)}
              autoCapitalize="words"
              maxLength={100}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mess Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter mess complete address"
              value={formData.messAddress}
              onChangeText={value => handleInputChange('messAddress', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>🍽️</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our mess community today!</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text style={styles.label}>I am a *</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      selectedRole === 'consumer' && styles.selectedRoleButton,
                    ]}
                    onPress={() => setSelectedRole('consumer')}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        selectedRole === 'consumer' && styles.selectedRoleButtonText,
                      ]}
                    >
                      🍽️ Mess User
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      selectedRole === 'owner' && styles.selectedRoleButton,
                    ]}
                    onPress={() => setSelectedRole('owner')}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        selectedRole === 'owner' && styles.selectedRoleButtonText,
                      ]}
                    >
                      👨‍🍳 Mess Owner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Common Fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a username (3-30 characters)"
                  value={formData.username}
                  onChangeText={value => handleInputChange('username', value)}
                  autoCapitalize="none"
                  maxLength={30}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number (e.g., +919876543210)"
                  value={formData.mobile}
                  onChangeText={value => handleInputChange('mobile', value)}
                  keyboardType="phone-pad"
                  maxLength={13}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password (min 6 characters)"
                  value={formData.password}
                  onChangeText={value => handleInputChange('password', value)}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChangeText={value => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                />
              </View>

              {/* Role-specific Fields */}
              {renderRoleSpecificFields()}

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Registering...' : 'Register'}
                </Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                  disabled={loading}
                >
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5' },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  emoji: { fontSize: 50, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  formContainer: { flex: 1, paddingHorizontal: 20 },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  roleSection: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  roleButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedRoleButton: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  selectedRoleButtonText: { color: 'white' },
  inputGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#333',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  registerButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: { backgroundColor: '#9CA3AF' },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: { fontSize: 14, color: '#64748B' },
  loginLink: { fontSize: 14, color: '#4F46E5', fontWeight: '600' },
});
