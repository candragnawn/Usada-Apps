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

const ProfileStackNavigator = ({ navigation: rootNavigation }: { navigation: any }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const internalNavigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const [isNavigatorReady, setIsNavigatorReady] = useState(false);
  const lastAuthStateRef = useRef<string | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 🔥 CRITICAL FIX: Get current route name safely
  const currentRouteName = useNavigationState(state => {
    if (!state || !state.routes || state.routes.length === 0) return null;
    return state.routes[state.index]?.name;
  });

  // 🔥 ENHANCED: Determine target route logic
  const getTargetRoute = useCallback(() => {
    if (isLoading) return null; // Don't navigate while loading
    
    const shouldShowProfile = isAuthenticated && !!user;
    return shouldShowProfile ? 'ProfileMain' : 'ProtectedProfile';
  }, [isAuthenticated, user, isLoading]);

  // 🔥 CRITICAL FIX: Immediate navigation with better error handling
  const performNavigation = useCallback((targetRoute: keyof ProfileStackParamList, reason: string) => {
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current as any);
      navigationTimeoutRef.current = null;
    }

    if (!isNavigatorReady) {
      console.log('⚠️ Navigator not ready for:', targetRoute);
      // Retry after navigator is ready
      navigationTimeoutRef.current = setTimeout(() => {
          performNavigation(targetRoute, reason + ' (retry)');
      }, 50) as any;
      return;
    }

    if (currentRouteName === targetRoute) {
      console.log('🔄 Already on target route:', targetRoute);
      return;
    }

    console.log(`🚀 NAVIGATION: ${reason}`, {
      from: currentRouteName,
      to: targetRoute,
      timestamp: new Date().toISOString()
    });

    try {
      internalNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: targetRoute }],
        })
      );
      console.log('✅ Navigation completed successfully');

      // Force re-render to ensure UI updates
      setForceUpdate(prev => prev + 1);
      
    } catch (error) {
      console.error('❌ Navigation error:', error);
      
      // Fallback navigation
      try {
        if ((rootNavigation as any)?.reset) {
          (rootNavigation as any).reset({
            index: 0,
            routes: [{ name: targetRoute }],
          });
          console.log('✅ Fallback navigation successful');
        } else if ((rootNavigation as any)?.navigate) {
          (rootNavigation as any).navigate(targetRoute);
          console.log('✅ Fallback navigate successful');
        }
      } catch (fallbackError) {
        console.error('❌ All navigation methods failed:', fallbackError);
      }
    }
  }, [currentRouteName, rootNavigation, internalNavigation, isNavigatorReady]);

  // 🔥 CRITICAL FIX: Enhanced auth state monitoring
  useEffect(() => {
    const targetRoute = getTargetRoute();
    
    if (!targetRoute) {
      console.log('⏳ Target route not determined yet (loading...)');
      return;
    }

    const currentAuthState = `${isAuthenticated}-${!!user}-${isLoading}`;
    
    console.log('🔄 Auth State Monitor:', {
      currentState: currentAuthState,
      lastState: lastAuthStateRef.current,
      targetRoute,
      currentRoute: currentRouteName,
      isNavigatorReady
    });

    // Always update the ref
    const hasStateChanged = currentAuthState !== lastAuthStateRef.current;
    lastAuthStateRef.current = currentAuthState;

    // Navigate if needed
    if (isNavigatorReady && (hasStateChanged || currentRouteName !== targetRoute)) {
      const reason = hasStateChanged ? 'Auth state changed' : 'Route correction needed';
      performNavigation(targetRoute, reason);
    }

  }, [isAuthenticated, user, isLoading, getTargetRoute, currentRouteName, isNavigatorReady, performNavigation]);

  // 🔥 CRITICAL FIX: Enhanced logout detection
  useEffect(() => {
    // Specific logout monitoring
    if (!isLoading && !isAuthenticated && !user && isNavigatorReady) {
      console.log(' LOGOUT DETECTED - Force navigate to ProtectedProfile');
      
      // Force immediate navigation on logout
      if (currentRouteName !== 'ProtectedProfile') {
        performNavigation('ProtectedProfile', 'Logout detected');
      }
    }
  }, [isAuthenticated, user, isLoading, currentRouteName, isNavigatorReady, performNavigation]);


  const handleNavigatorReady = useCallback(() => {
    console.log(' Navigator is ready!');
    setIsNavigatorReady(true);

    // Set initial state
    const currentAuthState = `${isAuthenticated}-${!!user}-${isLoading}`;
    lastAuthStateRef.current = currentAuthState;


    const targetRoute = getTargetRoute();
    if (targetRoute && currentRouteName !== targetRoute) {
      performNavigation(targetRoute, 'Navigator ready - initial route correction');
    }
  }, [isAuthenticated, user, isLoading, currentRouteName, getTargetRoute, performNavigation]);

  
  useFocusEffect(
    useCallback(() => {
      if (!isNavigatorReady) return;

      console.log('📍 ProfileStack focused - route check');
      
      const targetRoute = getTargetRoute();
      if (targetRoute && currentRouteName !== targetRoute) {
        console.log('🔧 Focus correction needed:', {
          currentRoute: currentRouteName,
          targetRoute
        });
        
        performNavigation(targetRoute, 'Focus correction');
      }
    }, [isNavigatorReady, currentRouteName, getTargetRoute, performNavigation])
  );

  // 🔥 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // 🔥 Dynamic initial route with fallback
  const getInitialRouteName = () => {
    if (isLoading) {
      return 'ProtectedProfile'; // Safe default while loading
    }
    
    const shouldShowProfile = isAuthenticated && !!user;
    const route = shouldShowProfile ? 'ProfileMain' : 'ProtectedProfile';
    
    console.log('🎯 Initial route:', {
      route,
      shouldShowProfile,
      isAuthenticated,
      hasUser: !!user,
      isLoading
    });
    
    return route;
  };

  // Navigation state change handler
  const handleNavigationStateChange = useCallback((state: any) => {
    try {
      if (state?.routes?.length > 0) {
        const newRoute = state.routes[state.index]?.name;
        console.log('📍 Route changed to:', newRoute);
      }
    } catch (error) {
      console.error('❌ Navigation state change error:', error);
    }
  }, []);

  useEffect(() => {
    handleNavigatorReady();
  }, [handleNavigatorReady]);

  console.log('🔄 ProfileStackNavigator render:', {
    isAuthenticated,
    hasUser: !!user,
    isLoading,
    isNavigatorReady,
    currentRoute: currentRouteName,
    initialRoute: getInitialRouteName(),
    forceUpdate
  });

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName() as any}
      screenOptions={commonStackScreenOptions}
      key={forceUpdate} 
    >
   
      <Stack.Screen
        name="ProtectedProfile"
        component={ProtectedProfileScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'none' as any,
        }}
      />

      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'none' as any,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'default' as any,
          presentation: 'modal',
        }}
      />

      {/* 📝 Register Screen */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={commonStackScreenOptions}
      />

      {/* 🎉 Login Success Screen */}
      <Stack.Screen
        name="LoginSuccess"
        component={LoginSuccessScreen}
        options={{
          ...commonStackScreenOptions,
          animation: 'default' as any,
          gestureEnabled: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;