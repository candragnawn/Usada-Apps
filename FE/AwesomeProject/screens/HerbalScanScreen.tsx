
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  Animated,
  ImageBackground,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
const FLASK_API_URL = process.env.EXPO_PUBLIC_AI_URL ? `${process.env.EXPO_PUBLIC_AI_URL}/predict` : undefined;

// Scanning Animation Component
const ScanningAnimation = ({ isScanning }) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    }
  }, [isScanning, scanLineAnim]);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.scannerOverlay}>
      <View style={styles.scannerFrame}>
        {/* Corner Brackets */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        
        {/* Scanning Line */}
        {isScanning && (
          <Animated.View 
            style={[
              styles.scanLine,
              { transform: [{ translateY }] }
            ]} 
          />
        )}
        
        {/* Center Target */}
        <View style={styles.centerTarget}>
          <View style={styles.targetDot} />
        </View>
      </View>
    </View>
  );
};

// Mapping detail tanaman berdasarkan hasil prediksi
const PLANT_DETAILS = {
  'Belimbing_Wuluh': {
    namaIlmiah: 'Averrhoa bilimbi',
    deskripsi: 'Belimbing wuluh adalah tanaman buah tropis yang berasal dari Asia Tenggara. Tanaman ini memiliki buah berbentuk lonjong dengan permukaan bergerigi dan rasa yang sangat asam. Pohonnya dapat tumbuh hingga 5–10 meter dengan daun majemuk berwarna hijau.',
    manfaat: [
      'Menurunkan tekanan darah tinggi',
      'Mengobati diabetes dengan mengontrol gula darah',
      'Mengatasi batuk dan demam',
      'Sumber vitamin C yang tinggi',
      'Antioksidan alami untuk menangkal radikal bebas',
      'Membantu mengatasi jerawat dan masalah kulit',
      'Melancarkan pencernaan'
    ]
  },
  'Jambu_Biji': {
    namaIlmiah: 'Psidium guajava',
    deskripsi: 'Jambu biji adalah tanaman buah tropis yang sangat populer di Indonesia. Buahnya berbentuk bulat atau oval dengan daging buah berwarna putih atau merah muda, memiliki biji kecil di bagian tengah. Kulit buahnya berwarna hijau hingga kuning saat matang.',
    manfaat: [
      'Sumber vitamin C tertinggi dibanding buah lainnya',
      'Meningkatkan sistem kekebalan tubuh',
      'Mengatasi diare dan gangguan pencernaan',
      'Mengontrol kadar gula darah',
      'Menjaga kesehatan jantung',
      'Antioksidan tinggi untuk mencegah penuaan dini',
      'Membantu menurunkan berat badan'
    ]
  },
  'Katuk': {
    namaIlmiah: 'Sauropus androgynus',
    deskripsi: 'Katuk adalah tanaman perdu kecil yang banyak tumbuh di Asia Tenggara. Daunnya berbentuk oval kecil dengan warna hijau segar dan dapat dimakan sebagai sayuran. Tanaman ini mudah tumbuh dan sering dijadikan pagar hidup.',
    manfaat: [
      'Meningkatkan produksi ASI pada ibu menyusui',
      'Sumber protein nabati yang tinggi',
      'Kaya akan vitamin A, B, dan C',
      'Mengandung zat besi untuk mencegah anemia',
      'Antioksidan untuk menjaga kesehatan mata',
      'Membantu proses penyembuhan luka',
      'Menjaga kesehatan kulit dan rambut'
    ]
  },
  'Kelor': {
    namaIlmiah: 'Moringa oleifera',
    deskripsi: 'Kelor adalah tanaman yang dijuluki "miracle tree" atau pohon ajaib karena hampir seluruh bagiannya dapat dimanfaatkan. Daunnya berbentuk kecil dan majemuk, buahnya berbentuk panjang seperti kacang polong, dan bunganya berwarna putih krem.',
    manfaat: [
      'Superfood dengan nutrisi lengkap (protein, vitamin, mineral)',
      'Menurunkan kadar gula darah dan kolesterol',
      'Anti-inflamasi dan antibakteri alami',
      'Meningkatkan energi dan stamina',
      'Menjaga kesehatan tulang dengan kandungan kalsium tinggi',
      'Membantu detoksifikasi tubuh',
      'Mencegah kanker dengan antioksidan tinggi'
    ]
  },
  'Kemangi': {
    namaIlmiah: 'Ocimum basilicum',
    deskripsi: 'Kemangi adalah tanaman herba aromatik yang memiliki aroma khas dan menyegarkan. Daunnya berbentuk oval dengan ujung meruncing, berwarna hijau segar. Tanaman ini sering digunakan sebagai lalapan atau bumbu masakan.',
    manfaat: [
      'Antibakteri dan antivirus alami',
      'Mengatasi stres dan menenangkan pikiran',
      'Melancarkan pencernaan dan mengatasi perut kembung',
      'Anti-inflamasi untuk mengurangi peradangan',
      'Menjaga kesehatan saluran pernapasan',
      'Mengontrol kadar gula darah',
      'Sumber antioksidan yang baik'
    ]
  },
  'Kembang_Sepatu': {
    namaIlmiah: 'Hibiscus rosa-sinensis',
    deskripsi: 'Kembang sepatu adalah tanaman hias yang memiliki bunga besar dan berwarna-warni, mulai dari merah, pink, kuning, hingga putih. Daunnya berbentuk oval dengan tepi bergerigi dan berwarna hijau mengkilap. Tanaman ini dapat tumbuh sebagai semak atau pohon kecil.',
    manfaat: [
      'Menurunkan tekanan darah tinggi',
      'Mengontrol kolesterol dalam darah',
      'Antioksidan tinggi untuk kesehatan jantung',
      'Membantu menurunkan berat badan',
      'Menjaga kesehatan rambut dan mencegah uban',
      'Anti-inflamasi untuk mengatasi peradangan',
      'Sumber vitamin C dan mineral'
    ]
  },
  'Sirih': {
    namaIlmiah: 'Piper betle',
    deskripsi: 'Sirih adalah tanaman merambat dengan daun berbentuk hati dan berwarna hijau mengkilap. Tanaman ini memiliki aroma khas yang menyengat dan telah lama digunakan dalam tradisi Indonesia untuk berbagai keperluan pengobatan dan ritual.',
    manfaat: [
      'Antiseptik alami untuk luka dan infeksi',
      'Menjaga kesehatan mulut dan gigi',
      'Mengatasi keputihan pada wanita',
      'Anti-inflamasi untuk peradangan',
      'Mengobati batuk dan gangguan pernapasan',
      'Antioksidan untuk menangkal radikal bebas',
      'Membantu penyembuhan luka bakar'
    ]
  },
  'Sirsak': {
    namaIlmiah: 'Annona muricata',
    deskripsi: 'Sirsak adalah buah tropis dengan kulit berduri lunak dan daging buah berwarna putih yang manis-asam. Buahnya berbentuk oval atau jantung dengan ukuran yang bervariasi. Pohonnya dapat tumbuh hingga 3–8 meter dengan daun hijau mengkilap.',
    manfaat: [
      'Potensial sebagai anti-kanker alami',
      'Meningkatkan sistem kekebalan tubuh',
      'Menurunkan tekanan darah tinggi',
      'Mengontrol kadar gula darah',
      'Anti-inflamasi dan antibakteri',
      'Menjaga kesehatan pencernaan',
      'Sumber vitamin C, B, dan serat yang tinggi'
    ]
  }
};

// Scan Result Modal
const ScanResultModal = ({ visible, onClose, result }) => {
  const detail = result?.name ? PLANT_DETAILS[result.name] : null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Hasil Klasifikasi</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.resultContent}>
            <MaterialIcons name="local-florist" size={48} color="#4F7942" />
            <Text style={styles.plantName}>{result?.name}</Text>
            <Text style={styles.confidenceText}>
              Akurasi: {result?.confidence ? `${result.confidence.toFixed(2)}%` : '-'}
            </Text>
            <Text style={styles.imagePathText}>
              File: {result?.image_path}
            </Text>
            {detail && (
              <View style={{ marginTop: 16, alignItems: 'flex-start', width: '100%' }}>
                <Text style={{ fontWeight: 'bold', color: '#4F7942', fontSize: 16 }}>
                  Nama Ilmiah: <Text style={{ fontWeight: 'normal', color: '#333' }}>{detail.namaIlmiah}</Text>
                </Text>
                <Text style={{ marginTop: 8, color: '#333' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4F7942' }}>Deskripsi: </Text>
                  {detail.deskripsi}
                </Text>
                <Text style={{ marginTop: 8, fontWeight: 'bold', color: '#4F7942' }}>Manfaat:</Text>
                {detail.manfaat.map((m, i) => (
                  <Text key={i} style={{ color: '#333', marginLeft: 10 }}>• {m}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const HerbalScanScreen = ({ route }) => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const mode = route?.params?.mode || 'camera';
  const [pickedImage, setPickedImage] = useState(null);

  // Tambahkan ref untuk CameraView agar bisa takePictureAsync
  const cameraRef = useRef(null);

  // Camera permissions handled by useCameraPermissions hook
  useEffect(() => {
    setCameraReady(true);
  }, []);

  const classifyImageWithAI = async (imageUri) => {
    try {
      // Hanya support upload dari aplikasi mobile (Android/iOS)
      if (Platform.OS === 'web') {
        Alert.alert('Fitur scan hanya tersedia di aplikasi mobile (Android/iOS).');
        return null;
      }

      // Pastikan imageUri adalah file path lokal, bukan base64
      if (imageUri.startsWith('data:image')) {
        Alert.alert('Gagal', 'Gambar harus berupa file, bukan base64. Pilih dari galeri, bukan hasil crop/base64.');
        return null;
      }

      let fileUri = imageUri;
      if (!fileUri.startsWith('file://')) {
        fileUri = 'file://' + fileUri.replace('file:/', '');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'herbal.jpg',
        type: 'image/jpeg',
      });

      console.log('FormData:', formData);
      console.log('fileUri:', fileUri);

      if (!FLASK_API_URL) {
        throw new Error('AI API URL not configured');
      }

      const response = await fetch(FLASK_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Flask error:', errorText);
        throw new Error('Gagal klasifikasi gambar');
      }

      const result = await response.json();
      console.log('Flask result:', result);

      // Tambahkan validasi hasil prediksi di FE
      const validLabels = Object.keys(PLANT_DETAILS);
      if (
        !result.prediction ||
        !validLabels.includes(result.prediction) ||
        (result.confidence !== undefined && result.confidence < 40) // threshold confidence, misal <40%
      ) {
        Alert.alert(
          'Tidak Dikenali',
          'Gambar tidak dapat dideteksi sebagai tanaman herbal yang dikenali. Silakan coba lagi dengan foto yang lebih jelas.'
        );
        return null;
      }

      return result;
    } catch (error) {
      console.log('Scan error:', error);
      Alert.alert('Scan Gagal', 'Tidak bisa mengklasifikasi gambar. Coba lagi.');
      return null;
    }
  };

  const handleScan = useCallback(async () => {
    if (!cameraReady) {
      Alert.alert('Camera Not Ready', 'Please wait for camera to initialize');
      return;
    }

    if (mode === 'camera') {
      try {
        setIsScanning(true);

        // Ambil foto dari kamera menggunakan ref
        if (cameraRef.current && cameraRef.current.takePictureAsync) {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
            skipProcessing: true,
          });
          const imageUri = photo.uri;
          setPickedImage(imageUri);

          // Kirim ke Flask untuk klasifikasi
          const aiResult = await classifyImageWithAI(imageUri);

          if (aiResult) {
            setScanResult({
              name: aiResult.prediction || 'Unknown Plant',
              confidence: aiResult.confidence || 0,
              image_path: aiResult.image_path || '',
            });
            setShowResult(true);
          } else {
            setScanResult(null);
            setShowResult(false);
          }
        } else {
          Alert.alert('Camera Error', 'Camera ref belum siap atau tidak ditemukan.');
        }
      } catch (error) {
        Alert.alert('Scan Failed', 'Gagal mengambil foto atau klasifikasi.');
      } finally {
        setIsScanning(false);
      }
      return;
    }

    // Pastikan ada gambar yang dipilih
    if (!pickedImage) {
      Alert.alert('Pilih Foto', 'Silakan pilih foto tanaman herbal terlebih dahulu.');
      return;
    }

    setIsScanning(true);

    try {
      let imageUri = pickedImage;
      if (!imageUri.startsWith('file://')) {
        imageUri = 'file://' + imageUri.replace('file:/', '');
      }

      const aiResult = await classifyImageWithAI(imageUri);

      if (aiResult) {
        setScanResult({
          name: aiResult.prediction || 'Unknown Plant',
          confidence: aiResult.confidence || 0,
          image_path: aiResult.image_path || '',
        });
        setShowResult(true);
      } else {
        setScanResult(null);
        setShowResult(false);
      }
    } catch (error) {
      Alert.alert('Scan Failed', 'Unable to identify plant. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [cameraReady, pickedImage, mode]);

  const toggleFlash = useCallback(() => {
    setFlashOn(prev => !prev);
  }, []);

  const handleGalleryPick = useCallback(async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Akses ke galeri diperlukan untuk memilih foto.');
      return;
    }
    // Launch image picker for gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      let imageUri = result.assets[0].uri;
      setPickedImage(imageUri);

      setIsScanning(true);
      if (Platform.OS === 'web') {
        Alert.alert('Fitur scan hanya tersedia di aplikasi mobile (Android/iOS).');
        setIsScanning(false);
        return;
      }
      if (!imageUri.startsWith('file://')) {
        imageUri = 'file://' + imageUri.replace('file:/', '');
      }
      const aiResult = await classifyImageWithAI(imageUri);
      setIsScanning(false);

      if (aiResult) {
        setScanResult({
          name: aiResult.prediction || 'Unknown Plant',
          confidence: aiResult.confidence || 0,
          image_path: aiResult.image_path || '',
        });
        setShowResult(true);
      } else {
        setScanResult(null);
        setShowResult(false);
      }
    }
  }, [classifyImageWithAI]);

  // Handler untuk upload foto
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      let imageUri = result.assets[0].uri;
      setPickedImage(imageUri);

      setIsScanning(true);
      console.log('Picked image URI:', imageUri);

      if (Platform.OS === 'web') {
        Alert.alert('Fitur scan hanya tersedia di aplikasi mobile (Android/iOS).');
        setIsScanning(false);
        return;
      }

      if (!imageUri.startsWith('file://')) {
        imageUri = 'file://' + imageUri.replace('file:/', '');
      }

      const aiResult = await classifyImageWithAI(imageUri);
      setIsScanning(false);

      if (aiResult) {
        setScanResult({
          name: aiResult.prediction || 'Unknown Plant',
          confidence: aiResult.confidence || 0,
          image_path: aiResult.image_path || '',
        });
        setShowResult(true);
      } else {
        setScanResult(null);
        setShowResult(false);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7942" />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-alt" size={64} color="#86A789" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Please enable camera access to scan herbal plants
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render UI berdasarkan mode
  if (mode === 'upload') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4F7942" />
        <ImageBackground 
          source={require('@/assets/images/batik.png')} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>Scan Herbal - Unggah Foto</Text>
              <Text style={styles.headerSubtitle}>Pilih gambar tanaman herbal dari galeri</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 24,
              marginBottom: 24,
            }}
            onPress={handlePickImage}
          >
            <Ionicons name="image" size={24} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Pilih Foto dari Galeri</Text>
          </TouchableOpacity>
          {pickedImage && (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: pickedImage }}
                style={{ width: 220, height: 220, borderRadius: 16, marginBottom: 16 }}
                resizeMode="cover"
              />
              <Text style={{ color: '#4F7942', fontWeight: '600', fontSize: 15, marginBottom: 8 }}>
                Foto dipilih, proses scan...
              </Text>
              {/* Tampilkan hasil scan jika sudah */}
              <ScanResultModal 
                visible={showResult}
                onClose={() => setShowResult(false)}
                result={scanResult}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4F7942"
      />
      
      {/* Header */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Herbal Scanner</Text>
            <Text style={styles.headerSubtitle}>Identify medicinal plants instantly</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('ScanHistory')}
          >
            <Feather name="clock" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          flash={flashOn ? 'on' : 'off'}
          onCameraReady={() => setCameraReady(true)}
        >
          <ScanningAnimation isScanning={isScanning} />
          
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>
              {isScanning ? 'Analyzing plant...' : 'Point camera at herbal plant'}
            </Text>
            <Text style={styles.instructionSubtext}>
              {isScanning ? 'Please hold steady' : 'Hold steady and tap scan button'}
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <LinearGradient
          colors={['rgba(248, 253, 248, 0.95)', 'rgba(248, 253, 248, 1)']}
          style={styles.controlsGradient}
        >
          {/* Quick Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Scanning Tips:</Text>
            <Text style={styles.tipsText}>
              • Ensure good lighting • Keep plant in center • Hold phone steady
            </Text>
          </View>

          {/* Control Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleGalleryPick}
            >
              <Feather name="image" size={24} color="#4F7942" />
              <Text style={styles.controlButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.scanButton, isScanning && styles.scanButtonActive]}
              onPress={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <>
                  <MaterialIcons name="center-focus-strong" size={32} color="white" />
                  <Text style={styles.scanButtonText}>SCAN</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, flashOn && styles.controlButtonActive]}
              onPress={toggleFlash}
            >
              <Feather name={flashOn ? "zap" : "zap-off"} size={24} color={flashOn ? "white" : "#4F7942"} />
              <Text style={[styles.controlButtonText, flashOn && styles.controlButtonTextActive]}>
                Flash
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Scans */}
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Scans</Text>
            <View style={styles.recentItems}>
              {['Turmeric', 'Ginger', 'Aloe Vera'].map((plant, index) => (
                <TouchableOpacity key={index} style={styles.recentItem}>
                  <View style={styles.recentIcon}>
                    <MaterialIcons name="local-florist" size={16} color="#4F7942" />
                  </View>
                  <Text style={styles.recentText}>{plant}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Scan Result Modal */}
      <ScanResultModal 
        visible={showResult}
        onClose={() => setShowResult(false)}
        result={scanResult}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4F7942',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#4F7942',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4F7942',
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  centerTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  targetDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4F7942',
    backgroundColor: 'rgba(79, 121, 66, 0.3)',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  controlsContainer: {
    height: 220,
  },
  controlsGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tipsContainer: {
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F7942',
    marginBottom: 5,
  },
  tipsText: {
    fontSize: 12,
    color: '#86A789',
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
    minWidth: 70,
  },
  controlButtonActive: {
    backgroundColor: '#4F7942',
  },
  controlButtonText: {
    fontSize: 12,
    color: '#4F7942',
    fontWeight: '600',
    marginTop: 4,
  },
  controlButtonTextActive: {
    color: 'white',
  },
  scanButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minHeight: 70,
    minWidth: 120,
  },
  scanButtonActive: {
    backgroundColor: '#86A789',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  recentContainer: {
    marginTop: 5,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F7942',
    marginBottom: 8,
  },
  recentItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recentItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 70,
  },
  recentIcon: {
    marginBottom: 4,
  },
  recentText: {
    fontSize: 10,
    color: '#4F7942',
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  resultContent: {
    padding: 20,
    alignItems: 'center',
  },
  plantIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F7942',
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  imagePathText: {
    fontSize: 12,
    color: '#86A789',
    marginBottom: 10,
  },
});

export default HerbalScanScreen;