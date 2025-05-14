import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const handleStart = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9a16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 100,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 30,
    fontSize: 20,
    color: '#fff',
  },
  loginLink: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
