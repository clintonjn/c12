import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AuthService from '../services/AuthService';
import GoogleAuthService from '../services/GoogleAuthService';
import CustomAlert from './CustomAlert';

interface RegistrationProps {
  onRegistrationComplete: () => void;
  onSwitchToLogin: () => void;
}

const Registration = ({
  onRegistrationComplete,
  onSwitchToLogin,
}: RegistrationProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false,
    password: false,
  });
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'error' | 'success' | 'info' = 'error'
  ) => {
    setAlert({ visible: true, title, message, type });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove formatting characters and check if it's exactly 10 digits
    const digitsOnly = phone.replace(/[^\d]/g, '');
    return digitsOnly.length === 10;
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      phoneNumber: !validatePhone(formData.phoneNumber),
      email: !validateEmail(formData.email),
      password: formData.password.length < 6,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (field: string, value: string) => {
    // Phone number specific handling
    if (field === 'phoneNumber') {
      // Allow digits, +, (, ), spaces, and hyphens, but limit digits to 10
      const digitsOnly = value.replace(/[^\d]/g, '');
      if (digitsOnly.length > 10) {
        return; // Don't update if more than 10 digits
      }
      // Allow formatting characters
      value = value.replace(/[^\d+() -]/g, '');
    }

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await AuthService.registerUser(
      formData.email,
      formData.password,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      }
    );
    setLoading(false);

    if (result.success) {
      onRegistrationComplete();
    } else {
      showAlert('Registration Failed', result.error);
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const result = await GoogleAuthService.signIn();
    setLoading(false);

    if (result.success) {
      // Google Sign-In successful, navigate to welcome screen
      onRegistrationComplete();
    } else if (!('cancelled' in result)) {
      // Only show error if it wasn't cancelled
      showAlert(
        'Google Sign-In Failed',
        'error' in result ? result.error : 'Unknown error'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>C12</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join C12 today</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={value => handleInputChange('firstName', value)}
              placeholderTextColor="#999"
              selectionColor="#333"
            />

            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={value => handleInputChange('lastName', value)}
              placeholderTextColor="#999"
              selectionColor="#333"
            />

            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              placeholder="Phone Number (exactly 10 digits)"
              value={formData.phoneNumber}
              onChangeText={value => handleInputChange('phoneNumber', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              selectionColor="#333"
              maxLength={15}
            />

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              selectionColor="#333"
            />
            {errors.email && (
              <Text style={styles.errorText}>
                Please enter a valid email address
              </Text>
            )}

            {/* Password Field with Eye Button */}
            <View
              style={[
                styles.passwordContainer,
                errors.password && styles.passwordContainerError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                textContentType="password"
                placeholderTextColor="#999"
                selectionColor="#333"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={
                    showPassword
                      ? require('../assets/icons/hide.png')
                      : require('../assets/icons/view.png')
                  }
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>
                Password must be at least 6 characters
              </Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Registration Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleRegister}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Switch to Login */}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={onSwitchToLogin}
            >
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={styles.switchLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: 'Ubuntu Mono',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainerError: {
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    color: '#333',
  },
  eyeButton: {
    padding: 16,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  registerButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Ubuntu Mono',
    color: '#999',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Ubuntu Mono',
    color: '#666',
  },
  switchLink: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Registration;
