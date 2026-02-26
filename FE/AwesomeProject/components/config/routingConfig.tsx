// config/routingConfig.js - Centralized routing configuration
export const ROUTE_NAMES = {
  // Profile Stack Routes
  PROTECTED_PROFILE: 'ProtectedProfile',
  LOGIN: 'Login',
  REGISTER: 'Register',
  LOGIN_SUCCESS: 'LoginSuccess',
  PROFILE_MAIN: 'ProfileMain',
  
  // Main Tab Routes
  HOME: 'HomeScreen',
  USADA: 'UsadaScreen',
  PRODUCT: 'ProductScreen',
  CART: 'CartStack',
  PROFILE_TAB: 'ProfileTab',
};

// 🎯 Routing flow configuration
export const ROUTING_FLOWS = {
  // Authentication flow
  AUTHENTICATION: {
    // When user is NOT authenticated
    UNAUTHENTICATED: {
      entryPoint: ROUTE_NAMES.PROTECTED_PROFILE,
      allowedRoutes: [
        ROUTE_NAMES.PROTECTED_PROFILE,
        ROUTE_NAMES.LOGIN,
        ROUTE_NAMES.REGISTER,
      ],
      redirectFrom: [
        ROUTE_NAMES.PROFILE_MAIN,
        ROUTE_NAMES.LOGIN_SUCCESS,
      ],
      redirectTo: ROUTE_NAMES.PROTECTED_PROFILE,
    },
    
    // When user IS authenticated
    AUTHENTICATED: {
      entryPoint: ROUTE_NAMES.PROFILE_MAIN,
      allowedRoutes: [
        ROUTE_NAMES.PROFILE_MAIN,
        ROUTE_NAMES.LOGIN_SUCCESS, // Temporary screen after login
      ],
      redirectFrom: [
        ROUTE_NAMES.PROTECTED_PROFILE,
        ROUTE_NAMES.LOGIN,
        ROUTE_NAMES.REGISTER,
      ],
      redirectTo: ROUTE_NAMES.PROFILE_MAIN,
    },
  },
  
  // Login success flow
  LOGIN_SUCCESS: {
    autoNavigateAfter: 2500, // 2.5 seconds
    navigateTo: ROUTE_NAMES.PROFILE_MAIN,
  },
};

// 🔧 Navigation utilities
export const NavigationUtils = {
  /**
   * Get the appropriate route based on authentication state
   */
  getRouteForAuthState: (isAuthenticated, currentRoute) => {
    const flow = isAuthenticated 
      ? ROUTING_FLOWS.AUTHENTICATION.AUTHENTICATED
      : ROUTING_FLOWS.AUTHENTICATION.UNAUTHENTICATED;
    
    // Check if current route needs redirect
    if (flow.redirectFrom.includes(currentRoute)) {
      return {
        shouldRedirect: true,
        targetRoute: flow.redirectTo,
        reason: isAuthenticated ? 'user_authenticated' : 'user_not_authenticated',
      };
    }
    
    return {
      shouldRedirect: false,
      targetRoute: currentRoute,
      reason: 'route_allowed',
    };
  },

  /**
   * Check if a route is allowed for current auth state
   */
  isRouteAllowed: (isAuthenticated, routeName) => {
    const flow = isAuthenticated 
      ? ROUTING_FLOWS.AUTHENTICATION.AUTHENTICATED
      : ROUTING_FLOWS.AUTHENTICATION.UNAUTHENTICATED;
    
    return flow.allowedRoutes.includes(routeName);
  },

  /**
   * Get initial route based on auth state
   */
  getInitialRoute: (isAuthenticated, isLoading) => {
    if (isLoading) {
      return ROUTE_NAMES.PROTECTED_PROFILE;
    }
    
    return isAuthenticated 
      ? ROUTING_FLOWS.AUTHENTICATION.AUTHENTICATED.entryPoint
      : ROUTING_FLOWS.AUTHENTICATION.UNAUTHENTICATED.entryPoint;
  },

  /**
   * Get user-friendly route descriptions
   */
  getRouteDescription: (routeName) => {
    const descriptions = {
      [ROUTE_NAMES.PROTECTED_PROFILE]: 'Protected Profile (Login Required)',
      [ROUTE_NAMES.LOGIN]: 'Login Screen',
      [ROUTE_NAMES.REGISTER]: 'Registration Screen',
      [ROUTE_NAMES.LOGIN_SUCCESS]: 'Login Success Screen',
      [ROUTE_NAMES.PROFILE_MAIN]: 'User Profile Screen',
    };
    
    return descriptions[routeName] || routeName;
  },
};

// 🎯 Routing flow manager
export class RoutingFlowManager {
  constructor(navigation, authContext) {
    this.navigation = navigation;
    this.authContext = authContext;
    this.isNavigating = false;
    this.debugMode = __DEV__; // Enable debug in development
  }

  /**
   * Log routing activity
   */
  log(message, data = {}) {
    if (this.debugMode) {
      console.log(`🔄 RoutingFlow: ${message}`, data);
    }
  }

  /**
   * Get current route name
   */
  getCurrentRoute() {
    try {
      const state = this.navigation.getState();
      return state?.routes[state?.index]?.name || null;
    } catch (error) {
      this.log('Error getting current route', { error });
      return null;
    }
  }

  /**
   * Navigate with delay and safety checks
   */
  async navigateWithDelay(targetRoute, delay = 150) {
    if (this.isNavigating) {
      this.log('Navigation already in progress, skipping');
      return false;
    }

    this.isNavigating = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          this.log('Navigating to route', { targetRoute });
          this.navigation.navigate(targetRoute);
          resolve(true);
        } catch (error) {
          this.log('Navigation error', { error, targetRoute });
          resolve(false);
        } finally {
          this.isNavigating = false;
        }
      }, delay);
    });
  }

  /**
   * Check and handle automatic routing
   */
  handleAutoRouting() {
    const { isAuthenticated, isLoading, user } = this.authContext;
    
    if (isLoading) {
      this.log('Auth loading, skipping auto-routing');
      return;
    }

    const currentRoute = this.getCurrentRoute();
    const routingDecision = NavigationUtils.getRouteForAuthState(isAuthenticated, currentRoute);

    this.log('Auto-routing check', {
      currentRoute,
      isAuthenticated,
      hasUser: !!user,
      decision: routingDecision,
    });

    if (routingDecision.shouldRedirect) {
      this.log('Executing auto-redirect', {
        from: currentRoute,
        to: routingDecision.targetRoute,
        reason: routingDecision.reason,
      });
      
      this.navigateWithDelay(routingDecision.targetRoute);
    }
  }

  /**
   * Handle login success flow
   */
  handleLoginSuccess() {
    const { autoNavigateAfter, navigateTo } = ROUTING_FLOWS.LOGIN_SUCCESS;
    
    this.log('Handling login success flow', {
      autoNavigateAfter,
      navigateTo,
    });

    setTimeout(() => {
      this.navigateWithDelay(navigateTo);
    }, autoNavigateAfter);
  }

  /**
   * Manual navigation methods
   */
  goToLogin() {
    return this.navigateWithDelay(ROUTE_NAMES.LOGIN);
  }

  goToRegister() {
    return this.navigateWithDelay(ROUTE_NAMES.REGISTER);
  }

  goToProfile() {
    const { isAuthenticated } = this.authContext;
    const targetRoute = isAuthenticated 
      ? ROUTE_NAMES.PROFILE_MAIN 
      : ROUTE_NAMES.PROTECTED_PROFILE;
    
    return this.navigateWithDelay(targetRoute);
  }

  goToLoginSuccess() {
    return this.navigateWithDelay(ROUTE_NAMES.LOGIN_SUCCESS);
  }
}

// Export default configuration
export default {
  ROUTE_NAMES,
  ROUTING_FLOWS,
  NavigationUtils,
  RoutingFlowManager,
};