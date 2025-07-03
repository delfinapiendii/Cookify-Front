import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginStyles } from './styles/loginStyles';
import { handleLogin, decodeJWT } from '../hooks/hooks';
import * as SecureStore from 'expo-secure-store';
import CustomAlertModal from './components/alert';



const LoginScreen = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [mailError, setMailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSaveCredentials, setshowSaveCredentials] = useState(false);
  const [showWantUseCredentials, setshowWantUseCredentials] = useState(false);
  const slideAnim = useState(new Animated.Value(200))[0]; // Empieza 200px abajo



  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);
  
  useEffect(() => {
    const checkSavedCredentials = async () => {
      const email = await SecureStore.getItemAsync('mail');
      const pass = await SecureStore.getItemAsync('password');

      if (email && pass) {
        setMail(email);
        setPassword(pass);
        setshowWantUseCredentials(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    };

    checkSavedCredentials();
  }, []);
  const loginWithSavedCredentials = async () => {
    const email = await SecureStore.getItemAsync('mail');
    const pass = await SecureStore.getItemAsync('password');
    setMail(email);
    setPassword(pass);
    const { success, message, token } = await handleLogin(mail, password);

    if (success) {
      try {
        const decoded = decodeJWT(token);
        await AsyncStorage.setItem('userid', decoded.id);
        await AsyncStorage.setItem('token', token);
        router.push('/home');
      } catch (error) {
        console.error('Error al guardar token:', error);
      }
    } else {
      console.log('Error en el login con credenciales guardadas:', message || 'Error desconocido');
    }
    console.log('Logueando con:', email, pass);
    setshowWantUseCredentials(false);
  };

  const handleLoginPress = async () => {
    setMailError('');
    setPasswordError('');

    const { success, message, token } = await handleLogin(mail, password);

    if (success) {
      try {
        const decoded = decodeJWT(token);
        await AsyncStorage.setItem('userid', decoded.id);
        await AsyncStorage.setItem('token', token);
        setshowSaveCredentials(true);
      } catch (error) {
        console.error('Error al guardar token:', error);
      }
    } else {
      if (message === 'password is wrong') {
        setPasswordError('Contraseña incorrecta');
      }
      if (message === 'email is wrong') {
        setMailError('Email incorrecto');
      }
      console.log('Error en el login:', message || 'Error desconocido');
    }
  };
  const handleConfirmSaveCredentials = async () => {
    setshowSaveCredentials(false);
    try {
      await SecureStore.setItemAsync('mail', mail);
      await SecureStore.setItemAsync('password', password);
      console.log('Credenciales guardadas correctamente');      
      router.push('/home');
    } catch (error) {
      console.error('Error al guardar las credenciales:', error);
    }   
}
  const handleNotSaveCredentials = () => {
    setshowSaveCredentials(false);
    router.push('/home');
  };
  const handleRejectSavedCredentials = () => {
    setshowWantUseCredentials(false);
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
          <TouchableOpacity style={loginStyles.loginButton} onPress={handleLoginPress}>
            <Text style={loginStyles.loginButtonText}>Comenzar</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Text style={loginStyles.forgotPasswordText}>¿No recuerdas tu contraseña? </Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={loginStyles.forgotPasswordLink}>Recupérala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CustomAlertModal
            isVisible={showSaveCredentials}
            message="¿Deseas guardar tus credenciales de acceso?"
            onConfirm={handleConfirmSaveCredentials}
            onCancel={handleNotSaveCredentials}
            confirmText="Sí"
            cancelText="No"
            showCancelButton={true}
          />
        {showWantUseCredentials && (
          <Animated.View
            style={[
              loginStyles.modal,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              onPress={handleRejectSavedCredentials}
              style={loginStyles.closeIcon}
            >
              <Ionicons name="close" size={22} color="black" />
            </TouchableOpacity>

            <Text style={loginStyles.modalText}>
              ¿Iniciar sesión en Cookify con su mail guardado{"\n"}"{mail}"?
            </Text>
            <TouchableOpacity style={loginStyles.confirmBtn} onPress={loginWithSavedCredentials}>
              <Text style={loginStyles.confirmBtnText}>Iniciar con credenciales</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

    </SafeAreaView>
  );
};

export default LoginScreen;
