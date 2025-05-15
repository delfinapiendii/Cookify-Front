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

  const handleSubmit = () => {
    if (Object.values(form).some(v => v.trim() === '')) {
      Alert.alert('Completa todos los campos');
      router.push('/home');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica para enviar los datos
    Alert.alert('Registro exitoso');
    
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
