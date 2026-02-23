import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

// Dummy data, replace with fetch from API/local storage if needed
const PLACEHOLDER_IMAGE = { uri: 'https://via.placeholder.com/60x60.png?text=Herbal' };
const DUMMY_HISTORY = [
  {
    id: '1',
    plant: 'Jambu Biji',
    confidence: 63.04,
    image: PLACEHOLDER_IMAGE,
    date: '2025-07-26 20:23',
  },
  {
    id: '2',
    plant: 'Kelor',
    confidence: 85.12,
    image: PLACEHOLDER_IMAGE,
    date: '2025-07-25 18:10',
  },
  {
    id: '3',
    plant: 'Belimbing Wuluh',
    confidence: 78.55,
    image: PLACEHOLDER_IMAGE,
    date: '2025-07-24 14:05',
  },
];

const ScanHistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simulasi fetch dari local storage/server
    setHistory(DUMMY_HISTORY);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.plant}>{item.plant}</Text>
        <Text style={styles.confidence}>Akurasi: {item.confidence.toFixed(2)}%</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Scan Herbal</Text>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Belum ada riwayat scan.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDF8', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4F7942', marginBottom: 16, textAlign: 'center' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 14, elevation: 2, padding: 10, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  info: { flex: 1 },
  plant: { fontSize: 18, fontWeight: 'bold', color: '#4F7942' },
  confidence: { fontSize: 14, color: '#333', marginTop: 2 },
  date: { fontSize: 12, color: '#86A789', marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#86A789', fontSize: 16 },
});

export default ScanHistoryScreen;

// NOTE: Data history scan masih statis (DUMMY_HISTORY).
// Untuk data dinamis, simpan hasil scan ke AsyncStorage atau backend, lalu fetch di sini.
