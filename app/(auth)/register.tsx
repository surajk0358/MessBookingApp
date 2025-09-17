import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { API } from '../../utils/api';

export default function RegisterScreen() {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    // Additional fields that will be shown/hidden based on role
    fullName: '',
    address: '',
    messName: '',
    ownerName: '',
    messAddress: '',
    licenseNumber: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { username, email, mobile, password } = formData;
    
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role (Mess User or Mess Owner)');
      return false;
    }

    if (!username || !email || !mobile || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }

    if (selectedRole === 'consumer') {
      const { fullName, address } = formData;
      if (!fullName || !address) {
        Alert.alert('Error', 'Please fill Full Name and Address for Mess User');
        return false;
      }
    }

    if (selectedRole === 'owner') {
      const { messName, ownerName, messAddress } = formData;
      if (!messName || !ownerName || !messAddress) {
        Alert.alert('Error', 'Please fill Mess Name, Owner Name, and Mess Address');
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
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: selectedRole === 'consumer' ? 'Mess User' : 'Mess Owner',
        ...(selectedRole === 'consumer' && {
          fullName: formData.fullName,
          address: formData.address,
        }),
        ...(selectedRole === 'owner' && {
          messName: formData.messName,
          ownerName: formData.ownerName,
          messAddress: formData.messAddress,
          licenseNumber: formData.licenseNumber,
          gstNumber: formData.gstNumber,
        }),
      };

      await API.post('/auth/register', registrationData);
      
      // Redirect to login page immediately after successful registration
      router.push('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Create Your Account</Text>
            <Text style={styles.sectionSubtitle}>
              Join our community! Fill in the details below to get started.
            </Text>

            {/* Common Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Choose a unique username" 
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                placeholder="your.email@example.com" 
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="+1 (555) 123-4567" 
                value={formData.mobile}
                onChangeText={(value) => handleInputChange('mobile', value)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your secure password" 
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
              />
            </View>

            {/* Mess User Specific Fields */}
            {selectedRole === 'consumer' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter your full name" 
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Enter your complete address" 
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}

            {/* Mess Owner Specific Fields */}
            {selectedRole === 'owner' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mess Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter your mess name" 
                    value={formData.messName}
                    onChangeText={(value) => handleInputChange('messName', value)}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Owner Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter owner's full name" 
                    value={formData.ownerName}
                    onChangeText={(value) => handleInputChange('ownerName', value)}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mess Address</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Enter mess complete address" 
                    value={formData.messAddress}
                    onChangeText={(value) => handleInputChange('messAddress', value)}
                    multiline
                    numberOfLines={3}
                  />
                </View>
                
                {/* <View style={styles.inputGroup}>
                  <Text style={styles.label}>License Number (Optional)</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter business license number" 
                    value={formData.licenseNumber}
                    onChangeText={(value) => handleInputChange('licenseNumber', value)}
                  />
                </View> */}
                
                {/* <View style={styles.inputGroup}>
                  <Text style={styles.label}>GST Number (Optional)</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter GST registration number" 
                    value={formData.gstNumber}
                    onChangeText={(value) => handleInputChange('gstNumber', value)}
                  />
                </View> */}
              </>
            )}

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Role</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton, 
                    selectedRole === 'consumer' && styles.selectedRoleButton
                  ]}
                  onPress={() => setSelectedRole('consumer')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'consumer' && styles.selectedRoleButtonText
                  ]}>
                    Mess User
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleButton, 
                    selectedRole === 'owner' && styles.selectedRoleButton
                  ]}
                  onPress={() => setSelectedRole('owner')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'owner' && styles.selectedRoleButtonText
                  ]}>
                    Mess Owner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]} 
              onPress={handleRegister}
              //onPress={() => router.push('./login')}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  roleSection: {
    marginBottom: 25,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedRoleButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedRoleButtonText: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});