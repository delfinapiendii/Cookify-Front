import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from "expo-router";
import styles from './styles/Styles'; // Importa los estilos


export default function Index() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/register');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/burger.png')} // Asegúrate de colocar la imagen en assets y renombrarla
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/cookifyOrange.png')} // Asegúrate de colocar la imagen en assets y renombrarla
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Buenas recetas en todo momento para todos.</Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.loginLink} >
            Inicia sesión
          </Text>
        </Text>
      </View>
    </>
  );
}
