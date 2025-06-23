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
import { useCreatedRecipes, useSavedRecipes } from '../hooks/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  name: string;
  alias: string;
  email: string;
}

const ProfileRecipesScreen =  () => {
 

  const [profile, setProfile] = useState<UserProfile | null>({
    id: '4554403b-da2e-4d55-872d-e66c374594c5',
    name: 'Delfina',
    alias: 'Delfina',
    email: 'delfinapiendi@gmail.com',
  });

  const { recipes: recipesCreated, loading: loadingCreated } = useCreatedRecipes();

  const { recipesSaved, loadingSaved } = useSavedRecipes();

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });
  useEffect(() => {
    console.log('Render actualizado - recipesSaved:', recipesSaved);
  }, [recipesSaved]);
  

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

  return (
    <View style={profileStyles.container}>
      <ScrollView contentContainerStyle={profileStyles.scrollViewContent}>
        <LogoComponent />
        <Text style={profileStyles.userName}>{profile?.alias || 'Usuario'}</Text>
        <View style={profileStyles.divider} />

        <View style={profileStyles.infoContainer}>
          <View style={profileStyles.infoBox}>
            <Text style={profileStyles.infoLabel}>Valoración Promedio</Text>
            <View style={profileStyles.ratingDisplay}>
              <Text style={profileStyles.infoValue}>{overallAverageRating.toFixed(1)}/10</Text>
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
            <TouchableOpacity onPress={handleVerMas}>
              <Text style={profileStyles.viewMoreText}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={profileStyles.featuredRecipesContainer}>
            {recipesCreated.slice(0, 5).map((recipe) => (
              <TouchableOpacity key={recipe.id} style={profileStyles.recipeCard} onPress={() => handleRecipePress(recipe.id)}>
                <ImageBackground source={{ uri: recipe.image }} style={profileStyles.recipeImage} imageStyle={{ opacity: 0.6 }} resizeMode="cover">
                  <View style={profileStyles.recipeTitleContainer}>
                    <Text style={[profileStyles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight: '500' }]}>{recipe.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {recipesCreated.length === 0 && (
            <Text style={profileStyles.noRecipesText}>No has creado ninguna receta aún.</Text>
          )}
        </View>

        <View style={profileStyles.section}>
          <View style={profileStyles.sectionHeader}>
            <Text style={profileStyles.sectionTitle}>Guardadas</Text>
            <TouchableOpacity onPress={handleViewMoreGuardadas}>
              <Text style={profileStyles.viewMoreText}>Ver más</Text>
            </TouchableOpacity>
          </View>
          {loadingSaved ? ( // Muestra un indicador de carga
            <ActivityIndicator size="small" color="#FF9A16" />
          ) : recipesSaved.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={profileStyles.featuredRecipesContainer}>
              {recipesSaved.slice(0, 5).map((recipe) => (
                <TouchableOpacity key={recipe.id} style={profileStyles.recipeCard} >
                  <ImageBackground source={{ uri: recipe.image }} style={profileStyles.recipeImage} imageStyle={{ opacity: 0.6 }} resizeMode="cover">
                    <View style={profileStyles.recipeTitleContainer}>
                      <Text style={[profileStyles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight: '500' }]}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={profileStyles.noRecipesText}>No has guardado ninguna receta aún.</Text>
          )}
        </View>
      </ScrollView>
      <NavBarComponent />
    </View>
  );
};

export default ProfileRecipesScreen;