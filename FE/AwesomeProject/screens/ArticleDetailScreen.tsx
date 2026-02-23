import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ArticleDetail from '@/components/ArticleUsada/ArticleDetail';
import withProviders from '@/utils/withProviders';

const ArticleDetailScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ArticleDetail route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
});

// Wrap the component with all providers
export default withProviders(ArticleDetailScreen);