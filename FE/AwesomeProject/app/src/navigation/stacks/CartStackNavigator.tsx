import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import { CommonActions } from '@react-navigation/native';

// Import screens
import CartScreen from '@/screens/CartScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import PaymentInfoScreen from '@/screens/PaymentInfoScreen'; // NEW: Payment handling screen
import OrderSuccessScreen from '@/screens/OrderSuccessScreen';
import OrdersScreen from '@/screens/OrdersScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

import { CartStackParamList } from '@/types/navigation';

const CartStack = createStackNavigator<CartStackParamList>();

// Common screen options
const commonStackScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 250,
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 200,
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: { current: any; layouts: any }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const CartStackNavigator = ({ navigation }: { navigation: any }) => {
  const { isAuthenticated } = useAuth();

  // Reset navigation stack when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      // If user just logged in, reset to CartMain and then navigate to Checkout
      navigation?.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'CartMain' },
            { name: 'Checkout' }
          ],
        })
      );
    }
  }, [isAuthenticated, navigation]);

  return (
    <CartStack.Navigator
      initialRouteName="CartMain"
      screenOptions={commonStackScreenOptions}
    >
      {/* Always include CartMain */}
      <CartStack.Screen 
        name="CartMain" 
        component={CartScreen} 
      />
      
      {/* Checkout Screen */}
      <CartStack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
      />
      
      {/* 🚨 NEW: Payment Info Screen - Handles Xendit payment flow */}
      <CartStack.Screen 
        name="PaymentInfo" 
        component={PaymentInfoScreen}
        options={{
          gestureEnabled: false, // Prevent swiping back during payment
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
      
      {/* Order Success Screen */}
      <CartStack.Screen 
        name="OrderSuccess" 
        component={OrderSuccessScreen}
        options={{
          gestureEnabled: false, // Prevent swiping back from success screen
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
      
      {/* Orders/Order History Screen */}
      <CartStack.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
      
      {/* Alternative route name for Orders (for compatibility) */}
      <CartStack.Screen 
        name="OrderHistory" 
        component={OrdersScreen}
        options={{
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
      
      {/* Login Screen within Cart stack */}
      <CartStack.Screen 
        name="CartLogin" 
        component={LoginScreen}
        options={{
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
      
      {/* Register Screen within Cart stack */}
      <CartStack.Screen 
        name="CartRegister" 
        component={RegisterScreen}
        options={{
          cardStyle: { backgroundColor: '#F8FDF8' },
        }}
      />
    </CartStack.Navigator>
  );
};

export default CartStackNavigator;