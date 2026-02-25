// hooks/useAuthNavigation.js - Custom hook for handling auth-based navigation
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Custom hook for handling automatic navigation based on authentication state
 * @param {Object} navigation - React Navigation object
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation utilities
 */
export const useAuthNavigation = (navigation, options = {}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigationTimeoutRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const lastAuthState = useRef(isAuthenticated);
  const initializationRef = useRef(false);

  const {
    enableAutoRouting = true,
    debugMode = true,
    navigationDelay = 100,
    authenticatedRedirects = ['ProtectedProfile', 'Login', 'Register'],
    unauthenticatedRedirects = ['ProfileMain', 'LoginSuccess'],
    defaultAuthenticatedRoute = 'ProfileMain',
    defaultUnauthenticatedRoute = 'ProtectedProfile',
  } = options;

 
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);


  const getCurrentRoute = useCallback(() => {
    try {
      const state = navigation.getState();
      return state?.routes[state?.index]?.name || null;
    } catch (error) {
      console.error('Error getting current route:', error);
      return null;
    }
  }, [navigation]);

  // Safe navigation with debouncing
  const navigateWithDelay = useCallback((targetScreen, delay = navigationDelay) => {
    if (isNavigatingRef.current) {
      if (debugMode) {
        console.log('🔄 Navigation already in progress, skipping');
      }
      return false;
    }
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    isNavigatingRef.current = true;
    
    navigationTimeoutRef.current = setTimeout(() => {
      try {
        if (debugMode) {
          console.log(`🎯 Auto-navigating to: ${targetScreen}`);
        }
        navigation.navigate(targetScreen);
        return true;
      } catch (error) {
        console.error('❌ Navigation error:', error);
        return false;
      } finally {
        isNavigatingRef.current = false;
      }
    }, delay);
    
    return true;
  }, [navigation, navigationDelay, debugMode]);

  // Manual navigation methods
  const navigateToLogin = useCallback(() => {
    navigateWithDelay('Login');
  }, [navigateWithDelay]);

  const navigateToRegister = useCallback(() => {
    navigateWithDelay('Register');
  }, [navigateWithDelay]);

  const navigateToProfile = useCallback(() => {
    if (isAuthenticated) {
      navigateWithDelay('ProfileMain');
    } else {
      navigateWithDelay('ProtectedProfile');
    }
  }, [isAuthenticated, navigateWithDelay]);

  const navigateToLoginSuccess = useCallback(() => {
    navigateWithDelay('LoginSuccess');
  }, [navigateWithDelay]);

  // 🎯 MAIN AUTO-ROUTING LOGIC
  useEffect(() => {
    if (!enableAutoRouting) return;
    
    // Skip initial load if still loading
    if (isLoading && !initializationRef.current) {
      if (debugMode) {
        console.log('🔄 Auth still loading, waiting for initialization...');
      }
      return;
    }

    // Mark as initialized after first non-loading state
    if (!isLoading && !initializationRef.current) {
      initializationRef.current = true;
      if (debugMode) {
        console.log('✅ Auth navigation initialized');
      }
    }

    const currentRoute = getCurrentRoute();
    const authStateChanged = lastAuthState.current !== isAuthenticated;
    lastAuthState.current = isAuthenticated;

    if (debugMode) {
      console.log('🔍 Auth navigation check:', {
        currentRoute,
        isAuthenticated,
        hasUser: !!user,
        authStateChanged,
        isLoading,
      });
    }

    // 🎯 ROUTING RULES
    if (isAuthenticated && user) {
      // ✅ USER IS AUTHENTICATED
      if (debugMode) {
        console.log('✅ User authenticated - checking redirect rules');
      }
      
      // Redirect from unauthenticated screens to authenticated default
      if (authenticatedRedirects.includes(currentRoute)) {
        if (debugMode) {
          console.log(`🎯 Redirecting authenticated user from ${currentRoute} to ${defaultAuthenticatedRoute}`);
        }
        navigateWithDelay(defaultAuthenticatedRoute);
      }
      
    } else {
      // 🚪 USER NOT AUTHENTICATED
      if (debugMode) {
        console.log('🚪 User not authenticated - checking redirect rules');
      }
      
      // Redirect from authenticated screens to unauthenticated default
      if (unauthenticatedRedirects.includes(currentRoute)) {
        if (debugMode) {
          console.log(`🎯 Redirecting unauthenticated user from ${currentRoute} to ${defaultUnauthenticatedRoute}`);
        }
        navigateWithDelay(defaultUnauthenticatedRoute);
      }
    }
  }, [
    isAuthenticated, 
    user, 
    isLoading, 
    enableAutoRouting,
    getCurrentRoute, 
    navigateWithDelay,
    authenticatedRedirects,
    unauthenticatedRedirects,
    defaultAuthenticatedRoute,
    defaultUnauthenticatedRoute,
    debugMode
  ]);

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    currentRoute: getCurrentRoute(),
    
    // Navigation methods
    navigateWithDelay,
    navigateToLogin,
    navigateToRegister,
    navigateToProfile,
    navigateToLoginSuccess,
    
    // Utilities
    getCurrentRoute,
    isNavigating: isNavigatingRef.current,
  };
};