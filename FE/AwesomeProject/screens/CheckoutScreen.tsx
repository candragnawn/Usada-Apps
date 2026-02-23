import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import withProviders from '@/utils/withProviders';

const CheckoutScreen = ({ navigation, route }) => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { 
    shippingInfo, 
    updateShippingInfo, 
    createOrder, 
    generatePaymentInvoice,
    loading, 
    error, 
    clearError 
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const shippingFee = 10000;
  const taxAmount = Math.round(totalAmount * 0.1);
  const grandTotal = totalAmount + shippingFee + taxAmount;
  const itemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const fullName = `${shippingInfo.first_name || ''} ${shippingInfo.last_name || ''}`.trim();

  const paymentMethods = [
    { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { key: 'EWALLET', label: 'E-Wallet (OVO, DANA, dll)' },
    { key: 'CREDIT_CARD', label: 'Kartu Kredit/Debit' },
  ];

  useEffect(() => {
    clearError();
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty. Please add items before checkout.',
        [{ text: 'Go Back', onPress: () => navigation.goBack() }]
      );
    }
  }, [cartItems, navigation]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field, value) => {
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }

    if (field === 'name') {
      const nameParts = value.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      updateShippingInfo({
        first_name: firstName,
        last_name: lastName
      });
    } else {
      const fieldMapping = {
        phone: 'phone',
        email: 'email',
        address: 'address',
        city: 'city',
        postalCode: 'postal_code',
        country: 'country',
        addressDescription: 'address_description'
      };

      const mappedField = fieldMapping[field];
      if (mappedField) {
        updateShippingInfo({ [mappedField]: value });
      }
    }
  };

  const handlePaymentMethodSelect = (methodKey) => {
    setSelectedPaymentMethod(methodKey);
    // Clear error if any
    setFormErrors(prev => ({ ...prev, paymentMethod: null }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!shippingInfo.first_name?.trim()) {
      errors.name = 'Please enter your full name';
    }
    
    if (!shippingInfo.phone?.trim()) {
      errors.phone = 'Please enter your phone number';
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid Indonesian phone number';
    }
    
    if (!shippingInfo.email?.trim()) {
      errors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!shippingInfo.address?.trim()) {
      errors.address = 'Please enter your address';
    }
    
    if (!shippingInfo.city?.trim()) {
      errors.city = 'Please enter your city';
    }
    
    if (!shippingInfo.postal_code?.trim()) {
      errors.postalCode = 'Please enter your postal code';
    } else if (!/^[0-9]{5}$/.test(shippingInfo.postal_code)) {
      errors.postalCode = 'Please enter a valid 5-digit postal code';
    }
    
    if (!shippingInfo.country?.trim()) {
      errors.country = 'Please enter your country';
    }

    if (!cartItems || cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return false;
    }

    if (totalAmount <= 0) {
      Alert.alert('Error', 'Invalid cart total');
      return false;
    }

    if (grandTotal <= 0) {
      Alert.alert('Error', 'Invalid order total');
      return false;
    }

    if (!selectedPaymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const extractItemPrice = (item) => {
    const priceFields = [
      'price',           
      'product_price',   
      'unit_price',
      'unitPrice',
      'selling_price',
      'final_price',
      'cost',
      'amount'
    ];

    for (const field of priceFields) {
      if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
        const price = parseFloat(item[field]);
        if (!isNaN(price) && price > 0) {
          return price;
        }
      }
    }

    if (item.product) {
      for (const field of priceFields) {
        if (item.product[field] !== undefined && item.product[field] !== null) {
          const price = parseFloat(item.product[field]);
          if (!isNaN(price) && price > 0) {
            return price;
          }
        }
      }
    }

    if (item.variant) {
      for (const field of priceFields) {
        if (item.variant[field] !== undefined && item.variant[field] !== null) {
          const price = parseFloat(item.variant[field]);
          if (!isNaN(price) && price > 0) {
            return price;
          }
        }
      }
    }

    return 0;
  };

  const extractVariantId = (item) => {
    const variantFields = [
      'product_variant_id',
      'variant_id', 
      'productVariantId',
      'id'
    ];
    
    for (const field of variantFields) {
      if (item[field]) {
        const id = parseInt(item[field]);
        if (!isNaN(id) && id > 0) {
          return id;
        }
      }
    }

    if (item.variant && item.variant.id) {
      const id = parseInt(item.variant.id);
      if (!isNaN(id) && id > 0) {
        return id;
      }
    }

    if (item.product && item.product.variant_id) {
      const id = parseInt(item.product.variant_id);
      if (!isNaN(id) && id > 0) {
        return id;
      }
    }

    return null;
  };

  const prepareOrderData = () => {
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const products = [];
    let calculatedSubtotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      
      const variantId = extractVariantId(item);
      if (!variantId) {
        throw new Error(`Missing product variant ID for: ${item.name || 'Unknown Product'}`);
      }

      const itemPrice = extractItemPrice(item);
      if (!itemPrice || itemPrice <= 0) {
        throw new Error(`Missing or invalid price for: ${item.name || 'Unknown Product'}`);
      }

      const quantity = parseInt(item.quantity);
      if (!quantity || quantity < 1 || quantity > 1000) {
        throw new Error(`Invalid quantity for: ${item.name || 'Unknown Product'} (must be 1-1000)`);
      }

      const productData = {
        product_variant_id: variantId,
        quantity: quantity,
        price: itemPrice
      };

      products.push(productData);
      calculatedSubtotal += (itemPrice * quantity);
    }

    const finalTax = Math.round(calculatedSubtotal * 0.1);
    const finalTotal = calculatedSubtotal + shippingFee + finalTax;

    const orderData = {
      phone: shippingInfo.phone?.trim(),
      first_name: shippingInfo.first_name?.trim(),
      email: shippingInfo.email?.trim(),
      address: shippingInfo.address?.trim(),
      city: shippingInfo.city?.trim(),
      postal_code: shippingInfo.postal_code?.trim(),
      country: shippingInfo.country?.trim(),
      price: finalTotal,
      products: products,
      last_name: shippingInfo.last_name?.trim() || '',
      address_description: shippingInfo.address_description?.trim() || '',
      payment_channel: selectedPaymentMethod,
      payment_method: selectedPaymentMethod,
    };

    const requiredFields = [
      { field: 'phone', maxLength: 20 },
      { field: 'first_name', maxLength: 100 },
      { field: 'email', maxLength: 255 },
      { field: 'address', maxLength: 500 },
      { field: 'city', maxLength: 100 },
      { field: 'postal_code', maxLength: 10 },
      { field: 'country', maxLength: 100 },
      { field: 'price', minValue: 0.01 }
    ];

    for (const { field, maxLength, minValue } of requiredFields) {
      const value = orderData[field];
      
      if (!value) {
        throw new Error(`Missing required field: ${field}`);
      }
      
      if (maxLength && typeof value === 'string' && value.length > maxLength) {
        throw new Error(`Field ${field} exceeds maximum length of ${maxLength} characters`);
      }
      
      if (minValue && typeof value === 'number' && value < minValue) {
        throw new Error(`Field ${field} must be at least ${minValue}`);
      }
    }

    if (orderData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
      throw new Error('Invalid email format');
    }

    if (!orderData.products || orderData.products.length === 0) {
      throw new Error('No products in order (required|array|min:1)');
    }

    orderData.products.forEach((product, index) => {
      if (!product.product_variant_id || !Number.isInteger(product.product_variant_id)) {
        throw new Error(`Product ${index + 1}: product_variant_id must be an integer`);
      }
      
      if (!product.quantity || !Number.isInteger(product.quantity) || product.quantity < 1 || product.quantity > 1000) {
        throw new Error(`Product ${index + 1}: quantity must be integer between 1-1000`);
      }
      
      if (!product.price || typeof product.price !== 'number' || product.price < 0.01) {
        throw new Error(`Product ${index + 1}: price must be numeric and at least 0.01`);
      }
    });
    
    return orderData;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Form Error', 'Please fix the errors below and try again');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = prepareOrderData();
      const result = await createOrder(orderData);

      if (result?.success && result?.data?.id) {
        const paymentResult = await generatePaymentInvoice(result.data.id);

        if (paymentResult?.success && paymentResult?.invoice_url) {
          clearCart();
          
          navigation.navigate('PaymentInfo', {
            orderId: result.data.id,
            invoice_url: paymentResult.invoice_url,
            amount: grandTotal,
            orderData: {
              id: result.data.id,
              items: cartItems,
              shipping: shippingInfo,
              totals: {
                subtotal: totalAmount,
                shipping: shippingFee,
                tax: taxAmount,
                total: grandTotal
              }
            }
          });
        } else {
          throw new Error(paymentResult?.message || 'Failed to generate payment invoice');
        }
      } else {
        if (result?.errors) {
          const errorMessages = Object.values(result.errors).flat();
          Alert.alert('Validation Error', errorMessages.join('\n'));
        } else {
          const errorMessage = result?.message || 'Failed to create order';
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to process order. Please try again.';
      Alert.alert('Order Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Feather name="shopping-cart" size={64} color="#C8E6C9" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.backToShopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backToShopText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />

      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={isSubmitting || loading}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {(isSubmitting || loading) && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </ImageBackground>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.orderSummary}>
              {cartItems.map((item, index) => {
                const itemPrice = extractItemPrice(item);
                
                return (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>
                      {item.name || item.product?.name || 'Unknown Product'}
                    </Text>
                    <Text style={styles.itemDetails}>
                      Qty: {item.quantity} × {formatPrice(itemPrice)}
                    </Text>
                    <Text style={styles.itemSubtotal}>
                      {formatPrice(itemPrice * item.quantity)}
                    </Text>
                  </View>
                );
              })}
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Subtotal ({cartItems.length} items)</Text>
                <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Shipping Fee</Text>
                <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Tax (10%)</Text>
                <Text style={styles.summaryValue}>{formatPrice(taxAmount)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.name && styles.inputError
                ]}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
                editable={!isSubmitting && !loading}
              />
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.phone && styles.inputError
                ]}
                placeholder="08XXXXXXXXXX"
                keyboardType="phone-pad"
                value={shippingInfo.phone || ''}
                onChangeText={(text) => handleInputChange('phone', text)}
                editable={!isSubmitting && !loading}
              />
              {formErrors.phone && (
                <Text style={styles.errorText}>{formErrors.phone}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.email && styles.inputError
                ]}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={shippingInfo.email || ''}
                onChangeText={(text) => handleInputChange('email', text)}
                editable={!isSubmitting && !loading}
              />
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shipping Address *</Text>
              <TextInput
                style={[
                  styles.input, 
                  { height: 80, textAlignVertical: 'top' },
                  formErrors.address && styles.inputError
                ]}
                placeholder="Enter your complete address"
                multiline
                numberOfLines={3}
                value={shippingInfo.address || ''}
                onChangeText={(text) => handleInputChange('address', text)}
                autoCapitalize="sentences"
                editable={!isSubmitting && !loading}
              />
              {formErrors.address && (
                <Text style={styles.errorText}>{formErrors.address}</Text>
              )}
            </View>

            <View style={styles.rowFormGroup}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.city && styles.inputError
                  ]}
                  placeholder="Enter city"
                  value={shippingInfo.city || ''}
                  onChangeText={(text) => handleInputChange('city', text)}
                  autoCapitalize="words"
                  editable={!isSubmitting && !loading}
                />
                {formErrors.city && (
                  <Text style={styles.errorText}>{formErrors.city}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Postal Code *</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.postalCode && styles.inputError
                  ]}
                  placeholder="12345"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={shippingInfo.postal_code || ''}
                  onChangeText={(text) => handleInputChange('postalCode', text)}
                  editable={!isSubmitting && !loading}
                />
                {formErrors.postalCode && (
                  <Text style={styles.errorText}>{formErrors.postalCode}</Text>
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.country && styles.inputError
                ]}
                placeholder="Indonesia"
                value={shippingInfo.country || 'Indonesia'}
                onChangeText={(text) => handleInputChange('country', text)}
                autoCapitalize="words"
                editable={!isSubmitting && !loading}
              />
              {formErrors.country && (
                <Text style={styles.errorText}>{formErrors.country}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Address Description (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Landmark, building details, etc."
                value={shippingInfo.address_description || ''}
                onChangeText={(text) => handleInputChange('addressDescription', text)}
                autoCapitalize="sentences"
                editable={!isSubmitting && !loading}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethodList}>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method.key}
                  style={[
                    styles.paymentMethodItem,
                    selectedPaymentMethod === method.key && styles.paymentMethodItemSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect(method.key)}
                  disabled={isSubmitting || loading}
                >
                  <Text style={[
                    styles.paymentMethodLabel,
                    selectedPaymentMethod === method.key && styles.paymentMethodLabelSelected
                  ]}>
                    {method.label}
                  </Text>
                  {selectedPaymentMethod === method.key && (
                    <Feather name="check-circle" size={20} color="#4F7942" style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {formErrors.paymentMethod && (
              <Text style={styles.errorText}>{formErrors.paymentMethod}</Text>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.paymentInfo}>
              <Feather name="shield" size={24} color="#4F7942" />
              <View style={styles.paymentInfoText}>
                <Text style={styles.paymentInfoTitle}>Secure Payment via Xendit</Text>
                <Text style={styles.paymentInfoSubtitle}>
                  Choose from various payment methods including bank transfer, e-wallet, and credit card
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              (isSubmitting || loading) && styles.disabledButton
            ]}
            onPress={handleSubmitOrder}
            disabled={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
                <Text style={styles.placeOrderButtonText}>Creating Order...</Text>
              </View>
            ) : (
              <Text style={styles.placeOrderButtonText}>
                Place Order - {formatPrice(grandTotal)}
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  keyboardContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#86A789',
    marginTop: 16,
    marginBottom: 24,
  },
  backToShopButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToShopText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5233',
    marginTop: 20,
    marginBottom: 10,
  },
  processingText: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    lineHeight: 24,
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
  loadingIndicator: {
    marginLeft: 10,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 16,
  },
  orderSummary: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 15,
  },
  orderItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E5233',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 13,
    color: '#86A789',
    marginBottom: 2,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F7942',
    textAlign: 'right',
  },
  debugText: {
    fontSize: 11,
    color: '#FF6B6B',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: '#2E5233',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E5233',
  },
  divider: {
    height: 1,
    backgroundColor: '#C8E6C9',
    marginVertical: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  formGroup: {
    marginBottom: 16,
  },
  rowFormGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#2E5233',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2E5233',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    paddingLeft: 4,
  },
  paymentMethodList: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F0F8F0',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  paymentMethodItemSelected: {
    backgroundColor: '#4F7942',
    borderColor: '#4F7942',
  },
  paymentMethodLabel: {
    fontSize: 15,
    color: '#2E5233',
    fontWeight: '500',
  },
  paymentMethodLabelSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 16,
  },
  paymentInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
  },
  paymentInfoSubtitle: {
    fontSize: 14,
    color: '#86A789',
    marginTop: 4,
    lineHeight: 20,
  },
  placeOrderButton: {
    backgroundColor: '#4F7942',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#A8C3A8',
    shadowOpacity: 0.1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default withProviders(CheckoutScreen);