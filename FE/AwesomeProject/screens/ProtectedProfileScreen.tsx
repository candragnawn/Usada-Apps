// src/Screens/ProtectedProfileScreen.js - Auth Guard for Profile
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

// Import context
import { useAuth } from '@/context/AuthContext';

// Import actual ProfileScreen
import ProfileScreen from '@/screens/ProfileScreen';
import withProviders from '@/utils/withProviders';

const COLORS = {
  primary: '#4F7942',
  lightPrimary: 'rgba(79, 121, 66, 0.15)',
  background: '#FFFFFF',
  border: '#E8F3E8',
  text: '#2D3436',
  textSecondary: '#636E72',
};

// Login Required Component
const LoginRequiredView = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon name="user" size={80} color={COLORS.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Masuk ke Akun Anda</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Untuk mengakses profil dan fitur personalisasi lainnya, silakan masuk terlebih dahulu
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLoginPress}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegisterPress}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Daftar Akun Baru</Text>
          </TouchableOpacity>
        </View>

        {/* Footer text */}
        <Text style={styles.footerText}>
          Dengan masuk, Anda dapat menyimpan preferensi dan mengakses fitur eksklusif
        </Text>
      </View>
    </SafeAreaView>
  );
};

// Main Protected Profile Component
const ProtectedProfileScreen = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading if auth is still being checked
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="loader" size={40} color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  
  if (!isAuthenticated || !user) {
    return <LoginRequiredView />;
  }

  // 🟢 AUTHENTICATED: Show actual ProfileScreen
  return <ProfileScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  registerButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default withProviders(ProtectedProfileScreen);