import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFontFamily } from '../utils/fontFamily';

const Welcome = () => {
  return (
    <View style={styles.container}>
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
