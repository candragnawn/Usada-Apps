import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Leaf,
  MapPin,
  CheckCircle,
  Heart,
  Sun,
  ArrowLeft,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HerbalScanResult = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#16a34a', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>Hasil Scan</Text>
              <Text style={styles.headerSubtitle}>Identifikasi Berhasil</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={18} color="white" />
            </TouchableOpacity>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.dateTimeText}>10 Juli 2024</Text>
              <Text style={styles.dateTimeText}>14:30 WIB</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Plant Image & Basic Info */}
        <View style={styles.card}>
          <View style={styles.plantImageContainer}>
            <LinearGradient
              colors={['#dcfce7', '#d1fae5']}
              style={styles.plantImageGradient}
            >
              <View style={styles.plantIconContainer}>
                <Leaf size={40} color="white" />
              </View>
              <Text style={styles.plantImageLabel}>Gambar Sirih</Text>
            </LinearGradient>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>95% Akurat</Text>
            </View>
          </View>
          
          <View style={styles.plantInfo}>
            <View style={styles.plantTitleContainer}>
              <Text style={styles.plantTitle}>Sirih</Text>
              <Text style={styles.plantScientific}>Piper betle</Text>
              <Text style={styles.plantFamily}>Daun Sirih • Familie: Piperaceae</Text>
            </View>
            
            {/* Confidence Bar */}
            <View style={styles.confidenceContainer}>
              <View style={styles.confidenceHeader}>
                <Text style={styles.confidenceLabel}>Tingkat Kepercayaan</Text>
                <Text style={styles.confidenceValue}>95%</Text>
              </View>
              <View style={styles.confidenceBarContainer}>
                <View style={styles.confidenceBar} />
              </View>
            </View>
            
            {/* Quick Info */}
            <View style={styles.quickInfoContainer}>
              <View style={styles.quickInfoItem}>
                <MapPin size={16} color="#16a34a" />
                <Text style={styles.quickInfoText}>Asia Tenggara</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Sun size={16} color="#16a34a" />
                <Text style={styles.quickInfoText}>Sepanjang tahun</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Manfaat Kesehatan</Text>
          </View>
          
          <View style={styles.benefitsList}>
            {[
              'Antiseptik alami untuk membersihkan luka',
              'Mengobati batuk dan radang tenggorokan',
              'Mengatasi bau mulut dan menjaga kesehatan gigi',
              'Mengobati keputihan pada wanita',
              'Mengurangi peradangan pada kulit',
              'Membantu penyembuhan luka bakar ringan'
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={16} color="#22c55e" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Leaf size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Deskripsi</Text>
          </View>
          
          <Text style={styles.descriptionText}>
            Sirih adalah tanaman merambat yang daunnya berbentuk hati dengan aroma khas. 
            Telah digunakan secara turun temurun dalam pengobatan tradisional Indonesia. 
            Tanaman ini mudah ditemukan dan memiliki khasiat yang sangat beragam untuk kesehatan.
          </Text>
        </View>

        {/* Bottom Info */}
        <LinearGradient
          colors={['#dcfce7', '#d1fae5']}
          style={styles.bottomInfo}
        >
          <Text style={styles.tipText}>
            💡 <Text style={styles.tipBold}>Tips:</Text> Konsultasikan dengan ahli herbal atau dokter sebelum menggunakan
          </Text>
          <Text style={styles.disclaimerText}>
            Hasil scan berdasarkan AI • Akurasi dapat bervariasi
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    marginLeft: 0,
  },
  headerTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  plantImageContainer: {
    position: 'relative',
    height: 192,
  },
  plantImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#16a34a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plantImageLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  accuracyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  accuracyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  plantInfo: {
    padding: 16,
  },
  plantTitleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  plantTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  plantScientific: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  plantFamily: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  confidenceBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBar: {
    width: '95%',
    height: '100%',
    backgroundColor: '#16a34a',
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickInfoText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  benefitsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  descriptionText: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomInfo: {
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#15803d',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipBold: {
    fontWeight: 'bold',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#16a34a',
    textAlign: 'center',
  },
});

export default HerbalScanResult;