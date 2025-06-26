import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons,MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router'; // Para la navegación
import LogoHeader from './components/logoHeader';
import NavBar from './components/navBar';
import CustomAlertModal from './components/alert'; // Tu modal reutilizable
import { useProfileInfo } from '../hooks/hooks';



// Asumiendo que tendrás un archivo de estilos para el perfil
import { styles } from './styles/profileStyles'; // Crea este archivo

export default function ProfileScreen() {
  const [userName, setUserName] = useState(''); // Esto vendría de un estado global de usuario o props
  const [userEmail, setUserEmail] = useState(''); 
  const [isEliminateAccountVisible, setisEliminateAccountVisible] = useState(false);
  
  
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
    useProfileInfo(setUserName,setUserEmail);
  }, []);

  if (!fontsLoaded) {
    return null; // O un componente de carga mientras las fuentes se cargan
  }

  // Funciones para manejar la navegación o acciones
  const handleChangePassword = () => {
    // Implementar la navegación a la pantalla de cambiar contraseña
    console.log('Cambiar contraseña');
    router.push('/passwordReset'); // Asegúrate de que esta ruta exista
  };

  const handlePendingRecipes = () => {
    // Implementar la navegación a recetas pendientes de aprobación
    console.log('Recetas pendientes de aprobación');
    router.push('/pendingProfile'); // Asegúrate de que esta ruta exista
  };

  const handleDeleteAccount = () => {
    setisEliminateAccountVisible(true);
    
  };

  const handleEditProfile = () => {
    // Implementar la navegación o modal para editar el perfil
    console.log('Editar perfil');
    router.push('/editProfile'); // Asegúrate de que esta ruta exista
  };

  // Función para la navegación de la barra inferior
  const handleBottomNavPress = (screenName: string) => {
    console.log(`Navegar a: ${screenName}`);
  };

  const handleConfirmDelete = () => {
    setisEliminateAccountVisible(false);
    console.log('Cuenta eliminada');
    router.push('/login'); // Redirigir a la pantalla de inicio o donde sea necesario
  };

  return (
    <>
    <View style={{ flex: 1, backgroundColor: '#FFF', alignContent:"center" }}>
    <ScrollView style={[styles.container, { paddingTop: 80, marginBottom: 80, backgroundColor: '#FFF' }]}>
      <LogoHeader/>
        <View >
        <Text style={styles.greetingText}>¡Hola {userName}!</Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Datos</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <MaterialCommunityIcons name="pencil-box-outline" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.dataText}>Nombre: {userName}</Text>
          <Text style={styles.dataText}>Email: {userEmail}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={handleChangePassword}>
            <Feather name="lock" size={24} color="#000" />
            <Text style={styles.optionText}>Cambiar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handlePendingRecipes}>
            <Ionicons name="checkbox-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Recetas pendientes de aprobación</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={24} color="#B00020" />
            <Text style={[styles.optionText, { color: '#B00020' }]}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlertModal
           isVisible={isEliminateAccountVisible}
           message="¿Seguro que desea eliminar su cuenta?  Esta acción no es reversible" 
           onConfirm={handleConfirmDelete} 
           confirmText="Confirmar"
           showCancelButton={false}
         />

      {/* Barra de Navegación Inferior */}
    </ScrollView>
    <NavBar/>
    </View>

    </>
  );
}