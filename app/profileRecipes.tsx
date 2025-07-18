import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import profileStyles from './styles/profileRecipesStyles';
import RecipeGrid from './components/recipeGrid';
import LogoComponent from './components/logoHeader';
import NavBarComponent from './components/navBar';
import { router } from 'expo-router';
import { useCreatedRecipes, useSavedRecipes, useProfileInfo } from '../hooks/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  name: string;
  alias: string;
  email: string;
}

const ProfileRecipesScreen =  () => {
 

  const [userName, setUserName] = useState(''); // Esto vendría de un estado global de usuario o props
  const [userEmail, setUserEmail] = useState(''); 

  const { recipes: recipesCreated, loading: loadingCreated } = useCreatedRecipes();

  const { recipesSaved, loadingSaved } = useSavedRecipes();

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });
  
  useEffect(() => {
    useProfileInfo(setUserName,setUserEmail);
  }, []);

  

  useEffect(() => {
    const manejarSplash = async () => {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    };
    manejarSplash();
  }, [fontsLoaded]);

  const sumRatings = recipesCreated.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const overallAverageRating = recipesCreated.length > 0 ? (sumRatings / recipesCreated.length) : 0;

  const handleRecipePress = (id: string) => {
    router.push(`/recipe?id=${id}`); 
  };

  const handleVerMas = () => {
    const recipesString = encodeURIComponent(JSON.stringify(recipesCreated));
    router.push({
      pathname: '/viewMore',
      params: {
        recipes: recipesString,
        title: 'Tus recetas creadas'
      },
    });
  };
  const handleViewMoreGuardadas = () => {
    const recipesString = encodeURIComponent(JSON.stringify(recipesSaved));
    router.push({
      pathname: '/viewMore',
      params: {
        recipes: recipesString,
        title: 'Tus recetas guardadas'
      },
    });
  };

  const handleEditRecipe = (recipeId: string) => {
    router.push({
      pathname: "/editRecipe", // <--- DEBE coincidir con el path de tu archivo editRecipe.tsx
      params: { id: recipeId }
    });
  };
  const handleGoToCreateRecipe = () => {
    //router.push('/create-recipe'); // Asumiendo que '/create-recipe' es tu ruta para crear
  };

  return (
    <View style={profileStyles.container}>
      <ScrollView contentContainerStyle={profileStyles.scrollViewContent}>
        <LogoComponent />
        <Text style={profileStyles.userName}>{userName || 'Usuario'}</Text>
        <View style={profileStyles.divider} />

        <View style={profileStyles.infoContainer}>
          <View style={profileStyles.infoBox}>
            <Text style={profileStyles.infoLabel}>Valoración Promedio</Text>
            <View style={profileStyles.ratingDisplay}>
              <Text style={profileStyles.infoValue}>{overallAverageRating.toFixed(1)}/5</Text>
              <Ionicons name="star" size={18} color="#00000" />
            </View>
          </View>
          <View style={profileStyles.infoBox}>
            <Text style={profileStyles.infoLabel}>Recetas Creadas</Text>
            <View style={profileStyles.createdRecipesBox}>
              <Text style={profileStyles.createdRecipesCount}>{recipesCreated.length}</Text>
            </View>
          </View>
        </View>

        <View style={profileStyles.divider} />

        <View style={profileStyles.section}>
          <View style={profileStyles.sectionHeader}>
            <Text style={profileStyles.sectionTitle}>Tus recetas creadas</Text>
            {/* El botón "Ver más" solo si hay recetas */}
            {recipesCreated.length > 0 && (
              <TouchableOpacity onPress={handleVerMas}>
                <Text style={profileStyles.viewMoreText}>Ver más</Text>
              </TouchableOpacity>
            )}
          </View>
          {loadingCreated ? (
            <ActivityIndicator size="large" color="#FF9A16" style={profileStyles.loadingIndicator} />
          ) : (
            <RecipeGrid
              recipes={recipesCreated}
              onRecipePress={handleRecipePress}
              showEditButton={true} // Mostrar el botón de editar en cada tarjeta
              onEditPress={(recipe) => handleEditRecipe(recipe.id)}
              emptyMessage="No has creado ninguna receta aún."
            />
          )}
        </View>
        <View style={profileStyles.section}>
          <View style={profileStyles.sectionHeader}>
            <Text style={profileStyles.sectionTitle}>Guardadas</Text>
            {/* El botón "Ver más" solo si hay recetas */}
            {recipesSaved.length > 0 && (
              <TouchableOpacity onPress={handleViewMoreGuardadas}>
                <Text style={profileStyles.viewMoreText}>Ver más</Text>
              </TouchableOpacity>
            )}
          </View>
          {loadingCreated ? (
            <ActivityIndicator size="large" color="#FF9A16" style={profileStyles.loadingIndicator} />
          ) : (
            // Usa el nuevo componente RecipeGrid aquí para las recetas creadas

            <RecipeGrid
            recipes={recipesSaved.map((r: any) => ({ ...r, rating: Number(r.rating) }))}
            onRecipePress={(id) => handleRecipePress(id)}
            />
          )}
        </View>


      </ScrollView>
      <NavBarComponent />
    </View>
  );
};

export default ProfileRecipesScreen;