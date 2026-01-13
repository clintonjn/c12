import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OTPVerification from './OTPVerification';
import EnterVerificationCode from './EnterVerificationCode';

interface OTPFlowProps {
  onOTPVerified: () => void;
  onBackToLogin: () => void;
}

const OTPFlow: React.FC<OTPFlowProps> = ({ onOTPVerified, onBackToLogin }) => {
  const [currentScreen, setCurrentScreen] = useState<'verification' | 'code'>(
    'verification'
  );
  const [phoneData, setPhoneData] = useState({
    phoneNumber: '',
    countryCode: '',
  });

  const handleSendOTP = (phoneNumber: string, countryCode: string) => {
    setPhoneData({ phoneNumber, countryCode });
    setCurrentScreen('code');
    // Here you would integrate with your OTP service (Firebase, Twilio, etc.)
  };

  const handleVerifyOTP = (otp: string) => {
    if (otp === '0000') {
      onOTPVerified();
    }
  };

  const handleResendOTP = () => {
    // Here you would resend the OTP
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'verification' ? (
        <OTPVerification
          onSendOTP={handleSendOTP}
          onBackToLogin={onBackToLogin}
        />
      ) : (
        <EnterVerificationCode
          phoneNumber={phoneData.phoneNumber}
          countryCode={phoneData.countryCode}
          onVerifyOTP={handleVerifyOTP}
          onResendOTP={handleResendOTP}
          onChangePhoneNumber={() => setCurrentScreen('verification')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OTPFlow;
