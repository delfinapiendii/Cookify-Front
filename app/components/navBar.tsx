import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/navBarStyle'; 
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from './alert';


const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const checkUserIdBeforeAction = async () => {
    const userId = await AsyncStorage.getItem('userid');

    if (!userId || userId === 'null') {
      console.log('User ID found:', userId);
      setIsGuest(true);
      return ;
    }
    setIsGuest(false);
    console.log('User ID found:', userId);
    return ;
  };
  

  const handleNavigationPress = async (screen: string) => {
    const userId = await AsyncStorage.getItem('userid');
    const isGuest = !userId || userId === 'null';
  
    if (screen === 'Search') {
      if (isGuest) {
        setShowLoginModal(true);
        return;
      } else {
        router.push('/SearchScreen');
      }
    } else if (screen === 'AddRecipe') {
      if (isGuest) {
        setShowLoginModal(true);
        return;
      } else {
        router.push('/createRecepieScreen');
      }
    } else if (screen === 'Home') {
      router.push('/home');
    } else if (screen === 'Bookmarks') {
      if (isGuest) {
        setShowLoginModal(true);
        return;
      } else {
        router.push('/profileRecipes');
      }
    } else if (screen === 'Profile') {
      if (isGuest) {
        setShowLoginModal(true);
        return;
      } else {
        router.push('/profile');
      }
    }
  };
  
  const getIconColor = (screen: string) => {
    if (
      (screen === 'Home' && pathname === '/home') ||
      (screen === 'Search' && pathname === '/SearchScreen') ||
      (screen === 'AddRecipe' && pathname === '/createRecepieScreen') ||
      (screen === 'Bookmarks' && pathname === '/profileRecipes') ||
      (screen === 'Profile' && pathname === '/profile')
    ) {
      return '#FF9A16'; // activo
    }
    return '#333'; // inactivo
  };

  function setIsDeleteModalVisible(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  return (
    <><View style={styles.bottomNavigation}>
      <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Home')}>
        <Ionicons name="home-outline" size={24} color={getIconColor('Home')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Search')}>
        <Ionicons name="search-outline" size={24} color={getIconColor('Search')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('AddRecipe')}>
        <View style={styles.addButton}>
          <Ionicons name="add" size={32} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Bookmarks')}>
        <Ionicons name="book-outline" size={24} color={getIconColor('Bookmarks')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Profile')}>
        <Ionicons name="person-outline" size={24} color={getIconColor('Profile')} />
      </TouchableOpacity>
    </View>
    <CustomAlertModal
        isVisible={showLoginModal}
        message="Para acceder a esta sección, debes iniciar sesión o registrarte."
        onConfirm={() => {
          setShowLoginModal(false);
          router.push('/');
        } }
        onCancel={() => {
          setShowLoginModal(false);
        } }

        confirmText="Iniciar"
        cancelText='Volver'
        showCancelButton={true} /></>
  );
};

export default BottomNavigation;
