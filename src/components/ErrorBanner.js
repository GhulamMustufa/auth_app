import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorBanner = ({ message, style }) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ErrorBanner;

