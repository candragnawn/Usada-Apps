import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';


const QuickServices = () => {
  const navigation = useNavigation();
  const [scanModalVisible, setScanModalVisible] = useState(false);

  const handleConsultationPress = () => {
    navigation.navigate('ConsultationScreen');
  };

  const handleUsadaPress = () => {
    navigation.navigate('UsadaScreen', { screen: 'UsadaMain' });
  };

  const handleScanPress = () => {
    setScanModalVisible(true);
  };

  const handleScanCamera = () => {
    setScanModalVisible(false);
    navigation.navigate('HerbalScanScreen');
  };

  const handleScanUpload = () => {
    setScanModalVisible(false);
    navigation.navigate('HerbalScanScreen', { mode: 'upload' });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/batik.png')}
      style={styles.quickServicesContainer}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <TouchableOpacity style={styles.quickServiceCard} onPress={handleConsultationPress}>
        <View style={styles.quickServiceIconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.quickServiceText}>Konsultasi</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickServiceCard} onPress={handleUsadaPress}>
        <View style={styles.quickServiceIconContainer}>
          <FontAwesome5 name="book-medical" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.quickServiceText}>Resep Herbal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickServiceCard} onPress={handleScanPress}>
        <View style={styles.quickServiceIconContainer}>
          <Ionicons name="camera-outline" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.quickServiceText}>Scan Herbal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickServiceCard}>
        <View style={styles.quickServiceIconContainer}>
          <MaterialCommunityIcons name="history" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.quickServiceText}>Riwayat</Text>
      </TouchableOpacity>

      {/* Modal Pilihan Scan Herbal */}
      <Modal
        visible={scanModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: 280,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 18 }}>
              Pilih Metode Scan Herbal
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                marginBottom: 12,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={handleScanCamera}
            >
              <Ionicons name="camera" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Scan via Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#86A789',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={handleScanUpload}
            >
              <Ionicons name="image" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Unggah Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 18 }}
              onPress={() => setScanModalVisible(false)}
            >
              <Text style={{ color: '#4CAF50', fontWeight: '600', fontSize: 15 }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default QuickServices;