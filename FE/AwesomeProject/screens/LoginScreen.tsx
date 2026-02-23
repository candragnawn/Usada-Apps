// src/Screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import withProviders from '@/utils/withProviders';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  
  const navigation = useNavigation();
  const { login, isLoading, isAuthenticated, checkAuthStatus } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }
  }, [isAuthenticated, navigation]);

  // Check for existing user on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    // Hide register prompt when user starts typing
    if (showRegisterPrompt) {
      setShowRegisterPrompt(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      
      // Navigation will be handled by the useEffect hook when isAuthenticated changes
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if error indicates user doesn't exist
      if (error.message.includes('credentials') || 
          error.message.includes('user not found') || 
          error.message.includes('invalid') ||
          error.message.includes('Unauthorized')) {
        setShowRegisterPrompt(true);
      } else {
        // Handle other errors
        let errorMessage = 'Please try again later';
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert('Login Failed', errorMessage);
      }
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const renderInputContainer = (field, placeholder, icon, keyboardType = 'default', isPassword = false) => (
    <View style={styles.inputWrapper}>
      <View style={[
        styles.inputContainer,
        errors[field] && styles.inputContainerError
      ]}>
        <Ionicons name={icon} size={22} color="#4F7942" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
          autoCapitalize="none"
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#86A789"
          autoCorrect={false}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#86A789"
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const renderRegisterPrompt = () => (
    <View style={styles.promptContainer}>
      <View style={styles.promptCard}>
        <Ionicons name="person-add-outline" size={40} color="#4F7942" />
        <Text style={styles.promptTitle}>Account Not Found</Text>
        <Text style={styles.promptMessage}>
          It looks like you don't have an account yet. Would you like to create one?
        </Text>
        <View style={styles.promptButtons}>
          <TouchableOpacity
            style={styles.promptButtonSecondary}
            onPress={() => setShowRegisterPrompt(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.promptButtonSecondaryText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.promptButtonPrimary}
            onPress={navigateToRegister}
            activeOpacity={0.7}
          >
            <Text style={styles.promptButtonPrimaryText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInputContainer('email', 'Email Address', 'mail-outline', 'email-address')}
            {renderInputContainer('password', 'Password', 'lock-closed-outline', 'default', true)}

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.loadingText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister} activeOpacity={0.7}>
                <Text style={styles.registerLinkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {showRegisterPrompt && renderRegisterPrompt()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F7942',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#86A789',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F3E8',
    height: 60,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 16,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4F7942',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#4F7942',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#86A789',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '600',
  },
  // Register Prompt Styles
  promptContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promptCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F7942',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  promptMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  promptButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  promptButtonSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F7942',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptButtonSecondaryText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '600',
  },
  promptButtonPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#4F7942',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptButtonPrimaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default withProviders(LoginScreen);