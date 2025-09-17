// components/OTPInput.tsx - Fixed onComplete prop
import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface OTPInputProps { 
  otp: string[]; 
  setOTP: (otp: string[]) => void; 
  onComplete?: () => void; 
}

export default function OTPInput({ otp, setOTP, onComplete }: OTPInputProps) {
  const inputs = useRef<TextInput[]>([]);

  const handleChangeText = (text: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = text.replace(/\D/g, '');
    setOTP(newOTP);
    
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    
    if (newOTP.join('').length === 6 && onComplete) {
      setTimeout(onComplete, 100);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput 
          key={index} 
          ref={(ref) => (inputs.current[index] = ref!)} 
          style={[styles.input, digit ? styles.inputFilled : {}]} 
          value={digit} 
          onChangeText={(t) => handleChangeText(t, index)} 
          onKeyPress={(e) => handleKeyPress(e, index)} 
          keyboardType="numeric" 
          maxLength={1} 
          textAlign="center" 
          selectTextOnFocus 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    maxWidth: 300 
  },
  input: { 
    width: 45, 
    height: 55, 
    borderWidth: 2, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    fontSize: 20, 
    fontWeight: 'bold', 
    backgroundColor: '#F9FAFB', 
    color: '#111827' 
  },
  inputFilled: { 
    borderColor: '#4F46E5', 
    backgroundColor: '#EEF2FF' 
  },
});
