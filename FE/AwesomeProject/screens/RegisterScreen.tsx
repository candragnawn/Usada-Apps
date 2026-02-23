import React, { useState } from 'react';
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

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigation = useNavigation();
  const { register, isLoading, isAuthenticated } = useAuth();

  // Navigate away if user is already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    // Hide login prompt when user starts typing
    if (showLoginPrompt) {
      setShowLoginPrompt(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      setRegistrationSuccess(true);
      // Optional: You can still show Alert if you want
      // Alert.alert('Registrasi Berhasil', 'Akun Anda berhasil dibuat! Silakan login untuk melanjutkan.');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if error indicates user already exists
      if (error.message.includes('email') && 
          (error.message.includes('taken') || 
           error.message.includes('exists') || 
           error.message.includes('already'))) {
        setShowLoginPrompt(true);
      } else {
        // Handle other errors
        let errorMessage = 'Please try again later';
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert('Registration Failed', errorMessage);
      }
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const renderInputContainer = (field, placeholder, icon, keyboardType = 'default', isPassword = false) => {
    const isPasswordField = field === 'password';
    const isConfirmPasswordField = field === 'confirmPassword';
    const showPasswordState = isPasswordField ? showPassword : showConfirmPassword;
    const setShowPasswordState = isPasswordField ? setShowPassword : setShowConfirmPassword;

    return (
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
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            secureTextEntry={isPassword && !showPasswordState}
            placeholderTextColor="#86A789"
            autoCorrect={false}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPasswordState(!showPasswordState)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPasswordState ? 'eye-off-outline' : 'eye-outline'}
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
  };

  const renderLoginPrompt = () => (
    <View style={styles.promptContainer}>
      <View style={styles.promptCard}>
        <Ionicons name="person-circle-outline" size={40} color="#4F7942" />
        <Text style={styles.promptTitle}>Account Already Exists</Text>
        <Text style={styles.promptMessage}>
          It looks like you already have an account with this email. Would you like to login instead?
        </Text>
        <View style={styles.promptButtons}>
          <TouchableOpacity
            style={styles.promptButtonSecondary}
            onPress={() => setShowLoginPrompt(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.promptButtonSecondaryText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.promptButtonPrimary}
            onPress={navigateToLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.promptButtonPrimaryText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSuccessCard = () => (
    <View style={styles.successOverlay}>
      <View style={styles.successCard}>
        <Ionicons name="checkmark-circle" size={48} color="#4F7942" />
        <Text style={styles.successTitle}>Registrasi Berhasil!</Text>
        <Text style={styles.successMessage}>
          Akun Anda berhasil dibuat. Silakan login untuk melanjutkan.
        </Text>
        <TouchableOpacity
          style={styles.successButton}
          onPress={() => {
            setRegistrationSuccess(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        >
          <Text style={styles.successButtonText}>Lanjut ke Login</Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#4F7942" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Create Account</Text>
            <Text style={styles.subtitleText}>Sign up to get started</Text>
          </View>

          <View style={styles.formContainer}>
            {renderInputContainer('name', 'Full Name', 'person-outline')}
            {renderInputContainer('email', 'Email Address', 'mail-outline', 'email-address')}
            {renderInputContainer('password', 'Password', 'lock-closed-outline', 'default', true)}
            {renderInputContainer('confirmPassword', 'Confirm Password', 'lock-closed-outline', 'default', true)}

            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.registerButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.loadingText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.7}>
                <Text style={styles.loginLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {showLoginPrompt && renderLoginPrompt()}
        {registrationSuccess && renderSuccessCard()}
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
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
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
  registerButton: {
    backgroundColor: '#4F7942',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#86A789',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '600',
  },
  // Login Prompt Styles
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
  // Success Card Styles
  successOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 340,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F7942',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: '#4F7942',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  successButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default withProviders(RegisterScreen);