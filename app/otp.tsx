// app/otp.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import OTPInput from '../components/OTPInput';
import { saveUserData, getUserData } from '../utils/storage';

export default function OTPScreen() {
  const { phone, userExists } = useLocalSearchParams<{ phone: string; userExists: string }>();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate OTP verification with delay
      setTimeout(async () => {
        setLoading(false);
        router.replace('/register'); // Redirect to register page
      }, 1500);
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Verification Failed', 'Something went wrong. Please try again.');
      setOTP(['', '', '', '', '', '']);
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    setOTP(['', '', '', '', '', '']); // Clear OTP fields
    Alert.alert('OTP Sent', 'A new OTP has been sent to your mobile number.');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOTPComplete = otp.join('').length === 6;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phoneNumber}>{phone}</Text>
        </View>

        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <OTPInput 
            otp={otp} 
            setOTP={setOTP}
            onComplete={handleVerifyOTP}
          />

          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              (!isOTPComplete || loading) && styles.verifyButtonDisabled
            ]} 
            onPress={handleVerifyOTP} 
            disabled={!isOTPComplete || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.timerSection}>
            <Text style={styles.didntReceiveText}>Didn't receive the code?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in {formatTimer(timer)}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP} style={styles.resendButton}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            For testing purposes, you can enter any 6-digit code
          </Text>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    padding: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  otpSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginHorizontal: 4,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timerSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  didntReceiveText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  helpSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  helpText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});