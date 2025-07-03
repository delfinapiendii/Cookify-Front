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
import { loadPendingRecipes } from '../hooks/hooks';

const pendingProfile = () => {

  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);  


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
      loadPendingRecipes(setRecipes);
  }, []);
  interface PendingRecipe {
    id: string;
    title: string;
    image: string;  
    estado: string; 
    createdAt: string; 
  }
  




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
          <Text style={styles.title}>Recetas Pendientes</Text>
          <Text style={styles.infoText}>Todas las recetas previas a publicación son aprobadas por nuestro equipo. {''}Puedes seguir aquí el estado de las recetas que creaste.</Text>
         <View style={styles.divider} />
        </View>
      </View>

      <View style={styles.recipesListContainer}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeItemContainer} // Apply new style
            >
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={1}>{recipe.title}</Text>
                <Text style={styles.recipeStatus}>Estado: En proceso de revisión</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRecipesText}>No hay recetas pendientes.</Text>
        )}
      </View>
      
    </SafeAreaView>
  );
};

export default pendingProfile;