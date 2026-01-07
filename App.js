import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Registration from './src/components/Registration';
import Login from './src/components/Login';
import Welcome from './src/components/Welcome';
import AuthService from './src/services/AuthService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true); // Show login screen after logout
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <Welcome onLogout={handleLogout} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLogin ? (
        <Login
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <Registration
          onRegistrationComplete={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
