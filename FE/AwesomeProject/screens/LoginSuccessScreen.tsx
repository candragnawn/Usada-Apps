// LoginSuccessScreen.js - For ProfileStackNavigator approach
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import withProviders from '@/utils/withProviders';

const { width, height } = Dimensions.get('window');

const LoginSuccessScreen = ({ navigation, route, authNav }) => {
  const { user } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    console.log('✅ LoginSuccess: Screen mounted, user authenticated:', !!user);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to ProfileMain in ProfileStackNavigator
    const navigationTimer = setTimeout(() => {
      console.log('✅ LoginSuccess: Navigating to ProfileMain');
      
      try {
        // For ProfileStackNavigator approach
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'MainApp',
                state: {
                  index: 4, // ProfileStack tab index
                  routes: [
                    { name: 'HomeScreen' },
                    { name: 'UsadaScreen' },
                    { name: 'ProductScreen' },
                    { name: 'CartStack' },
                    { 
                      name: 'ProfileStack',
                      state: {
                        index: 0,
                        routes: [{ name: 'ProfileMain' }] // Navigate to ProfileMain
                      }
                    },
                  ],
                },
              },
            ],
          })
        );
      } catch (error) {
        console.error('❌ Navigation error:', error);
        // Fallback: Navigate within the ProfileStack
        try {
          navigation.replace('ProfileMain');
        } catch (fallbackError) {
          console.error('❌ Fallback navigation failed:', fallbackError);
          navigation.navigate('MainApp');
        }
      }
    }, 2500); // 2.5 seconds delay for animation

    return () => clearTimeout(navigationTimer);
    
  }, [fadeAnim, scaleAnim, slideAnim, user, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F7942" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Success Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={60} color="#FFFFFF" />
        </View>
      </Animated.View>

      {/* Success Text */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.successTitle}>Login Berhasil!</Text>
        <Text style={styles.welcomeText}>
          Selamat datang, {user?.name || 'User'}
        </Text>
        <Text style={styles.subtitleText}>
          Mengarahkan ke profil Anda...
        </Text>
      </Animated.View>

      {/* Animated loading dots */}
      <Animated.View
        style={[
          styles.loadingContainer,
          { opacity: fadeAnim },
        ]}
      >
        <LoadingDots />
      </Animated.View>
    </View>
  );
};

// Loading dots component
const LoadingDots = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const createAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createAnimation(dot1, 0),
      createAnimation(dot2, 200),
      createAnimation(dot3, 400),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F7942',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4F7942',
    opacity: 0.9,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.9,
  },
  subtitleText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
});

export default withProviders(LoginSuccessScreen);