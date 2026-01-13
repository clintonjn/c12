import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface EnterVerificationCodeProps {
  phoneNumber: string;
  countryCode: string;
  onVerifyOTP: (otp: string) => void;
  onResendOTP: () => void;
  onChangePhoneNumber: () => void;
}

const EnterVerificationCode: React.FC<EnterVerificationCodeProps> = ({
  phoneNumber,
  countryCode,
  onVerifyOTP,
  onResendOTP,
  onChangePhoneNumber,
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      onVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string) => {
    const currentIndex = otp.findIndex(digit => digit === '');
    const targetIndex = currentIndex === -1 ? 3 : currentIndex;

    if (key === 'backspace') {
      const newOtp = [...otp];
      if (otp[targetIndex] !== '') {
        newOtp[targetIndex] = '';
      } else if (targetIndex > 0) {
        newOtp[targetIndex - 1] = '';
      }
      setOtp(newOtp);
    } else if (key >= '0' && key <= '9' && targetIndex < 4) {
      handleOtpChange(key, targetIndex);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      setOtp(['', '', '', '']); // Clear OTP input fields
      onResendOTP();
    }
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'backspace'],
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>We have sent an OTP to your number</Text>
        <Text style={styles.phoneNumber}>
          {countryCode} {phoneNumber}
        </Text>

        {/* Change Phone Number Link */}
        <View style={styles.changePhoneContainer}>
          <Text style={styles.changePhoneText}>
            Not your phone number?{' '}
            <Text style={styles.changePhoneLink} onPress={onChangePhoneNumber}>
              Change it
            </Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : styles.otpInputEmpty,
              ]}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              showSoftInputOnFocus={false}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text
              style={[
                styles.resendLink,
                resendTimer > 0 ? styles.resendDisabled : styles.resendEnabled,
              ]}
            >
              {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Numeric Keypad */}
      <View style={styles.keypadContainer}>
        {keypadNumbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.keypadButton,
                  key === ''
                    ? styles.keypadButtonEmpty
                    : styles.keypadButtonFilled,
                ]}
                onPress={() => key && handleKeyPress(key)}
                disabled={key === ''}
              >
                {key === 'backspace' ? (
                  <Text style={styles.keypadBackspace}>⌫</Text>
                ) : (
                  <Text style={styles.keypadText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  changePhoneContainer: {
    marginBottom: 40,
  },
  changePhoneText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  changePhoneLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 2,
  },
  otpInputEmpty: {
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    color: '#1a1a1a',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    color: '#007AFF',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#6c757d',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendEnabled: {
    color: '#007AFF',
  },
  resendDisabled: {
    color: '#adb5bd',
  },
  keypadContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 24,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonFilled: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  keypadBackspace: {
    fontSize: 20,
    color: '#6c757d',
  },
});

export default EnterVerificationCode;
