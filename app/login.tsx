import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginStyles } from './styles/loginStyles';

const LoginScreen = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [mailError, setMailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    setMailError('');
    setPasswordError('');
    try {
      const response = await fetch('http://10.0.2.2:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mail,
          password: password,
        }),
      });

      console.log('data:', mail, password);

      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        await AsyncStorage.setItem('token', data.token);
        router.push('/home');
      } else {
        console.log('Login fallido:', data.message);

        if (data.message === 'password is wrong') {
          setPasswordError('Contraseña incorrecta');
        }
        if (data.message === 'email is wrong') {
          setMailError('Email incorrecto');
        }
        console.log('Error en el login:', data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error en la petición de login:', error);
      alert('Error de red o servidor');
    }
  };

  const handleForgotPassword = () => {
    if (!mail) {
      setMailError('Por favor, ingresa tu email primero');
      return;
    }
  
    router.push({
      pathname: '/passwordReset',
      params: { email: mail },
    });
  };
  
  return (
    <SafeAreaView style={loginStyles.safeArea}>
      <Image
        source={require('../assets/images/salad.png')}
        style={loginStyles.backgroundImage}
        resizeMode="cover"
      />

      <View style={loginStyles.contentWrapper}>
        <View style={loginStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="black" style={loginStyles.backarrow} />
          </TouchableOpacity>
          <View style={loginStyles.logoContainer}>
            <Image
              source={require('../assets/images/logoWhite.png')}
              style={loginStyles.centerlogo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={loginStyles.container}>
          <Text style={loginStyles.title}>Iniciar Sesión</Text>

          <TextInput
            style={[loginStyles.input, mailError ? loginStyles.inputError : {}]}
            placeholder="Mail"
            placeholderTextColor="#999"
            value={mail}
            onChangeText={setMail}
            autoCapitalize="none"
          />
          {mailError ? <Text style={loginStyles.errorMessage}>{mailError}</Text> : null}

          <TextInput
            style={[loginStyles.input, passwordError ? loginStyles.inputError : {}]}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={loginStyles.errorMessage}>{passwordError}</Text> : null}

          <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
            <Text style={loginStyles.loginButtonText}>Comenzar</Text>
          </TouchableOpacity>

          {/* Bloque corregido para recuperación de contraseña */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Text style={loginStyles.forgotPasswordText}>¿No recuerdas tu contraseña? </Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={loginStyles.forgotPasswordLink}>Recupérala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
