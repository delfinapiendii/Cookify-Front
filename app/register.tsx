import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import styles from './styles/registerStyles';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterPhaseOne, useRegisterPhaseTwo } from '../hooks/hooks';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [registrationPhase, setRegistrationPhase] = useState(1);

  const {
    form: formOne,
    errors: errorsOne,
    aliasSuggestions,
    handleInputChange,
    validateAndSubmit,
    canProceed,
  } = useRegisterPhaseOne();

  const {
    form: formTwo,
    errors: errorsTwo,
    handleChange,
    validateAndSubmit: completeRegister,
  } = useRegisterPhaseTwo(formOne.email);

  const handleSubmit = async () => {
    if (registrationPhase === 1) {
      const success = await validateAndSubmit();
      if (success) setRegistrationPhase(2);
    } else {
      const success = await completeRegister();
      if (success) router.push('/home');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerRegister}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" style={styles.backarrow} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logoWhite.png')}
            style={styles.centerlogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {registrationPhase === 1 && (
        <>
          <Text style={styles.title}>Registrarse</Text>
          <TextInput
            placeholder="Usuario"
            style={[styles.input, errorsOne.username ? styles.inputError : {}]}
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleInputChange('username', text)}
            value={formOne.username}
          />
          {aliasSuggestions.length > 0 && (
            <View style={{ marginVertical: 5, marginLeft: 10, marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Sugerencias disponibles:</Text>
              {aliasSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => {
                    handleInputChange('username', suggestion);
                  }}
                >
                  <Text style={{ color: '#FF9A16', fontSize: 14 }}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errorsOne.username ? <Text style={styles.errorMessage}>{errorsOne.username}</Text> : null}

          <TextInput
            placeholder="Nombre"
            style={[styles.input, errorsOne.name ? styles.inputError : {}]}
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleInputChange('name', text)}
            value={formOne.name}
          />
          {errorsOne.name ? <Text style={styles.errorMessage}>{errorsOne.name}</Text> : null}

          <TextInput
            placeholder="Mail"
            style={[styles.input, errorsOne.email ? styles.inputError : {}]}
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            onChangeText={(text) => handleInputChange('email', text)}
            value={formOne.email}
          />
          {errorsOne.email ? <Text style={styles.errorMessage}>{errorsOne.email}</Text> : null}
        </>
      )}

      {registrationPhase === 2 && (
        <>
          <Text style={styles.titleContrasena}>Ingrese una contraseña para completar registro</Text>
          <TextInput
            placeholder="Contraseña"
            style={[styles.input, errorsTwo.password ? styles.inputError : {}]}
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={(text) => handleChange('password', text)}
            value={formTwo.password}
          />
          {errorsTwo.password ? <Text style={styles.errorMessage}>{errorsTwo.password}</Text> : null}

          <TextInput
            placeholder="Re-ingresa contraseña"
            style={[styles.input, errorsTwo.confirmPassword ? styles.inputError : {}]}
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={(text) => handleChange('confirmPassword', text)}
            value={formTwo.confirmPassword}
          />
          {errorsTwo.confirmPassword ? <Text style={styles.errorMessage}>{errorsTwo.confirmPassword}</Text> : null}
        </>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>Comenzar</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/images/salad.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
}
