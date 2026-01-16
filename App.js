import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/context/UserContext';
import SplashScreen from './src/components/SplashScreen';
import Registration from './src/components/Registration';
import Login from './src/components/Login';
import OTPFlow from './src/components/OTPFlow';
import MainTabs from './src/navigation/MainTabs';
import AuthService from './src/services/AuthService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(true); // Skip OTP by default for existing users
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      setAuthReady(true); // Mark auth as ready
    });

    return unsubscribe;
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsOTPVerified(false); // Reset OTP verification
  };

  const handleOTPVerified = () => {
    setIsOTPVerified(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOTPVerified(false);
    setShowLogin(true);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
  };

  // Always show splash screen first, regardless of auth state
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Wait for auth to be ready before showing main app
  if (!authReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isAuthenticated && !isOTPVerified) {
    return (
      <View style={styles.container}>
        <OTPFlow
          onOTPVerified={handleOTPVerified}
          onBackToLogin={handleLogout}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (isAuthenticated && isOTPVerified) {
    return (
      <UserProvider>
        <NavigationContainer>
          <MainTabs onLogout={handleLogout} user={currentUser} />
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserProvider>
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
