import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import styles from './styles/Styles';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {

    const navigation = useNavigation();
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { email, username, password, confirmPassword } = form;
  
    // Validar campos vacíos
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Completa todos los campos');
      return;
    }
  
    // Validar formato de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Por favor, ingresa un email válido');
      return;
    }
  
    // Validar contraseña: al menos 6 caracteres, una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y números'
      );
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }
  
    try {
      // Paso 1: Registro parcial
      const registerRes = await fetch('http://192.168.68.55:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, alias: username }),
      });
  
      if (!registerRes.ok) {
        const error = await registerRes.json();
        console.error('Error al registrar:', error);
        Alert.alert('Error al registrar usuario');
        return;
      }
  
      // Paso 2: Completar contraseña
      const completeRes = await fetch('http://192.168.68.55:3000/api/v1/auth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!completeRes.ok) {
        const error = await completeRes.json();
        console.error('Error al completar registro:', error);
        Alert.alert('Error al guardar la contraseña');
        return;
      }
  
      Alert.alert('Registro exitoso');
      router.push('/home');
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error de red. Intenta más tarde.');
    }
  };
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.containerRegister}>
     <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={28} color="black" style={styles.backarrow}/>
         </TouchableOpacity>
         <View style={styles.logoContainer}>
           <Image
             source={require('../assets/images/logoWhite.png')} // Asegúrate que la ruta y archivo del logo sean correctos
             style={styles.centerlogo}
             resizeMode="contain"
           />
         </View>
       </View>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        placeholder="Usuario"
        style={styles.input}
        placeholderTextColor="#aaa"
        onChangeText={(text) => handleInputChange('username', text)}
      />
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        placeholderTextColor="#aaa"
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        placeholder="Mail"
        style={styles.input}
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <TextInput
        placeholder="Re-ingresa contraseña"
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
      />

      <TouchableOpacity  onPress={handleSubmit}>
        <Text style={styles.start}>Comenzar</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/images/salad.png')} // o tu imagen local
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
}
