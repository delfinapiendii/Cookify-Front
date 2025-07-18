import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons,MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router'; // Para la navegación
import LogoHeader from './components/logoHeader';
import NavBar from './components/navBar';
import CustomAlertModal from './components/alert'; // Tu modal reutilizable
import { useProfileInfo , useDeleteProfile} from '../hooks/hooks';



import { styles } from './styles/profileStyles'; 

export default function ProfileScreen() {
  const [userName, setUserName] = useState(''); 
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
    return null; 
  }

  const handleChangePassword = () => {
    router.push('/passwordReset');
  };

  const handlePendingRecipes = () => {
    router.push('/pendingProfile'); 
  };
  const handleLogOut = () => {
    router.push('/'); 
  };

  const handleDeleteAccount = () => {
    setisEliminateAccountVisible(true);
    
  };

  const handleEditProfile = () => {
    console.log('Editar perfil');
    router.push('/editProfile'); 
  };

  const handleBottomNavPress = (screenName: string) => {
    console.log(`Navegar a: ${screenName}`);
  };

  const handleConfirmDelete = () => {
    setisEliminateAccountVisible(false);
    useDeleteProfile();
    console.log('Cuenta eliminada');
    router.push('/'); 
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

          <TouchableOpacity style={styles.optionItem} onPress={handleLogOut}>
            <Ionicons name="log-out-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Cerrar sesión</Text>
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
           cancelText='Cancelar'
           onCancel={() => setisEliminateAccountVisible(false)}
         />

    </ScrollView>
    <NavBar/>
    </View>

    </>
  );
}