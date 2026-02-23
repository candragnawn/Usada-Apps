// QuotesSwiper.js - Animated Image Quotes Component for Usada Bali
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const QuotesSwiper = ({ 
  quotes = [
    require('@/assets/images/q1.png'),
    require('@/assets/images/q2.png'),
    require('@/assets/images/q3.png'),
  ],
  autoSwipeInterval = 4000,
  showIndicators = true,
  showNavigation = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    startAutoSwipe();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAutoSwipe = () => {
    intervalRef.current = setInterval(() => {
      swipeToNext();
    }, autoSwipeInterval);
  };

  const stopAutoSwipe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const swipeToNext = () => {
    animateTransition(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    });
  };

  const swipeToPrev = () => {
    animateTransition(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
      );
    });
  };

  const swipeToIndex = (index) => {
    if (index !== currentIndex) {
      stopAutoSwipe();
      animateTransition(() => {
        setCurrentIndex(index);
      });
      setTimeout(startAutoSwipe, autoSwipeInterval);
    }
  };

  const animateTransition = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      
      // Reset and animate in
      slideAnim.setValue(-1);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const slideTranslateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.3, 0, width * 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Main Quote Image */}
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateX: slideTranslateX },
              ],
            },
          ]}
        >
          {/* Glow Effect Background */}
          <View style={styles.imageGlow} />
          
          {/* Main Image */}
          <Image
            source={quotes[currentIndex]}
            style={styles.quoteImage}
            resizeMode="cover"
          />
          
          {/* Decorative Border */}
          <View style={styles.decorativeBorder} />
        </Animated.View>
      </View>

      {/* Navigation Buttons */}
      {showNavigation && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={swipeToPrev}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={swipeToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Indicators */}
      {showIndicators && (
        <View style={styles.indicatorContainer}>
          {quotes.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
              onPress={() => swipeToIndex(index)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      )}

      {/* Floating Decorative Elements */}
      <View style={styles.floatingContainer}>
        <FloatingElement delay={0} emoji="🌿" />
        <FloatingElement delay={500} emoji="✨" />
        <FloatingElement delay={1000} emoji="🌺" />
        <FloatingElement delay={1500} emoji="🍃" />
      </View>
    </View>
  );
};

// Floating Decorative Element Component
const FloatingElement = ({ delay, emoji }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const translateX = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  return (
    <Animated.Text
      style={[
        styles.floatingElement,
        {
          opacity: opacityAnim,
          transform: [
            { translateY },
            { translateX },
          ],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGlow: {
    position: 'absolute',
    width: width * 0.85,
    height: 200,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 121, 66, 0.2)',
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  quoteImage: {
    width: width * 0.8,
    height: 180,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'rgba(79, 121, 66, 0.5)',
  },
  decorativeBorder: {
    position: 'absolute',
    width: width * 0.82,
    height: 184,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    top: -2,
    left: -2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    position: 'absolute',
    top: '45%',
    paddingHorizontal: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(27, 67, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 121, 66, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(79, 121, 66, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#4F7942',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.2 }],
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 16,
    top: Math.random() * 100 + 20,
    left: Math.random() * (width - 50) + 25,
  },
});

export default QuotesSwiper;