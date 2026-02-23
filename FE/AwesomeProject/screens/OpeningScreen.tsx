// OpeningScreen.js - Animated Opening Screen for Usada Bali
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OpeningScreen = () => {
  const navigation = useNavigation();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0.8)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animation sequence
    startAnimationSequence();
    
    // Navigate to main app after animation
    const timer = setTimeout(() => {
      navigation.replace('MainApp');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const startAnimationSequence = () => {
    // Background fade in
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Overlay fade out slightly
    Animated.timing(overlayOpacity, {
      toValue: 0.6,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Logo entrance animation (scale + fade + rotation)
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start pulse animation after logo appears
      startPulseAnimation();
    });

    // Title animation
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle animation
    Animated.parallel([
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 1800,
        useNativeDriver: true,
      }),
      Animated.spring(subtitleTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 1800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Background with Batik Pattern */}
      <Animated.View 
        style={[
          styles.backgroundContainer,
          { opacity: backgroundOpacity }
        ]}
      >
        <ImageBackground
          source={require('@/assets/images/bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Gradient Overlay */}
          <Animated.View 
            style={[
              styles.gradientOverlay,
              { opacity: overlayOpacity }
            ]}
          />
        </ImageBackground>
      </Animated.View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo Container with Animations */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                transform: [
                  { scale: logoScale },
                  { scale: pulseAnimation },
                  { rotate: logoRotationInterpolate },
                ],
                opacity: logoOpacity,
              },
            ]}
          >
            {/* Logo Glow Effect */}
            <View style={styles.logoGlow} />
            
            {/* Main Logo */}
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Title Section */}
        <View style={styles.textContainer}>
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Text style={styles.mainTitle}>🌿 TAKSU USADA</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          <Animated.View
            style={[
              styles.subtitleContainer,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            <Text style={styles.subtitle}>Pengobatan Tradisional Bali</Text>
            <Text style={styles.description}>
              Traditional Balinese Herbal Medicine
            </Text>
            <Text style={styles.tagline}>
               Antara tubuh dan pikiran, manusia dan alam 
            </Text>
          </Animated.View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={styles.decorativeLine} />
          <Image
              source={require('@/assets/images/OM-SWASTYASTU.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          <View style={styles.decorativeLine} />
        </View>
      </View>

      {/* Floating Elements Animation */}
      <View style={styles.floatingElementsContainer}>
        {Array.from({ length: 8 }).map((_, index) => (
          <FloatingElement key={index} index={index} />
        ))}
      </View>
    </View>
  );
};

// Floating Elements Component
const FloatingElement = ({ index }) => {
  const floatAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animation start
    const delay = index * 200;
    
    Animated.timing(opacityAnimation, {
      toValue: 0.6,
      duration: 1000,
      delay,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000 + (index * 500),
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000 + (index * 500),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [index]);

  const translateY = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30 - (index * 5)],
  });

  const translateX = floatAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, (index % 2 === 0 ? 10 : -10), 0],
  });

  const elements = ['🌿', '🌺', '🍃', '✨', '🌸', '🌱', '🌴', '🌙'];
  
  return (
    <Animated.Text
      style={[
        styles.floatingElement,
        {
          left: (width / 8) * index + (index * 10),
          top: height * 0.15 + (index % 3) * 100,
          opacity: opacityAnimation,
          transform: [
            { translateY },
            { translateX },
          ],
        },
      ]}
    >
      {elements[index]}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 67, 50, 0.8)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    width: 150,
    height: 150,
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  titleUnderline: {
    width: 150,
    height: 3,
    backgroundColor: '#4F7942',
    marginTop: 10,
    borderRadius: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#C8E6C9',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#A5D6A7',
    textAlign: 'center',
    letterSpacing: 1,
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorativeText: {
    fontSize: 24,
    color: '#4F7942',
    marginHorizontal: 20,
  },
  floatingElementsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default OpeningScreen;