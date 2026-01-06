import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const Registration = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    // Basic validation
    if (
      formData.firstName &&
      formData.lastName &&
      formData.phoneNumber &&
      formData.email
    ) {
      // Registration successful
      onRegistrationComplete();
    } else {
      // TODO: Show error message for incomplete form
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

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
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
});

export default Registration;
