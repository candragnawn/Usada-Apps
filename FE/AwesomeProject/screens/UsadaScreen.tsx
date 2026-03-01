import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Usada from '@/components/ArticleUsada/Article';
import withProviders from '@/utils/withProviders';

const UsadaScreen = () => {
  return (
    <Usada />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    paddingBottom: 0,
  },
});

// Wrap the component with all providers
export default withProviders(UsadaScreen);