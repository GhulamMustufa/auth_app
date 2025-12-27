import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isEmpty, isValidEmail, isValidPassword } from '../utils/validation';
import { AppButton, AppTextInput, AppText, ErrorBanner } from '../components';

const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (isEmpty(name)) {
      newErrors.name = 'Name is required';
    }

    if (isEmpty(email)) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (isEmpty(password)) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setSignupError('');
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setSignupError(result.error || 'Signup failed. Please try again.');
    } else {
      // Navigate to login screen after successful signup
      navigation.navigate('Login');
    }
  };

  const handleNameChange = (text) => {
    setName(text);
    if (errors.name) setErrors({ ...errors, name: '' });
    setSignupError('');
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) setErrors({ ...errors, email: '' });
    setSignupError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) setErrors({ ...errors, password: '' });
    setSignupError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <AppText variant="h1" style={styles.title}>Create Account</AppText>
          <AppText style={styles.subtitle}>Sign up to get started</AppText>

          <ErrorBanner message={signupError} />

          <AppTextInput
            label="Name"
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your name"
            autoCapitalize="words"
            error={errors.name}
          />

          <AppTextInput
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />

          <AppTextInput
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password (min 6 chars)"
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <AppButton
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <AppText style={styles.footerText}>Already have an account? </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <AppText style={styles.footerLink}>Login</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignupScreen;
