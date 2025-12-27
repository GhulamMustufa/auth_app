import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AppButton, AppText } from '../components';

const HomeScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Welcome!</AppText>
        
        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <AppText variant="label" style={styles.label}>Name:</AppText>
            <AppText style={styles.value}>{user?.name || 'N/A'}</AppText>
          </View>
          
          <View style={styles.infoRow}>
            <AppText variant="label" style={styles.label}>Email:</AppText>
            <AppText style={styles.value}>{user?.email || 'N/A'}</AppText>
          </View>
        </View>

        <AppButton
          title="Logout"
          onPress={handleLogout}
          variant="danger"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    color: '#666',
    width: 80,
  },
  value: {
    color: '#333',
    flex: 1,
  },
});

export default HomeScreen;
