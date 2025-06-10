import React, { useState } from 'react';
 import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
 import styles from './styles/registerStyles'; // Asegúrate de que esta ruta sea correcta
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

   // Estados para los mensajes de error
   const [usernameError, setUsernameError] = useState('');
   const [nameError, setNameError] = useState('');

   const [emailError, setEmailError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [confirmPasswordError, setConfirmPasswordError] = useState('');
   const [aliasSuggestions, setAliasSuggestions] = useState<string[]>([]);


   // Nuevo estado para controlar la fase del registro
   const [registrationPhase, setRegistrationPhase] = useState(1); // 1: Usuario/Email/Nombre, 2: Contraseña/Confirmación

   const handleInputChange = (field: string, value: string) => {
     setForm({ ...form, [field]: value });
     // Limpiar el error cuando el usuario empieza a escribir de nuevo
     if (field === 'username') setUsernameError('');
     if (field === 'email') setEmailError('');
     if (field === 'password') setPasswordError('');
     if (field === 'confirmPassword') setConfirmPasswordError('');
   };

   const handleSubmit = async () => {
    const { email, username, name, password, confirmPassword } = form;

     setUsernameError('');
     setEmailError('');
     setPasswordError('');
     setConfirmPasswordError('');
   
     let hasError = false;

     if (registrationPhase === 1) {
       if (!username) {
         setUsernameError('Completa el campo de usuario');
         hasError = true;
       }
       if (!name) { 
          setNameError('Completa el campo de nombre');
         hasError = true; 
       }
       if (!email) {
         setEmailError('Completa el campo de email');
         hasError = true;
       }
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (email && !emailRegex.test(email)) { // Validar solo si el campo no está vacío
         setEmailError('Por favor, ingresa un email válido');
         hasError = true;
       }

       if (hasError) {
        return;
      }
      
      // Llamar al backend
      try {
        const response = await fetch('http://10.0.2.2:3000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: form.email,
            alias: form.username, // alias es el username en tu frontend
            name: form.name
          })
        });
        console.log('Response:', response);
        console.log('data:', form);

      
        if (!response.ok) {
          const errorData = await response.json();
        
          if (errorData.emailDuplicado) {
            setEmailError('El email ya está en uso');
          }
        
          if (errorData.sugerenciasAlias && errorData.aliasDuplicado) {
            setAliasSuggestions(errorData.sugerenciasAlias);
          }
          
        
          return;
        }
        
        setRegistrationPhase(2);       
      } catch (error) {
        Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
      }
      
      
       
     } else if (registrationPhase === 2) {
       // Lógica de validación para la FASE 2 (Contraseña)
       if (!password) {
         setPasswordError('Completa el campo de contraseña');
         hasError = true;
       }
       if (!confirmPassword) {
         setConfirmPasswordError('Completa el campo de confirmación de contraseña');
         hasError = true;
       }

       // Validar contraseña: al menos 6 caracteres, una mayúscula, una minúscula y un número
       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
       if (password && !passwordRegex.test(password)) { // Validar solo si el campo no está vacío
         setPasswordError('La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y números');
         hasError = true;
       }
     
       // Validar que las contraseñas coincidan
       if (password && confirmPassword && password !== confirmPassword) { // Validar solo si ambos campos no están vacíos
         setConfirmPasswordError('Las contraseñas no coinciden');
         hasError = true;
       }

       if (hasError) {
         return; // Detener la ejecución si hay errores en esta fase
       }

       try {
        const response = await fetch('http://10.0.2.2:3000/api/v1/auth/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: form.email, // ya lo tenés guardado desde la fase 1
            password: form.password
          })
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert('Error al completar registro', errorData.message || 'Error desconocido');
          return;
        }
      
        router.push('/home');
      } catch (error) {
      }
      
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
             source={require('../assets/images/logoWhite.png')}
             style={styles.centerlogo}
             resizeMode="contain"
           />
         </View>
       </View>
       
       {registrationPhase === 1 && ( // Mostrar estos campos solo en la Fase 1
         <>
           <Text style={styles.title}>Registrarse</Text>
           <TextInput
             placeholder="Usuario"
             style={[styles.input, usernameError ? styles.inputError : {}]}
             placeholderTextColor="#aaa"
             onChangeText={(text) => handleInputChange('username', text)}
             value={form.username}
           />
           {aliasSuggestions.length > 0 && (
            <View style={{ marginVertical: 5,marginLeft: 10,marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Sugerencias disponibles:</Text>
              {aliasSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => {
                    handleInputChange('username', suggestion);
                    setAliasSuggestions([]);
                    setUsernameError('');
                  }}
                >
                  <Text style={{ color: '#FF9A16', fontSize: 14 }}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

           {usernameError ? <Text style={styles.errorMessage}>{usernameError}</Text> : null}

           <TextInput
             placeholder="Nombre"
             style={[styles.input, nameError ? styles.inputError : {}]}
             placeholderTextColor="#aaa"
             onChangeText={(text) => handleInputChange('name', text)}
             value={form.name}
           />
            {nameError ? <Text style={styles.errorMessage}>{nameError}</Text> : null}


           <TextInput
             placeholder="Mail"
             style={[styles.input, emailError ? styles.inputError : {}]}
             placeholderTextColor="#aaa"
             keyboardType="email-address"
             onChangeText={(text) => handleInputChange('email', text)}
             value={form.email}
           />
           {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
         </>
       )}

       {registrationPhase === 2 && ( // Mostrar estos campos solo en la Fase 2
         <>
            <Text style={styles.titleContrasena}>Ingrese una contraseña para completar registro</Text>
            <TextInput
             placeholder="Contraseña"
             style={[styles.input, passwordError ? styles.inputError : {}]}
             placeholderTextColor="#aaa"
             secureTextEntry
             onChangeText={(text) => handleInputChange('password', text)}
             value={form.password}
           />
           {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

           <TextInput
             placeholder="Re-ingresa contraseña"
             style={[styles.input, confirmPasswordError ? styles.inputError : {}]}
             placeholderTextColor="#aaa"
             secureTextEntry
             onChangeText={(text) => handleInputChange('confirmPassword', text)}
             value={form.confirmPassword}
           />
           {confirmPasswordError ? <Text style={styles.errorMessage}>{confirmPasswordError}</Text> : null}
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