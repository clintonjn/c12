import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AuthService from '../services/AuthService';

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    // Basic validation
    if (
      formData.firstName &&
      formData.lastName &&
      formData.phoneNumber &&
      formData.email &&
      formData.password
    ) {
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
        Alert.alert('Registration Failed', result.error);
      }
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement actual Google Sign-In
    // For now, simulate successful Google registration
    onRegistrationComplete();
  };

  return (
    <ScrollView style={styles.container}>
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
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={value => handleInputChange('firstName', value)}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={value => handleInputChange('lastName', value)}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={value => handleInputChange('phoneNumber', value)}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            secureTextEntry
            placeholderTextColor="#999"
          />

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
    </ScrollView>
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
