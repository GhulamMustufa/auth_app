import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = '@user'; // Current logged-in user
const USERS_STORAGE_KEY = '@users'; // List of all registered users

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored user on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all registered users
  const getUsers = async () => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  // Save all registered users
  const saveUsers = async (users) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const users = await getUsers();
      const trimmedEmail = email.trim().toLowerCase();
      
      // Find user by email
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password (in production, use hashed password comparison)
      if (foundUser.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create user object without password for current session
      const { password: _, ...userWithoutPassword } = foundUser;

      // Set as current user (without password)
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const users = await getUsers();
      const trimmedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail
      );

      if (existingUser) {
        return { success: false, error: 'User with this email already exists.' };
      }

      // Create new user
      const userData = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        password: password, // In production, hash this password
      };

      // Add to users list
      const updatedUsers = [...users, userData];
      await saveUsers(updatedUsers);

      // Don't auto-login - just return success
      // User will need to login separately
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
