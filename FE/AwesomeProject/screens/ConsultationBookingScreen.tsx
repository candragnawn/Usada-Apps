import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

type RootStackParamList = {
  ConsultationBooking: { doctor: any };
  ChatScreen: { consultationId: number; doctor: any };
};

type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConsultationBooking'>;
type BookingScreenRouteProp = RouteProp<RootStackParamList, 'ConsultationBooking'>;

interface Props {
  navigation: BookingScreenNavigationProp;
  route: BookingScreenRouteProp;
}

const ConsultationBookingScreen: React.FC<any> = ({ route, navigation }: Props) => {
  const { doctor } = route.params;
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      // Generate a unique firebase_chat_id
      const firebaseChatId = `chat_${user.id}_${doctor.id}_${Date.now()}`;

      // 1. Call Laravel API to create consultation
      const response = await fetch(`${API_BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: doctor.id,
          amount: doctor.price + 2000,
          firebase_chat_id: firebaseChatId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membuat reservasi');
      }

      const consultationId = result.data.id;

      navigation.navigate('ChatScreen', {
        consultationId: consultationId,
        doctor,
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan saat membuat reservasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#2E5233" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Konsultasi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.doctorCard}>
          <Image source={{ uri: doctor.image || 'https://via.placeholder.com/150' }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Pembayaran</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Biaya Konsultasi</Text>
            <Text style={styles.paymentValue}>Rp {doctor.price.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Biaya Layanan</Text>
            <Text style={styles.paymentValue}>Rp 2.000</Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>Rp {(doctor.price + 2000).toLocaleString('id-ID')}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={20} color="#4F7942" />
          <Text style={styles.infoText}>
            Konsultasi akan aktif selama 24 jam setelah pembayaran dikonfirmasi.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Bayar & Mulai Chat</Text>
              <Feather name="chevron-right" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  content: {
    padding: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8F0',
  },
  doctorInfo: {
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  doctorSpec: {
    fontSize: 14,
    color: '#4F7942',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#86A789',
  },
  paymentValue: {
    fontWeight: '500',
    color: '#2E5233',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F3E8',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    color: '#4F7942',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E8F3E8',
  },
  confirmButton: {
    backgroundColor: '#4F7942',
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ConsultationBookingScreen;
