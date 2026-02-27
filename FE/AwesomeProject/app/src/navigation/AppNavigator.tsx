// src/navigation/RootNavigator.js - UPDATED WITH ORDER SUCCESS SCREEN
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import context
import { useAuth } from '@/context/AuthContext';

// Import Opening Screen
import OpeningScreen from '@/screens/OpeningScreen';

// Import Auth Screens
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginSuccesScreen from '@/screens/LoginSuccessScreen';

// Import Order Success Screen
import OrderSuccessScreen from '@/screens/OrderSuccessScreen';

// Import Main App Navigator (Tab Navigator)
import MainTabNavigator from './MainTabNavigator';
import withProviders from '@/utils/withProviders';
import ConsultationScreen from '@/screens/ConsultationScreen';
import ArticleDetailScreen from '@/screens/ArticleDetailScreen';
import ProductScreen from '@/screens/ProductScreen';
import WrappedProductScreen from '@/screens/WrappedProductScreen';
import ProtectedProfileScreen from '@/screens/ProtectedProfileScreen';
import CartScreen from '@/screens/CartScreen';
import UsadaScreen from '@/screens/UsadaScreen';
import HerbalScanScreen from '@/screens/HerbalScanScreen';

// Create stack navigator instance
const RootStack = createStackNavigator();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      OrderSuccess: {
        path: '/order-success/:orderId',
        parse: {
          orderId: (orderId) => orderId,
        },
      },
    },
  },
};


const COLORS = {
  primary: '#4F7942',
  lightPrimary: 'rgba(79, 121, 66, 0.15)',
  background: '#FFFFFF',
  border: '#E8F3E8',
  inactive: '#86A789',
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight || (Platform.OS === 'ios' ? 47 : 0);

const openingScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#1B4332' },
  gestureEnabled: false, 
  animationEnabled: false, 
};

const fastScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  gestureResponseDistance: 50,
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 200 } },
    close: { animation: 'timing', config: { duration: 150 } },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width * 0.3, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    };
  },
};

// Specific options for ConsultationScreen - Optimized untuk scroll dan gesture
const consultationScreenOptions = {
  headerShown: false,
  cardStyle: { 
    backgroundColor: '#F8FDF8',
    flex: 1 // Ensure full height untuk scroll
  },
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  gestureResponseDistance: 80, // Responsive gesture area
  presentation: 'card',
  animationEnabled: true,
  // Smooth transition untuk consultation screen
  transitionSpec: {
    open: { 
      animation: 'timing', 
      config: { 
        duration: 300,
        useNativeDriver: true // Hardware acceleration
      } 
    },
    close: { 
      animation: 'timing', 
      config: { 
        duration: 250,
        useNativeDriver: true
      } 
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95], // Subtle scale effect
                })
              : 1,
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.9, 1],
        }),
      },
    
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.1],
        }),
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
    };
  },
};

// Modal screen options untuk auth screens
const modalScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  presentation: 'modal',
  gestureDirection: 'vertical',
  gestureResponseDistance: 100,
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 300 } },
    close: { animation: 'timing', config: { duration: 250 } },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};

// 🎉 ORDER SUCCESS SCREEN OPTIONS - Modal dengan animasi khusus
const orderSuccessScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: false, // Prevent swipe to dismiss untuk memastikan user melihat success message
  presentation: 'modal',
  animationEnabled: true,
  transitionSpec: {
    open: { 
      animation: 'timing', 
      config: { 
        duration: 400,
        useNativeDriver: true
      } 
    },
    close: { 
      animation: 'timing', 
      config: { 
        duration: 300,
        useNativeDriver: true
      } 
    },
  },
  // Custom animation untuk success screen - scale up effect
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.8, 1],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.7, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.4],
        }),
        backgroundColor: 'rgba(79, 121, 66, 0.1)', // Light green overlay
      },
    };
  },
};

const AppNavigator = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    console.log('RootNavigator: AuthContext is still loading...');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // 🔥 NAVIGATION STACK: Start with Opening Screen
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <RootStack.Navigator
        screenOptions={fastScreenOptions}
        initialRouteName="Opening" // Start with opening screen
      >
        <RootStack.Screen 
          name="Opening"
          component={OpeningScreen}
          options={openingScreenOptions}
        />
    
        <RootStack.Screen 
          name="MainApp"
          component={MainTabNavigator}
          options={{ 
            gestureEnabled: false,
            transitionSpec: {
              open: { 
                animation: 'timing', 
                config: { 
                  duration: 500,
                  useNativeDriver: true
                } 
              },
              close: { 
                animation: 'timing', 
                config: { 
                  duration: 300,
                  useNativeDriver: true
                } 
              },
            },
            cardStyleInterpolator: ({ current }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.8, 1],
                  }),
                  transform: [
                    {
                      scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
        
        <RootStack.Screen 
          name="ConsultationScreen"
          component={ConsultationScreen}
          options={consultationScreenOptions}
        />

         
        <RootStack.Screen 
          name="ScanScreen"
          component={HerbalScanScreen}
          options={consultationScreenOptions}
        />

        <RootStack.Screen 
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={consultationScreenOptions}
        />

        <RootStack.Screen 
          name="ProductMain"
          component={WrappedProductScreen}
          options={consultationScreenOptions}
        />

        <RootStack.Screen 
          name="ProfileMain"
          component={ProtectedProfileScreen}
          options={consultationScreenOptions}
        />

        <RootStack.Screen 
          name="CartMain" 
          component={CartScreen}
          options={consultationScreenOptions}
        />

        <RootStack.Screen 
          name="UsadaMain" 
          component={UsadaScreen}
          options={consultationScreenOptions}
        />
        
        {/* 🎉 ORDER SUCCESS SCREEN - Modal dengan animasi khusus */}
        <RootStack.Screen 
          linking={linking}
          name="OrderSuccess"
          component={OrderSuccessScreen}
          options={orderSuccessScreenOptions}
        />
        
        {/* 🔴 AUTH SCREENS: Modal presentation */}
        <RootStack.Screen 
          name="Login"
          component={LoginScreen}
          options={modalScreenOptions}
        />
        <RootStack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            ...modalScreenOptions,
            gestureDirection: 'horizontal', // Horizontal untuk register
            presentation: 'card'
          }}
        />
        <RootStack.Screen 
          name="LoginSuccess" 
          component={LoginSuccesScreen}
          options={{ 
            ...modalScreenOptions,
            gestureEnabled: false, // Disable gesture untuk success screen
          }}
        />
      </RootStack.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
  },
});

export default withProviders(AppNavigator);