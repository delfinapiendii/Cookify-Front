import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/navBarStyle'; // ajusta la ruta
import { router, usePathname } from 'expo-router';

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const handleNavigationPress = (screen: string) => {
    if (screen === 'Search') {
      router.push('/SearchScreen');
    } else if (screen === 'AddRecipe') {
      router.push('/createRecepieScreen');
    } else if (screen === 'Home') {
      router.push('/home');
    } else if (screen === 'Bookmarks') {
      router.push('/profileRecipes');

    } else if (screen === 'Profile') {
      router.push('/profile');

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

  return (
    <View style={[styles.bottomNavigation, { backgroundColor: '#FFFFFF' }]}>
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
  );
};

export default BottomNavigation;
