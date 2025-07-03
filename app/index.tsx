import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from "expo-router";
import styles from './styles/Styles'; // Importa los estilos
import defaultRecipes from '../assets/data/recepieData.json';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Index() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/register');
  };
  const handleLogin = () => {
    router.push('/login');
  };
  

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/burger.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/cookifyOrange.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Buenas recetas en todo momento para todos.</Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.loginLink} onPress={handleLogin}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </>
  );
}
