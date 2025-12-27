import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AppText = ({
  children,
  variant = 'body', // 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label'
  style,
  bold = false,
  extraBold = false,
  ...props
}) => {
  const fontWeight = extraBold ? 'bold' : bold ? '600' : 'normal';

  return (
    <Text
      style={[
        styles.text,
        styles[variant],
        { fontWeight },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#333',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AppText;

