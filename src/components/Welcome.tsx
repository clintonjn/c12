import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { getFontFamily } from '../utils/fontFamily';
import AuthService from '../services/AuthService';

interface WelcomeProps {
  onLogout: () => void;
}

const Welcome = ({ onLogout }: WelcomeProps) => {
  const handleLogout = async () => {
    const result = await AuthService.logoutUser();
    if (result.success) {
      onLogout();
    } else {
      Alert.alert('Logout Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image
          source={require('../assets/icons/logout.png')}
          style={styles.logoutIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.title}>C12</Text>
      <Text style={styles.subtitle}>
        Your basic app for all your requirements
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff', // Makes icon white
  },
  welcome: {
    fontSize: 32,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: getFontFamily('GRUPPO', 'regular'),
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu Mono',
    fontWeight: 'normal',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Welcome;
