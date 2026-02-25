// components/Header/Header.js
import React, { useState } from 'react';
import { ScrollView,View, Text, TouchableOpacity, Image, StatusBar, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import styles from './styles';

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  
  const handleProfilePress = () => {
    navigation.navigate('ProfileMain');
  }
  
  const handleCartPress = () => {
    navigation.navigate('CartMain');
  }
  
  const handleUsadaPress = () => {
    navigation.navigate('UsadaMain');
  }
  
  return (
    <>
    <ScrollView>
      
    </ScrollView>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
      <ImageBackground 
        source={require('../../assets/images/bgherbal.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfoContainer}>
              <Image 
                source={
                  isAuthenticated && user?.avatar
                    ? { uri: user.avatar }
                    : require('../../assets/images/user.jpg')
                }
                style={styles.userAvatar}
              />
              <View style={styles.userTextContainer}>
                <Text style={styles.greeting}>Selamat Datang,</Text>
                <Text style={styles.username}>
                  {isAuthenticated && user?.name
                    ? user.name
                    : 'Pecinta Usada Bali'}
                </Text>
              </View>
            </View>
            
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={handleProfilePress }>
                {/* Using the cog icon from Ionicons */}
                <Ionicons name="person" size={23}    color="white" />
              </TouchableOpacity>
  
              
              <TouchableOpacity style={styles.notificationButton} onPress={handleCartPress }>
                <Ionicons name="cart" size={23} color="white" />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.herbifyInfoContainer}>
            <View style={styles.herbifyFeatureCard}>
              <View style={styles.herbifyLogoContainer}>
                <Image 
                  source={require('../../assets/images/logo.png')} 
                  style={styles.herbifyLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.herbifyTextContent}>
                <Text style={styles.herbifyTitle}>Usada Bali</Text>
                <Text style={styles.herbifyTagline}>
                  Temukan khasiat herbal tradisional Bali untuk kesehatan dan kesejahteraan Anda setiap hari
                </Text>
                <TouchableOpacity style={styles.exploreButton} onPress={handleUsadaPress}>
                  <Text style={styles.exploreButtonText}>Jelajahi Sekarang</Text>
                  <Ionicons name="arrow-forward" size={12} color="white" style={styles.exploreButtonIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Header;