import React, { useState, useEffect } from 'react';
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
import firestore from '@react-native-firebase/firestore';

interface WelcomeProps {
  onLogout: () => void;
  user: unknown;
}

const Welcome = ({ onLogout, user }: WelcomeProps) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userObj = user as { uid?: string };
      if (userObj?.uid) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(userObj.uid)
            .get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          }
        } catch {
          // Error fetching user data
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    const result = await AuthService.logoutUser();
    if (result.success) {
      onLogout();
    } else {
      Alert.alert('Logout Failed', result.error);
    }
  };

  // Get display name from Firestore user data
  const getDisplayName = () => {
    const userObj = user as { displayName?: string; email?: string };
    const userDataObj = userData as {
      firstName?: string;
      lastName?: string;
      email?: string;
    } | null;

    if (userDataObj?.firstName && userDataObj?.lastName) {
      return `${userDataObj.firstName} ${userDataObj.lastName}`;
    }
    if (userDataObj?.firstName) {
      return userDataObj.firstName;
    }
    if (userDataObj?.email) {
      return userDataObj.email.split('@')[0];
    }
    if (userObj?.displayName) {
      return userObj.displayName;
    }
    if (userObj?.email) {
      return userObj.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <View style={styles.container}>
      {/* Username in top left */}
      <Text style={[styles.subtitle, styles.usernamePosition]}>
        {getDisplayName()}
      </Text>

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
  usernamePosition: {
    position: 'absolute',
    top: 60,
    left: 20,
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
