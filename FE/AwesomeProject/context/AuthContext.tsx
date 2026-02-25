// src/context/AuthContext.tsx - FIXED: Quick Logout with Instant State Update
import React, { 
  createContext, 
  useState, 
  useEffect, 
  useContext, 
  ReactNode, 
  useCallback, 
  useMemo, 
  useRef 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define types for user and auth context
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoginSuccess: boolean;
  login: (email: string, password: string, navigation?: any) => Promise<void>;
  register: (name: string, email: string, password: string, navigation?: any) => Promise<void>;
  logout: (navigation?: any) => void;
  updateProfile: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  // Navigation helpers
  navigateToLoginSuccess: () => void;
  resetLoginSuccess: () => void;
  // Navigation listeners
  addAuthChangeListener: (listener: (isAuth: boolean) => void) => number;
  removeAuthChangeListener: (id: number) => void;
};

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  USER: `${API_BASE_URL}/api/user`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
};

// Storage keys
const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  LAST_LOGIN: 'last_login',
};

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  
  // Track if component is mounted and initial load complete
  const isMounted = useRef(true);
  const initialLoadComplete = useRef<boolean>(false);
  
  // Auth change listeners
  const authChangeListeners = useRef<{ [id: number]: (isAuth: boolean) => void }>({});
  const nextListenerId = useRef<number>(1);

  // Add/remove auth change listeners
  const addAuthChangeListener = useCallback((listener: (isAuth: boolean) => void): number => {
    const id = nextListenerId.current++;
    authChangeListeners.current[id] = listener;
    return id;
  }, []);

  const removeAuthChangeListener = useCallback((id: number): void => {
    delete authChangeListeners.current[id];
  }, []);

  // Notify all listeners about auth changes
  const notifyAuthChange = useCallback((isAuthenticated: boolean) => {
    console.log('🔔 Notifying auth listeners:', { isAuthenticated, listenerCount: Object.keys(authChangeListeners.current).length });
    Object.values(authChangeListeners.current).forEach(listener => {
      try {
        listener(isAuthenticated);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }, []);
  
  // 🔥 CRITICAL FIX: Computed authentication state
  const isAuthenticated = useMemo(() => {
    const authenticated = !!(user && token);
    return authenticated;
  }, [user, token]);

  // Watch for auth changes and notify listeners
  useEffect(() => {
    if (initialLoadComplete.current) {
      console.log('🔄 Auth state changed:', { isAuthenticated, userEmail: user?.email || 'none' });
      notifyAuthChange(isAuthenticated);
    }
  }, [isAuthenticated, user, notifyAuthChange]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Navigation helpers
  const navigateToLoginSuccess = useCallback(() => {
    setShowLoginSuccess(true);
    setTimeout(() => {
      setShowLoginSuccess(false);
    }, 3000);
  }, []);

  const resetLoginSuccess = useCallback(() => {
    setShowLoginSuccess(false);
  }, []);

  // Storage operations
  const clearStoredData = useCallback(async () => {
    console.log('🔄 STORAGE: Starting background clear...');
    
    const keysToRemove = [
      STORAGE_KEYS.USER,
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.LAST_LOGIN,
      '@auth_user', '@auth_token', '@user', '@token',
    ];
    
    try {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('✅ STORAGE: Background clear completed');
    } catch (error) {
      console.warn('⚠️ STORAGE: Background clear failed, trying individual removal');
      keysToRemove.forEach(key => {
        AsyncStorage.removeItem(key).catch(() => {});
      });
    }
  }, []);

  const saveUserData = useCallback(async (userData: User, authToken: string) => {
    try {
      if (!initialLoadComplete.current) return;
      
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authToken),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, timestamp)
      ]);
      console.log('✅ User data saved to storage');
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
    }
  }, []);

  // Load auth data from storage
  const loadAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading auth from storage...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Storage timeout')), 3000)
      );
      
      const [userJson, tokenData, lastLogin] = await Promise.race([
        Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN)
        ]),
        timeoutPromise
      ]) as [string | null, string | null, string | null];
      
      if (!isMounted.current) return;
      
      if (userJson && tokenData) {
        try {
          const userData = JSON.parse(userJson);
          
          if (userData && typeof userData === 'object' && userData.id && userData.email) {
            setUser(userData);
            setToken(tokenData);
            console.log('✅ Auth restored from storage for:', userData.email);
          } else {
            console.warn('Invalid user data structure, clearing storage');
            await clearStoredData();
            setUser(null);
            setToken(null);
          }
        } catch (parseError) {
          console.error('❌ Failed to parse stored user data:', parseError);
          await clearStoredData();
          setUser(null);
          setToken(null);
        }
      } else {
        console.log('ℹ️ No stored auth data found');
        setUser(null);
        setToken(null);
      }
      
      initialLoadComplete.current = true;
    } catch (error) {
      console.error('❌ Failed to load auth from storage:', error);
      setUser(null);
      setToken(null);
      initialLoadComplete.current = true;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [clearStoredData]);

  // Initial load
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  // Check auth status / refresh auth
  const checkAuthStatus = useCallback(async () => {
    await loadAuth();
  }, [loadAuth]);

  const refreshAuth = useCallback(async () => {
    await loadAuth();
  }, [loadAuth]);

  // 🚀 LOGIN with automatic navigation to LoginSuccessScreen
  const login = useCallback(async (email: string, password: string, navigation?: any) => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting login for:', email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Login failed';
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(', ');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `Login failed with status ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Invalid response format');
      }

      const { user: userData, token: authToken } = data.data;

      if (!userData || !authToken) {
        throw new Error('Invalid authentication data received');
      }

      // 🚀 IMMEDIATE STATE UPDATE
      if (isMounted.current) {
        setUser(userData);
        setToken(authToken);
        console.log('✅ Login state updated - UI updating immediately');
      }
      
      // Save to storage in background
      saveUserData(userData, authToken);
      
      // 🎯 AUTOMATIC NAVIGATION TO LOGIN SUCCESS SCREEN
      if (navigation) {
        console.log('🎯 Navigating to LoginSuccess screen');
        setTimeout(() => {
          navigation.navigate('LoginSucces');
        }, 100);
      }
      
      console.log('✅ Login successful for:', userData.email);
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Login timeout. Please check your internet connection.');
      }
      
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [saveUserData]);

  // 🚀 REGISTER with automatic navigation
  const register = useCallback(async (name: string, email: string, password: string, navigation?: any) => {
    setIsLoading(true);
    
    try {
      console.log('📝 Attempting registration for:', email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Registration failed';
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(', ');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `Registration failed with status ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success and navigate to login
      Alert.alert(
        'Registrasi Berhasil', 
        'Akun berhasil dibuat! Silakan login.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.navigate('Login');
              }
            }
          }
        ]
      );
      
      console.log('✅ Registration successful for:', email);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Registration timeout. Please check your internet connection.');
      }
      
      throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // 🔥 CRITICAL FIX: INSTANT LOGOUT - Synchronous state clear
  const logout = useCallback((navigation?: any) => {
    const startTime = performance.now();
    console.log('🚪 ⚡ INSTANT LOGOUT: Starting immediate logout');
    
    // 🔥 CRITICAL: Clear state IMMEDIATELY and SYNCHRONOUSLY
    setUser(null);
    setToken(null);
    
    console.log('✅ ⚡ INSTANT LOGOUT: Auth state cleared - UI will update NOW');
    
    // 🔥 FORCE immediate re-render by clearing storage synchronously if possible
    try {
      // Try synchronous clear first (some platforms support this)
      const keysToRemove = [
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.LAST_LOGIN,
      ];
      
      // Background async clear
      clearStoredData();
      
    } catch (error) {
      console.warn('Sync storage clear failed, using async');
      clearStoredData();
    }
    
    // 🎯 DON'T NAVIGATE - Let ProfileStackNavigator handle it automatically
    // The auth state change will trigger navigation in ProfileStackNavigator
    
    // Show logout message
    setTimeout(() => {
      Alert.alert('Logout Berhasil', 'Anda telah keluar dari akun.');
    }, 100);
    
    const endTime = performance.now();
    console.log(`🚀 ⚡ INSTANT LOGOUT: Complete in ${(endTime - startTime).toFixed(2)}ms`);
  }, [clearStoredData]);

  // Update profile function
  const updateProfile = useCallback((userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      
      setUser(updatedUser);
      
      if (token) {
        saveUserData(updatedUser, token);
      }
      
      console.log('✅ Profile updated immediately');
      Alert.alert('Profil Diperbarui', 'Perubahan profil berhasil disimpan.');
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profil. Silakan coba lagi.');
    }
  }, [user, token, saveUserData]);

  // Context value
  const contextValue: AuthContextType = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    showLoginSuccess,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    refreshAuth,
    navigateToLoginSuccess,
    resetLoginSuccess,
    addAuthChangeListener,
    removeAuthChangeListener,
  }), [
    user, 
    token, 
    isLoading, 
    isAuthenticated,
    showLoginSuccess,
    login, 
    register, 
    logout, 
    updateProfile, 
    checkAuthStatus,
    refreshAuth,
    navigateToLoginSuccess,
    resetLoginSuccess,
    addAuthChangeListener, 
    removeAuthChangeListener
  ]);

  // Debug logging
  useEffect(() => {
    if (initialLoadComplete.current) {
      console.log('🔄 Auth Context State Change:', {
        hasUser: !!user,
        hasToken: !!token,
        isAuthenticated,
        isLoading,
        showLoginSuccess,
        userEmail: user?.email || 'none',
        timestamp: new Date().toISOString()
      });
    }
  }, [user, token, isAuthenticated, isLoading, showLoginSuccess]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};