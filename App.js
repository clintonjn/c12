import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Registration from './src/components/Registration';
import Welcome from './src/components/Welcome';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isRegistered) {
    return (
      <View style={styles.container}>
        <Welcome />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Registration onRegistrationComplete={handleRegistrationComplete} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
