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


import { styles } from './styles/profileStyles'; 
import LogoHeader from './components/logoHeader';
import { editProfile, useProfileInfo } from '../hooks/hooks';

const PasswordReset = () => {

  const navigation = useNavigation();
  const [newUser, setNewUser] = useState('');
  const [newMail, setNewMail] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);



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
  
  const [oldName, setOldName] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  useProfileInfo(setOldName, setOldEmail); 

  const handleConfirm = async () => {
    const success = await editProfile(newUser, newMail, oldName, oldEmail);
    if (success) {
      setNewMail('');
      setNewUser('');
      setIsSuccessModalVisible(true);

      setTimeout(() => {
        setIsSuccessModalVisible(false);
        navigation.goBack();
      }, 1500); 
    }
  };



  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
     
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <LogoHeader />
        </View>

        <View style={styles.containerEdit}>
          <Text style={styles.title}>Editar Perfil</Text>
          
              <TextInput
              style={[styles.input]}
              placeholder="Usuario"
              value={newUser}
              onChangeText={setNewUser}/>
              <TextInput
              style={[styles.input]}
              placeholder="Mail"
              value={newMail}
              onChangeText={setNewMail}/>
               <TouchableOpacity style={styles.loginButton} onPress={handleConfirm}>
                  <Text style={styles.loginButtonText}>Confirmar</Text>
                </TouchableOpacity>
        </View>
        <CustomAlertModal
           isVisible={isSuccessModalVisible}
           message="Perfil editado correctamente"
           showCancelButton={false}
           onCancel={() => setIsSuccessModalVisible(false)}
         /> 

      </View>

      
    </SafeAreaView>
  );
};

export default PasswordReset;