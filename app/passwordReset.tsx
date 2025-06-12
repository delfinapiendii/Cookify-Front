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


import { loginStyles } from './styles/loginStyles'; 

const PasswordReset = () => {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [IsSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  const [currentPhase, setCurrentPhase] = useState('verifyCode');

  const navigation = useNavigation();
  const { email } = useLocalSearchParams(); 

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

  useEffect(() => {
    const sendResetEmail = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/api/v1/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Código enviado correctamente:', data.message);
          setEmailSent(true);
        } else {
          console.error('Error al enviar código:', data.message);
          //OOPS
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        //OOPS
      }
    };

    if (email) {
      sendResetEmail();
    }
  }, [email]);

  const handleConfirmCode = async () => {
    if (!code) {
      setCodeError('Por favor ingrese el código');
      return;
    }
    setCodeError('');
  
    try {
      const response = await fetch('http://10.0.2.2:3000/api/v1/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Código verificado:', data.message);
  
        setCurrentPhase('setNewPassword');
      } else {
        console.error('Código incorrecto:', data.message);
        setCodeError('El código ingresado es incorrecto o ha expirado');
      }
    } catch (error) {
      console.error('Error en la petición de verificación:', error);
    //OOPS
        }
  };
  const handleSetNewPassword = async () => {
    setNewPasswordError('');
    setConfirmNewPasswordError('');

    let hasPassError = false;

    if (!newPassword) {
      setNewPasswordError('Por favor ingrese la nueva contraseña');
      hasPassError = true;
    }
    if (!confirmNewPassword) {
      setConfirmNewPasswordError('Por favor re-ingrese la contraseña');
      hasPassError = true;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      setNewPasswordError('La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y números');
      hasPassError = true;
    }
  
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('Las contraseñas no coinciden');
      hasPassError = true;
    }

    if (hasPassError) {
      return; 
    }

    try {
      
      const response = await fetch('http://10.0.2.2:3000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code,newPassword }), 
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccessModalVisible(true);
      } else {
        console.error('No se pudo restablecer la contraseña:', data.message);

      }
    } catch (error) {
      console.error('Error en la petición de restablecimiento:', error);
      //OOPS
    }
  };

  const handleConfirm = () => {
    setIsSuccessModalVisible(false);
    router.push('/login'); 

  };



  if (!fontsLoaded) return null;

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
          <Text style={loginStyles.title}>Recupero de contraseña</Text>

          {currentPhase === 'verifyCode' ? (
            // Fase para ingresar y verificar el código
            <>
              <Text style={loginStyles.emailResetText}>
                Ingrese el código enviado a {'\n'}{email}
              </Text>

              <TextInput
                style={[loginStyles.input, codeError ? loginStyles.inputError : {}]}
                placeholder="XXXXXX"
                placeholderTextColor="#123456"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
                keyboardType="numeric" // Asumiendo que el código es numérico
              />
              {codeError ? <Text style={loginStyles.errorMessage}>{codeError}</Text> : null}

              <TouchableOpacity style={loginStyles.loginButton} onPress={handleConfirmCode}>
                <Text style={loginStyles.loginButtonText}>Verificar Código</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Fase para ingresar la nueva contraseña
            <>
              <Text style={loginStyles.emailResetText}>
                Ingrese su nueva contraseña
              </Text>

              <TextInput
                style={[loginStyles.input, newPasswordError ? loginStyles.inputError : {}]}
                placeholder="Contraseña"
                placeholderTextColor="#123456"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              {newPasswordError ? <Text style={loginStyles.errorMessage}>{newPasswordError}</Text> : null}

              <TextInput
                style={[loginStyles.input, confirmNewPasswordError ? loginStyles.inputError : {}]}
                placeholder="Re-ingrese contraseña"
                placeholderTextColor="#123456"
                secureTextEntry
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              {confirmNewPasswordError ? <Text style={loginStyles.errorMessage}>{confirmNewPasswordError}</Text> : null}

              <TouchableOpacity style={loginStyles.loginButton} onPress={handleSetNewPassword}>
                <Text style={loginStyles.loginButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <CustomAlertModal
           isVisible={IsSuccessModalVisible}
           title=""
           message="Contraseña cambiada con éxito"
           onConfirm={handleConfirm}
           confirmText="Volver al incio"
           showCancelButton={true}
         />
    </SafeAreaView>
  );
};

export default PasswordReset;