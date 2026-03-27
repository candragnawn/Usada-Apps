// ProfileStackNavigator.js - FIXED: Quick Logout Routing Issue
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import { CommonActions, useFocusEffect, useNavigationState, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

// Import screens
import ProtectedProfileScreen from '@/screens/ProtectedProfileScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginSuccessScreen from '@/screens/LoginSuccessScreen';

import { ProfileStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<ProfileStackParamList>();

// Common screen options
const commonStackScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: { duration: 250 },
    },
    close: {
      animation: 'timing' as const,
      config: { duration: 200 },
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

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProtectedProfile"
      screenOptions={commonStackScreenOptions}
    >
      <Stack.Screen
        name="ProtectedProfile"
        component={ProtectedProfileScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'none',
        }}
      />

      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'none',
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'default',
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={commonStackScreenOptions}
      />

      <Stack.Screen
        name="LoginSuccess"
        component={LoginSuccessScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'default',
          gestureEnabled: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;