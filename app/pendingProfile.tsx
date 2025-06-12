import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import CustomAlertModal from './components/alert'; 


import { styles } from './styles/profileStyles'; 
import LogoHeader from './components/logoHeader';

const pendingProfile = () => {

  const navigation = useNavigation();


  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  




  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
     
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <LogoHeader />
        </View>

        <View style={styles.containerEdit}>
          <Text style={styles.title}>Recetas Pendientes</Text>
          <Text style={styles.infoText}>Todas las recetas previas a publicación son aprobadas por nuestro equipo. {''}Puedes seguir aquí el estado de las recetas que creaste.</Text>
         <View style={styles.divider} />
        </View>
      </View>
      
    </SafeAreaView>
  );
};

export default pendingProfile;