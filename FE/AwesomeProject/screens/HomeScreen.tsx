import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header/Header';
import SearchBar from '../components/Home/SearchBar';
import DiseaseCategories from '../components/Home/DiseaseCategories';
import QuickServices from '../components/Home/QuickServices';
import HerbalCategories from '../components/Home/HerbalCategories';
import FeaturedRemedies from '../components/Home/FeaturedRemedies';
import QuotesSwiper from '../components/Home/QuotesSwiper';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <DiseaseCategories />
        <QuickServices />
        <HerbalCategories />
        <QuotesSwiper />
        <FeaturedRemedies />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80, // Add padding at the bottom to ensure content isn't hidden behind navigation
  },
});

export default HomeScreen;