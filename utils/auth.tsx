import auth from '@react-native-firebase/auth';

let confirmResult: any = null;

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    console.log('Sending OTP to:', phoneNumber);
    confirmResult = await auth().signInWithPhoneNumber(phoneNumber);
    console.log('OTP sent successfully');
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async (otp: string): Promise<void> => {
  try {
    if (!confirmResult) {
      throw new Error('No OTP request found. Please request OTP again.');
    }
    
    console.log('Verifying OTP:', otp);
    const user = await confirmResult.confirm(otp);
    console.log('OTP verified successfully for user:', user.user.phoneNumber);
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(error.message || 'Invalid OTP');
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await auth().signOut();
    confirmResult = null;
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};