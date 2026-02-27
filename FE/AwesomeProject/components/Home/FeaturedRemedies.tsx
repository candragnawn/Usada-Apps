// components/FeaturedRemedies/FeaturedRemedies.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useUsada } from '../../context/UsadaContext';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const FeaturedRemedies = () => {
  const navigation = useNavigation();
  const { 
    articles, 
    loading, 
    error,
    fetchArticles,
    fetchLatestArticles,
    getFullImageUrl
  } = useUsada();
  
  const [featuredRemedies, setFeaturedRemedies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tambahkan data dummy sebagai fallback
  const DUMMY_REMEDIES = [
    {
      id: 1,
      title: 'Boreh Bali',
      description: 'Ramuan tradisional Bali untuk menghangatkan tubuh.',
      category: 'Ramuan',
      image: require('../../assets/images/boreh.jpeg'),
      slug: 'boreh-bali'
    },
    {
      id: 2,
      title: 'Loloh Cemcem',
      description: 'Minuman herbal khas Bali untuk pencernaan.',
      category: 'Herbal',
      image: require('../../assets/images/1.png'),
      slug: 'loloh-cemcem'
    },
  ];

  useEffect(() => {
    loadFeaturedRemedies();
  }, [articles]);

  const loadFeaturedRemedies = async () => {
    try {
      setIsLoading(true);
      
      if (articles.length === 0) {
        await fetchArticles();
      }
      
      // Filter untuk kategori ramuan atau herbal
      const remedyCategories = ['Ramuan', 'Herbal', 'Obat Tradisional', 'Jamu'];
      let remedyArticles = articles.filter(article => 
        remedyCategories.some(category => 
          article.category?.toLowerCase().includes(category.toLowerCase())
        )
      );
      
      // Jika tidak ada artikel dengan kategori ramuan, ambil artikel terbaru
      if (remedyArticles.length === 0) {
        try {
          remedyArticles = await fetchLatestArticles(6);
        } catch (err) {
          // Fallback ke artikel yang ada
          remedyArticles = articles.slice(0, 6);
        }
      }
      
      // Limit ke 6 artikel teratas
      const limitedRemedies = remedyArticles.slice(0, 6);
      
      setFeaturedRemedies(limitedRemedies);
    } catch (err) {
      console.error('Error loading featured remedies:', err);
      // Fallback: gunakan data dummy jika gagal fetch
      setFeaturedRemedies(DUMMY_REMEDIES);
      // Jangan tampilkan Alert agar tidak mengganggu UX
      // Alert.alert('Error', 'Gagal memuat ramuan unggulan');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated navigation function to match Usada.js pattern
  const handleRemedyPress = (remedy) => {
    try {
      console.log('🔄 Navigating to remedy:', remedy.title);
      
      // Use the same navigation pattern as Usada.js
      navigation.navigate('ArticleDetail', { 
        articleId: remedy.id,
        articleSlug: remedy.slug
      });
    } catch (err) {
      console.error('Error navigating to remedy:', err);
      Alert.alert('Error', 'Gagal membuka artikel');
    }
  };

  const renderRemedyCard = (remedy, index) => (
    <TouchableOpacity 
      key={remedy.id || index} 
      style={styles.featuredRemedyCard}
      onPress={() => handleRemedyPress(remedy)}
      activeOpacity={0.7}
    >
      <View style={styles.featuredRemedyImagePlaceholder}>
        {remedy.image_url_full || remedy.image_url || remedy.image ? (
          // Cek apakah image adalah require (local) atau url
          typeof remedy.image === 'number' ? (
            <Image
              source={remedy.image}
              style={{ 
                width: '100%', 
                height: 150, 
                borderTopLeftRadius: 15, 
                borderTopRightRadius: 15 
              }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{ uri: remedy.image_url_full || remedy.image_url }}
              style={{ 
                width: '100%', 
                height: 150, 
                borderTopLeftRadius: 15, 
                borderTopRightRadius: 15 
              }}
              resizeMode="cover"
              onError={(e) => {
                console.log('Image load error:', e.nativeEvent.error);
              }}
            />
          )
        ) : (
          <View style={{
            width: '100%',
            height: 150,
            backgroundColor: '#f0f0f0',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#666', fontSize: 12 }}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.featuredRemedyContent}>
        <Text style={styles.featuredRemedyTitle} numberOfLines={2}>
          {remedy.title || 'Untitled Remedy'}
        </Text>
        <Text style={styles.featuredRemedyDescription} numberOfLines={3}>
          {remedy.description || remedy.excerpt || 'No description available'}
        </Text>
        {remedy.category && (
          <Text style={{
            fontSize: 10,
            color: '#666',
            marginTop: 4,
            fontStyle: 'italic'
          }}>
            {remedy.category}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading && featuredRemedies.length === 0) {
    return (
      <View style={styles.sectionContainer1}>
        <Text style={styles.sectionTitle3}>Ramuan Unggulan</Text>
        <View style={{ 
          height: 200, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 10, color: '#666' }}>
            Memuat ramuan unggulan...
          </Text>
        </View>
      </View>
    );
  }

  if (error && featuredRemedies.length === 0) {
    return (
      <View style={styles.sectionContainer1}>
        <Text style={styles.sectionTitle3}>Ramuan Unggulan</Text>
        <View style={{ 
          padding: 20, 
          alignItems: 'center' 
        }}>
          <Text style={{ color: '#ff6b6b', textAlign: 'center' }}>
            Gagal memuat ramuan unggulan
          </Text>
          <TouchableOpacity 
            onPress={loadFeaturedRemedies}
            style={{
              marginTop: 10,
              paddingHorizontal: 20,
              paddingVertical: 8,
              backgroundColor: '#4CAF50',
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (featuredRemedies.length === 0) {
    return (
      <View style={styles.sectionContainer1}>
        <Text style={styles.sectionTitle3}>Ramuan Unggulan</Text>
        <View style={{ 
          padding: 20, 
          alignItems: 'center' 
        }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Belum ada ramuan unggulan tersedia
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer1}>
      <Text style={styles.sectionTitle3}>Ramuan Unggulan</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredRemediesScroll}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {featuredRemedies.map((remedy, index) => renderRemedyCard(remedy, index))}
      </ScrollView>
      
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 40,
          right: 20,
        }}>
          <ActivityIndicator size="small" color="#4CAF50" />
        </View>
      )}
    </View>
  );
};

export default FeaturedRemedies;