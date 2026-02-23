// screens/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // SafeAreaView mengambil seluruh layar
  },
  scrollView: {
    flexGrow: 1, // Membuat ScrollView tumbuh dan bisa digulir
    paddingBottom: 80, // Memberikan ruang di bawah untuk bottom navigation
  },
  bottomNavContainer: {
    position: 'absolute', // Menempatkan bottom navigation di bawah layar
    bottom: 0, // Posisi tetap di bawah
    left: 0,
    right: 0,
    zIndex: 1, // Pastikan berada di atas konten
  },
});

export default styles;
