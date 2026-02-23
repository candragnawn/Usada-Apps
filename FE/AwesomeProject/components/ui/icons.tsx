// src/components/ui/Icons.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Simple icon components using text emojis
// In a real app, you'd likely use a library like react-native-vector-icons
export const SearchIcon = () => <Text style={styles.icon}>🔍</Text>;
export const GridIcon = () => <Text style={styles.icon}>⊞</Text>;
export const ListIcon = () => <Text style={styles.icon}>☰</Text>;
export const FilterIcon = () => <Text style={styles.icon}>⚙</Text>;
export const EyeIcon = () => <Text style={styles.icon}>👁</Text>;
export const ChevronLeftIcon = () => <Text style={styles.icon}>‹</Text>;
export const ChevronRightIcon = () => <Text style={styles.icon}>›</Text>;
export const CloseIcon = () => <Text style={styles.icon}>×</Text>;

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
    color: '#666',
  },
});