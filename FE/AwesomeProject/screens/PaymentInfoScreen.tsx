// PaymentInfoScreen.js - Updated with WebView for Xendit payments
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ImageBackground,
  ActivityIndicator,
  AppState,
  BackHandler,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { useOrder } from '@/context/OrderContext';
import withProviders from '@/utils/withProviders';

const { width, height } = Dimensions.get('window');

const PaymentInfoScreen = ({ navigation, route }) => {
  const { orderId, invoice_url, amount, orderData } = route.params || {};
  const { 
    checkOrderStatus, 
    cancelOrder, 
    getOrderDetails,
    loading, 
    error,
    currentOrder 
  } = useOrder();
  
  const webViewRef = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [lastStatusCheck, setLastStatusCheck] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Clear status check interval
  const clearStatusCheck = useCallback(() => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
      console.log('🔄 Status check interval cleared');
    }
  }, [statusCheckInterval]);

  // Start status polling
  const startStatusPolling = useCallback(() => {
    clearStatusCheck();
    
    console.log('🔄 Starting status polling...');
    
    // Check immediately
    checkPaymentStatus();
    
    // Then check every 15 seconds (less frequent since user is actively paying)
    const interval = setInterval(() => {
      console.log('⏰ Automatic status check...');
      if (paymentStatus === 'processing' || paymentStatus === 'pending') {
        checkPaymentStatus();
      } else {
        clearStatusCheck();
      }
    }, 15000);
    
    setStatusCheckInterval(interval);
  }, [paymentStatus, clearStatusCheck]);

  // Check payment status function
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId || isCheckingStatus) {
      console.log('⚠️ Skipping status check:', { orderId, isCheckingStatus });
      return;
    }

    try {
      setIsCheckingStatus(true);
      setLastStatusCheck(new Date().toLocaleTimeString());
      console.log('🔍 Starting payment status check for order:', orderId);

      const result = await checkOrderStatus(orderId);
      
      console.log('📊 Full status check result:', JSON.stringify(result, null, 2));
      
      if (!result) {
        console.error('❌ No result from checkOrderStatus');
        return;
      }

      if (!result.success) {
        console.error('❌ Status check failed:', result.message || 'Unknown error');
        
        if (result.message?.includes('Authentication') || result.message?.includes('login')) {
          Alert.alert(
            'Session Expired',
            'Please login again to check your payment status.',
            [
              { 
                text: 'Login', 
                onPress: () => navigation.navigate('Login')
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
        return;
      }

      if (!result.data) {
        console.error('❌ No data in successful result:', result);
        return;
      }

      const order = result.data;
      const status = order.status?.toLowerCase() || 'unknown';
      
      console.log('📊 Current order status:', status);

      // Update payment status based on order status
      switch (status) {
        case 'paid':
        case 'completed':
        case 'success':
          console.log('✅ Payment successful, navigating to success screen');
          setPaymentStatus('success');
          clearStatusCheck();
          
          // Navigate to success screen after short delay
          setTimeout(() => {
            navigation.replace('OrderSuccess', {
              orderId: orderId,
              orderData: orderData || order,
              paymentSuccess: true,
              message: 'Payment completed successfully!'
            });
          }, 2000);
          break;

        case 'failed':
        case 'cancelled':
        case 'expired':
          console.log('❌ Payment failed with status:', status);
          setPaymentStatus('failed');
          setShowWebView(false);
          clearStatusCheck();
          break;

        case 'pending':
        case 'waiting_payment':
        case 'unpaid':
          console.log('⏳ Payment still pending');
          if (paymentStatus !== 'pending' && paymentStatus !== 'processing') {
            setPaymentStatus('pending');
          }
          break;

        default:
          console.log('❓ Unknown payment status:', status);
          break;
      }

    } catch (error) {
      console.error('❌ Error in checkPaymentStatus:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [orderId, isCheckingStatus, paymentStatus, checkOrderStatus, navigation, orderData, clearStatusCheck]);

  // Open payment in WebView
  const openPaymentWebView = useCallback(() => {
    if (!invoice_url) {
      Alert.alert('Error', 'Payment URL not available. Please try again.');
      return;
    }
    
    console.log('🌐 Opening payment in WebView:', invoice_url);
    setShowWebView(true);
    setPaymentStatus('processing');
    setWebViewError(false);
    setWebViewLoading(true);
    
    // Start periodic status checking
    startStatusPolling();
  }, [invoice_url, startStatusPolling]);

  // Handle WebView navigation
  const handleWebViewNavigationStateChange = useCallback((navState) => {
    const { url, loading } = navState;
    setCurrentUrl(url);
    setWebViewLoading(loading);

    console.log('🌐 WebView navigation:', url);

    // Check for success/failure URLs from Xendit
    if (url) {
      // Common Xendit success patterns
      if (url.includes('success') || 
          url.includes('completed') || 
          url.includes('paid') ||
          url.includes('status=success') ||
          url.includes('payment_status=success')) {
        console.log('✅ Detected success URL pattern');
        setTimeout(() => {
          checkPaymentStatus();
        }, 2000);
      }
      
      // Common Xendit failure patterns
      else if (url.includes('failed') || 
               url.includes('cancelled') || 
               url.includes('expired') ||
               url.includes('status=failed') ||
               url.includes('payment_status=failed')) {
        console.log('❌ Detected failure URL pattern');
        setPaymentStatus('failed');
        setShowWebView(false);
        clearStatusCheck();
      }
    }
  }, [checkPaymentStatus, clearStatusCheck]);

  // Handle WebView errors
  const handleWebViewError = useCallback((syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('❌ WebView error:', nativeEvent);
    setWebViewError(true);
    setWebViewLoading(false);
  }, []);

  // Handle WebView load end
  const handleWebViewLoadEnd = useCallback(() => {
    setWebViewLoading(false);
    console.log('✅ WebView finished loading');
  }, []);

  // Retry payment function
  const handleRetryPayment = useCallback(() => {
    Alert.alert(
      'Retry Payment',
      'This will reload the payment page. Make sure to complete the payment.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Retry', 
          onPress: () => {
            setPaymentStatus('pending');
            setWebViewError(false);
            if (showWebView && webViewRef.current) {
              webViewRef.current.reload();
            } else {
              openPaymentWebView();
            }
          }
        }
      ]
    );
  }, [showWebView, openPaymentWebView]);

  // Handle cancel payment
  const handleCancelPayment = useCallback(() => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'Keep Order', style: 'cancel' },
        { 
          text: 'Cancel Order', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚫 Cancelling order:', orderId);
              const result = await cancelOrder(orderId);
              
              if (result.success) {
                clearStatusCheck();
                setShowWebView(false);
                Alert.alert(
                  'Order Cancelled',
                  'Your order has been cancelled successfully.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Orders')
                    }
                  ]
                );
              } else {
                Alert.alert('Error', result.message || 'Failed to cancel order');
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          }
        }
      ]
    );
  }, [orderId, cancelOrder, navigation, clearStatusCheck]);

  // Handle view order details
  const handleViewOrderDetails = useCallback(() => {
    navigation.navigate('Orders', {
      highlightOrderId: orderId,
      message: 'Here are your order details'
    });
  }, [navigation, orderId]);

  // Handle manual status check
  const handleManualStatusCheck = useCallback(async () => {
    if (isCheckingStatus) return;
    await checkPaymentStatus();
  }, [checkPaymentStatus, isCheckingStatus]);

  // Close WebView
  const closeWebView = useCallback(() => {
    Alert.alert(
      'Close Payment',
      'Are you sure you want to close the payment page? Your payment may not be completed.',
      [
        { text: 'Stay', style: 'cancel' },
        { 
          text: 'Close', 
          onPress: () => {
            setShowWebView(false);
            setPaymentStatus('pending');
          }
        }
      ]
    );
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && (paymentStatus === 'processing' || paymentStatus === 'pending')) {
        console.log('🔄 App became active, checking payment status...');
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [paymentStatus, checkPaymentStatus]);

  // Handle back button (Android)
  useEffect(() => {
    const backAction = () => {
      if (showWebView) {
        closeWebView();
        return true;
      }
      
      if (paymentStatus === 'processing') {
        Alert.alert(
          'Payment in Progress',
          'Your payment is being processed. Are you sure you want to go back?',
          [
            { text: 'Stay', style: 'cancel' },
            { 
              text: 'Go Back', 
              onPress: () => {
                clearStatusCheck();
                navigation.goBack();
              }
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [paymentStatus, showWebView, clearStatusCheck, navigation, closeWebView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearStatusCheck();
    };
  }, [clearStatusCheck]);

  // Render WebView for payment
  if (showWebView && invoice_url) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />

        {/* WebView Header */}
        <View style={styles.webViewHeader}>
          <TouchableOpacity 
            style={styles.webViewBackButton} 
            onPress={closeWebView}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.webViewHeaderContent}>
            <Text style={styles.webViewHeaderTitle}>Complete Payment</Text>
            <Text style={styles.webViewHeaderSubtitle}>Order #{orderId}</Text>
          </View>

          <TouchableOpacity 
            style={styles.webViewRefreshButton}
            onPress={() => webViewRef.current?.reload()}
            disabled={webViewLoading}
          >
            <Feather 
              name="refresh-cw" 
              size={20} 
              color={webViewLoading ? "rgba(255,255,255,0.5)" : "white"} 
            />
          </TouchableOpacity>
        </View>

        {/* Loading indicator */}
        {webViewLoading && (
          <View style={styles.webViewLoadingContainer}>
            <ActivityIndicator size="small" color="#4F7942" />
            <Text style={styles.webViewLoadingText}>Loading payment page...</Text>
          </View>
        )}

        {/* WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: invoice_url }}
          style={styles.webView}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={handleWebViewError}
          onLoadEnd={handleWebViewLoadEnd}
          onLoadStart={() => setWebViewLoading(true)}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsBackForwardNavigationGestures={true}
          renderError={() => (
            <View style={styles.webViewErrorContainer}>
              <Feather name="wifi-off" size={48} color="#FF6B6B" />
              <Text style={styles.webViewErrorTitle}>Connection Error</Text>
              <Text style={styles.webViewErrorText}>
                Unable to load payment page. Please check your connection.
              </Text>
              <TouchableOpacity 
                style={styles.webViewRetryButton}
                onPress={() => webViewRef.current?.reload()}
              >
                <Text style={styles.webViewRetryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Status check indicator */}
        {isCheckingStatus && (
          <View style={styles.statusCheckIndicator}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.statusCheckText}>Checking payment status...</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Render main payment info screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />

      {/* Header */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId}</Text>
        </View>

        {(isCheckingStatus || loading) && (
          <ActivityIndicator size="small" color="white" />
        )}
      </ImageBackground>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order ID</Text>
            <Text style={styles.summaryValue}>#{orderId}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>{formatPrice(amount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <Text style={[
              styles.summaryValue,
              paymentStatus === 'success' && styles.successText,
              paymentStatus === 'failed' && styles.errorText,
              paymentStatus === 'processing' && styles.processingText
            ]}>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </Text>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color="#FF6B6B" />
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {/* Payment Status Content */}
        <View style={styles.statusContainer}>
          {paymentStatus === 'success' ? (
            <>
              <View style={styles.successIcon}>
                <Feather name="check-circle" size={64} color="#4F7942" />
              </View>
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.statusDescription}>
                Your payment has been confirmed. Redirecting to order confirmation...
              </Text>
              <ActivityIndicator size="small" color="#4F7942" style={{ marginTop: 16 }} />
            </>
          ) : paymentStatus === 'failed' ? (
            <>
              <View style={styles.errorIcon}>
                <Feather name="x-circle" size={64} color="#FF6B6B" />
              </View>
              <Text style={styles.errorTitle}>Payment Failed</Text>
              <Text style={styles.statusDescription}>
                Your payment could not be processed. Please try again or contact support.
              </Text>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleRetryPayment}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleCancelPayment}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>
                  {loading ? 'Cancelling...' : 'Cancel Order'}
                </Text>
              </TouchableOpacity>
            </>
          ) : paymentStatus === 'processing' ? (
            <>
              <ActivityIndicator size="large" color="#4F7942" />
              <Text style={styles.statusTitle}>Processing Payment</Text>
              <Text style={styles.statusDescription}>
                Your payment is being processed. Please wait while we confirm your payment.
              </Text>
              
              {lastStatusCheck && (
                <Text style={styles.lastCheckText}>
                  Last checked: {lastStatusCheck}
                </Text>
              )}
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleManualStatusCheck}
                disabled={isCheckingStatus}
              >
                <Text style={styles.secondaryButtonText}>
                  {isCheckingStatus ? 'Checking...' : 'Check Status Now'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.paymentIcon}>
                <Feather name="credit-card" size={64} color="#4F7942" />
              </View>
              <Text style={styles.statusTitle}>Complete Your Payment</Text>
              <Text style={styles.statusDescription}>
                Click the button below to open the secure payment page and complete your transaction.
              </Text>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={openPaymentWebView}
                disabled={!invoice_url}
              >
                <Feather name="credit-card" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>
                  {!invoice_url ? 'Payment URL Loading...' : 'Pay Now'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleManualStatusCheck}
                disabled={isCheckingStatus}
              >
                <Text style={styles.secondaryButtonText}>
                  {isCheckingStatus ? 'Checking...' : 'Check Payment Status'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={styles.tertiaryButton}
            onPress={handleViewOrderDetails}
          >
            <Feather name="file-text" size={16} color="#4F7942" />
            <Text style={styles.tertiaryButtonText}>View Order Details</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you're experiencing issues with payment, please contact our support team.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Feather name="message-circle" size={16} color="#4F7942" />
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#86A789',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E5233',
  },
  successText: {
    color: '#4F7942',
  },
  errorText: {
    color: '#FF6B6B',
  },
  processingText: {
    color: '#FF9800',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorMessage: {
    color: '#FF6B6B',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentIcon: {
    marginBottom: 16,
  },
  successIcon: {
    marginBottom: 16,
  },
  errorIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 8,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F7942',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  lastCheckText: {
    fontSize: 12,
    color: '#86A789',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: '#4F7942',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F7942',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4F7942',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    minWidth: 180,
  },
  tertiaryButtonText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  helpSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#86A789',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  helpButtonText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // WebView styles
 // WebView styles (lanjutan dari webViewHeaderContent)
  webViewHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  webViewHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  webViewHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  webViewRefreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FDF8',
  },
  webViewLoadingText: {
    fontSize: 14,
    color: '#86A789',
    marginLeft: 8,
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  webViewErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
    padding: 32,
  },
  webViewErrorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  webViewErrorText: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  webViewRetryButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  webViewRetryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusCheckIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(79, 121, 66, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statusCheckText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
export default withProviders(PaymentInfoScreen);