import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import OTPInput from '../components/OTPInput'; // Ensure this component exists
import {
  saveUserData,
  saveToken,
  saveRole,
  saveLastLoginTime,
} from '../utils/storage'; // Ensure these utility functions exist
import { API } from '../utils/api'; // Ensure this API utility exists

export default function OTPScreen() {
  const { phone, userExists, userId } = useLocalSearchParams<{
    phone: string;
    userExists: string;
    userId?: string;
  }>();

  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
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

      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (userExists === 'true' && userId) {
        // Existing user - get user data and login
        try {
          const userProfile = await API.getUserProfile(userId);
          if (userProfile.success) {
            const loginResponse = await API.post('/auth/otp-login', {
              userId: userId,
              mobile: phone,
              otp: otpString,
            });

            // Save auth data
            await saveUserData(loginResponse.user);
            await saveToken(loginResponse.token);
            await saveRole(
              loginResponse.role === 'Mess User' ? 'consumer' : 'owner'
            );
            await saveLastLoginTime();

            // Navigate to role-specific dashboard
            const role =
              loginResponse.role === 'Mess User' ? 'consumer' : 'owner';
            Alert.alert('Welcome Back!', 'OTP verified successfully.', [
              {
                text: 'OK',
                onPress: () => {
                  router.replace(`/${role}`);
                },
              },
            ]);
            return;
          }
        } catch (error) {
          console.error('Login error:', error);
          Alert.alert('Login Error', 'Failed to log in. Please try again.');
          setOTP(['', '', '', '', '', '']);
          setLoading(false);
          return;
        }
      }

      // New user - redirect to registration
      Alert.alert('OTP Verified!', 'Please complete your registration.', [
        {
          text: 'Continue',
          onPress: () => {
            router.replace({
              pathname: '/(auth)/register',
              params: { verifiedPhone: phone },
            });
          },
        },
      ]);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert(
        'Verification Failed',
        'Invalid OTP or verification failed. Please try again.',
        [{ text: 'OK' }]
      );
      setOTP(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setTimer(60);
      setCanResend(false);
      setOTP(['', '', '', '', '', '']);

      // Simulate OTP resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        'OTP Sent',
        'A new OTP has been sent to your mobile number.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert(
        'Resend Failed',
        'Failed to resend OTP. Please try again.',
        [{ text: 'OK' }]
      );
      setCanResend(true);
      setTimer(0);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOTPComplete = otp.join('').length === 6;
  const isExistingUser = userExists === 'true';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            disabled={loading}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phoneNumber}>{phone}</Text>

          {isExistingUser && (
            <View style={styles.userStatusBadge}>
              <Text style={styles.userStatusText}>Welcome back! 👋</Text>
            </View>
          )}
        </View>

        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <OTPInput
            otp={otp}
            setOTP={setOTP}
            onComplete={handleVerifyOTP}
            editable={!loading}
          />

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isOTPComplete || loading) && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={!isOTPComplete || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={[styles.verifyButtonText, { marginLeft: 10 }]}>
                  Verifying...
                </Text>
              </View>
            ) : (
              <Text style={styles.verifyButtonText}>
                {isExistingUser ? 'Login' : 'Verify & Continue'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.timerSection}>
            <Text style={styles.didntReceiveText}>Didn't receive the code?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in {formatTimer(timer)}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                style={styles.resendButton}
                disabled={loading}
              >
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            For testing purposes, you can enter any 6-digit code
          </Text>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              if (isExistingUser) {
                router.replace('/role-selection');
              } else {
                router.replace('/(auth)/register');
              }
            }}
            disabled={loading}
          >
            <Text style={styles.skipText}>Skip OTP (Development Only)</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  userStatusBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userStatusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});