// ConsultationScreen.js - Herbal Doctors Consultation (FIXED SCROLLING)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const ConsultationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  // Mock data for herbal doctors
  const herbalDoctors = [
    {
      id: 1,
      name: 'Jro Gede Yudi',
      specialization: 'Praktisi Usada',
      experience: '23 tahun',
      expertise: ['Pengobatan Herbal', 'Usada Bali', 'Pengobatan Non-Medis'],
      rating: 4.8,
      consultations: 247,
      price: 150000,
      available: true,
      nextAvailable: '10:00 - 20:00',
      image: '',
      description: 'Spesialis pengobatan tradisional Bali'
    },
    {
      id: 2,
      name: 'Ni Made Sari Dewi',
      specialization: 'Praktisi Usada & Jamu Tradisional',
      experience: '12 tahun',
      expertise: ['Jamu Tradisional', 'Usada Wanita', 'Herbal Detox'],
      rating: 4.9,
      consultations: 189,
      price: 125000,
      available: true,
      nextAvailable: '14:00 - 16:00',
      image: '',
      description: 'Ahli pengobatan herbal khusus untuk kesehatan wanita dan detoksifikasi alami'
    },
    {
      id: 3,
      name: 'I Ketut Suardana',
      specialization: 'Master Usada & Terapi Holistik',
      experience: '20 tahun',
      expertise: ['Usada Rare', 'Terapi Holistik', 'Ramuan Tradisional'],
      rating: 4.7,
      consultations: 312,
      price: 200000,
      available: false,
      nextAvailable: 'Besok 09:00',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150',
      description: 'Master pengobatan tradisional Bali dengan keahlian khusus untuk anak-anak'
    },
    {
      id: 4,
      name: 'Ni Wayan Sukmawati',
      specialization: 'Ahli Herbal & Aromaterapi',
      experience: '10 tahun',
      expertise: ['Aromaterapi', 'Essential Oil', 'Herbal Skincare'],
      rating: 4.6,
      consultations: 156,
      price: 100000,
      available: true,
      nextAvailable: '16:00 - 18:00',
      image: 'https://images.unsplash.com/photo-1594824919066-0c35ba4a7e7d?w=150&h=150',
      description: 'Spesialis herbal untuk perawatan kulit dan aromaterapi kesehatan'
    },
    {
      id: 5,
      name: 'I Made Dharma Yoga',
      specialization: 'Praktisi Usada & Pijat Tradisional',
      experience: '18 tahun',
      expertise: ['Pijat Usada', 'Terapi Tulang', 'Pengobatan Nyeri'],
      rating: 4.9,
      consultations: 278,
      price: 175000,
      available: true,
      nextAvailable: '08:00 - 10:00',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150',
      description: 'Ahli terapi tradisional untuk pengobatan nyeri dan gangguan tulang belakang'
    },
    {
      id: 6,
      name: 'Ni Putu Ayu Kartini',
      specialization: 'Herbalis & Konselor Kesehatan',
      experience: '8 tahun',
      expertise: ['Konseling Herbal', 'Nutrisi Alami', 'Lifestyle Sehat'],
      rating: 4.5,
      consultations: 134,
      price: 85000,
      available: true,
      nextAvailable: '13:00 - 15:00',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150',
      description: 'Konselor kesehatan holistik dengan pendekatan herbal dan gaya hidup sehat'
    }
  ];

  useEffect(() => {
    // Simulate loading doctors data
    const loadDoctors = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDoctors(herbalDoctors);
      setLoading(false);
    };

    loadDoctors();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDoctorSelect = (doctor) => {
    Alert.alert(
      'Pilih Konsultasi',
      `Apakah Anda ingin berkonsultasi dengan ${doctor.name}?\n\nBiaya: ${formatPrice(doctor.price)}`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Lanjutkan', 
          onPress: () => {
            // Navigate to consultation booking or chat
            navigation.navigate('ConsultationBooking', { doctor });
          }
        }
      ]
    );
  };

  const renderDoctorCard = (doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.doctorCard}
      onPress={() => handleDoctorSelect(doctor)}
      activeOpacity={0.8}
    >
      <View style={styles.doctorHeader}>
        <View style={styles.doctorImageContainer}>
          <Image
            source={{ uri: doctor.image }}
            style={styles.doctorImage}
            // defaultSource={require('@/assets/images/default-avatar.png')}
          />
          <View style={[
            styles.statusIndicator,
            { backgroundColor: doctor.available ? '#4CAF50' : '#FF9800' }
          ]} />
        </View>
        
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          
          <View style={styles.doctorStats}>
            {/* Hapus Feather bintang dan rating */}
            {/* <View style={styles.statItem}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{doctor.rating}</Text>
            </View> */}
            <View style={styles.statItem}>
              <Feather name="users" size={14} color="#86A789" />
              <Text style={styles.statText}>{doctor.consultations}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="clock" size={14} color="#86A789" />
              <Text style={styles.statText}>{doctor.experience}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatPrice(doctor.price)}</Text>
          <Text style={styles.priceLabel}>per konsultasi</Text>
        </View>
      </View>

      <Text style={styles.doctorDescription}>{doctor.description}</Text>

      <View style={styles.expertiseContainer}>
        <Text style={styles.expertiseLabel}>Keahlian:</Text>
        <View style={styles.expertiseList}>
          {doctor.expertise.map((skill, index) => (
            <View key={index} style={styles.expertiseTag}>
              <Text style={styles.expertiseText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.availabilityContainer}>
        <View style={styles.availabilityInfo}>
          <Feather 
            name={doctor.available ? "check-circle" : "clock"} 
            size={16} 
            color={doctor.available ? "#4CAF50" : "#FF9800"} 
          />
          <Text style={[
            styles.availabilityText,
            { color: doctor.available ? "#4CAF50" : "#FF9800" }
          ]}>
            {doctor.available ? 'Tersedia' : 'Tidak Tersedia'}
          </Text>
        </View>
        <Text style={styles.nextAvailableText}>
          {doctor.available ? 'Hari ini: ' : 'Tersedia: '}{doctor.nextAvailable}
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.consultButton,
          !doctor.available && styles.consultButtonDisabled
        ]}
        onPress={() => handleDoctorSelect(doctor)}
        disabled={!doctor.available}
      >
        <Feather 
          name="message-circle" 
          size={16} 
          color="white" 
          style={{ marginRight: 8 }} 
        />
        <Text style={styles.consultButtonText}>
          {doctor.available ? 'Konsultasi Sekarang' : 'Jadwalkan Konsultasi'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
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
            <Text style={styles.headerTitle}>Konsultasi Herbal</Text>
            <Text style={styles.headerSubtitle}>Pilih Ahli Usada Terpercaya</Text>
          </View>
        </ImageBackground>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7942" />
          <Text style={styles.loadingText}>Memuat daftar dokter...</Text>
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

      {/* Fixed Header - Outside ScrollView */}
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
          <Text style={styles.headerTitle}>Konsultasi Herbal</Text>
          <Text style={styles.headerSubtitle}>
            {doctors.length} Ahli Usada Tersedia
          </Text>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color="white" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Feather name="shield" size={24} color="#4F7942" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Konsultasi Terpercaya</Text>
              <Text style={styles.infoSubtitle}>
                Semua praktisi telah tersertifikasi dan berpengalaman dalam pengobatan herbal tradisional
              </Text>
            </View>
          </View>
        </View>

        {/* Available Doctors Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="users" size={20} color="#4F7942" />
            </View>
            <Text style={styles.statNumber}>{doctors.length}</Text>
            <Text style={styles.statLabel}>Total Dokter</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="check-circle" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>
              {doctors.filter(d => d.available).length}
            </Text>
            <Text style={styles.statLabel}>Tersedia Hari Ini</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>4.7</Text>
            <Text style={styles.statLabel}>Rating Rata-rata</Text>
          </View>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Daftar Ahli Herbal Usada</Text>
          
          {doctors.map(doctor => renderDoctorCard(doctor))}
        </View>
      </ScrollView>
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
    // Remove paddingTop modification - let SafeAreaView handle it
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#86A789',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50, // Increased padding bottom for better scrolling
  },
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#86A789',
    marginTop: 4,
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  statLabel: {
    fontSize: 12,
    color: '#86A789',
    textAlign: 'center',
    marginTop: 4,
  },
  doctorsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 16,
  },
  doctorCard: {
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
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8F0',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#4F7942',
    marginBottom: 8,
  },
  doctorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#86A789',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  priceLabel: {
    fontSize: 12,
    color: '#86A789',
  },
  doctorDescription: {
    fontSize: 14,
    color: '#86A789',
    lineHeight: 20,
    marginBottom: 12,
  },
  expertiseContainer: {
    marginBottom: 12,
  },
  expertiseLabel: {
    fontSize: 13,
    color: '#2E5233',
    fontWeight: '500',
    marginBottom: 6,
  },
  expertiseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  expertiseTag: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expertiseText: {
    fontSize: 12,
    color: '#4F7942',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FDF8',
    borderRadius: 8,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  nextAvailableText: {
    fontSize: 12,
    color: '#86A789',
  },
  consultButton: {
    backgroundColor: '#4F7942',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultButtonDisabled: {
    backgroundColor: '#A8C3A8',
  },
  consultButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ConsultationScreen;