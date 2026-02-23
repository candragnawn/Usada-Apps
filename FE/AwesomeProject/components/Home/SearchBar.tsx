import React from 'react';
import { View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Cari ramuan atau pengobatan..."
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

export default SearchBar;