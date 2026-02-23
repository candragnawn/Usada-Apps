import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import UsadaScreen from '@/screens/UsadaScreen';
import ArticleDetailScreen from '@/screens/ArticleDetailScreen';
import ConsultationScreen from '@/screens/ConsultationScreen';

const UsadaStack = createStackNavigator();

// Enhanced screen options with better performance and navigation handling
const commonStackScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  // Enhanced animation config for smoother transitions
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        useNativeDriver: true,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        useNativeDriver: true,
      },
    },
  },
  // Improved card style interpolator
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 0.9, 1],
          outputRange: [0, 0.25, 0.7, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
          extrapolate: 'clamp',
        }),
      },
    };
  },
};

// Enhanced Usada Stack Navigator with better navigation handling
const UsadaStackNavigator = () => {
  return (
    <UsadaStack.Navigator
      initialRouteName="UsadaMain"
      screenOptions={commonStackScreenOptions}
      // Enhanced navigation options
      screenListeners={({ navigation, route }) => ({
        focus: (e) => {
          // Enhanced focus handling for better parameter processing
          console.log('📍 UsadaStack Focus:', {
            routeName: route.name,
            params: route.params,
            timestamp: Date.now()
          });
        },
        beforeRemove: (e) => {
          // Handle cleanup before screen removal
          console.log('🧹 UsadaStack BeforeRemove:', route.name);
        }
      })}
    >
      {/* Main Usada Screen - Multiple aliases for better navigation compatibility */}
      <UsadaStack.Screen 
        name="UsadaMain"
        component={UsadaScreen}
        options={{
          ...commonStackScreenOptions,
          // Add specific options for main screen
          gestureResponseDistance: {
            horizontal: 100,
          },
        }}
        initialParams={{
          // Default parameters to handle edge cases
          selectedCategory: 'Semua',
          searchText: '',
          fromCategorySelection: false
        }}
      />
      
      {/* Alternative screen names for better navigation compatibility */}
      <UsadaStack.Screen 
        name="UsadaScreen"
        component={UsadaScreen}
        options={commonStackScreenOptions}
        initialParams={{
          selectedCategory: 'Semua',
          searchText: '',
          fromCategorySelection: false
        }}
      />
      
      {/* Another alias for maximum compatibility */}
      <UsadaStack.Screen 
        name="Usada"
        component={UsadaScreen}
        options={commonStackScreenOptions}
        initialParams={{
          selectedCategory: 'Semua',
          searchText: '',
          fromCategorySelection: false
        }}
      />

      {/* Article Detail Screen */}
      <UsadaStack.Screen 
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          ...commonStackScreenOptions,
          // Enhanced options for article detail
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            };
          },
        }}
      />

      {/* Consultation Screen - if needed */}
      <UsadaStack.Screen 
        name="Consultation"
        component={ConsultationScreen}
        options={{
          ...commonStackScreenOptions,
          // Modal-style presentation for consultation
          presentation: 'modal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            };
          },
        }}
      />

      <UsadaStack.Screen 
        name="ConsultationScreen"
        component={ConsultationScreen}
        options={{
          ...commonStackScreenOptions,
          presentation: 'modal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
    </UsadaStack.Navigator>
  );
};

export default UsadaStackNavigator;