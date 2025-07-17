import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import styles from './styles/Styles';
import { router } from 'expo-router';
import { useRecipes, useCategoryNavigation } from '../hooks/hooks';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from './components/navBar';
import LogoHeader from './components/logoHeader'; 
import categoriesData from '../assets/data/categories.json';
import CustomAlertModal from './components/alert'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [isCategoryNonExistVisible, setIsCategoryNonExistVisible] = useState(false);
  const { recipes, fetchRecipes } = useRecipes();
  const { handleCategoryPress } = useCategoryNavigation(setIsCategoryNonExistVisible);

  useEffect(() => {
    fetchRecipes();
    

  }, []);

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe?id=${recipeId}`);
  };

  const handleVerMas = () => {
    fetchRecipes();
    const recipesString = encodeURIComponent(JSON.stringify(recipes));
    router.push({
      pathname: '/viewMore',
      params: {
        recipes: recipesString,
        title: '¡Recetas que pueden gustarte!',
      },
    });
  };

  

  const closeModalSuccess = () => {
    setIsCategoryNonExistVisible(false);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={styles.containerHome} contentContainerStyle={{ paddingBottom: 80 }}>
          <LogoHeader />

          <Image
            source={require('../assets/images/homeBanner.jpg')}
            style={styles.homeBanner}
            resizeMode="cover"
          />

          <View style={styles.newSection}>
            <Text style={styles.sectionTitle}>¡Recetas que pueden gustarte!</Text>
            <TouchableOpacity style={styles.verMasButton} onPress={handleVerMas}>
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredRecipesContainer}>
            {recipes.slice(0, 5).map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => handleRecipePress(recipe.id)}>
                <ImageBackground
                  source={{ uri: recipe.imageUrl }}
                  style={styles.recipeImage}
                  imageStyle={{ opacity: 0.6 }}
                  resizeMode="cover"
                >
                  <View style={styles.recipeTitleContainer}>
                    <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight: '500' }]}>
                      {recipe.title}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categoriesData.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => handleCategoryPress(category.id)}>
                <ImageBackground
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryImage}
                  imageStyle={{ opacity: 0.6 }}
                  resizeMode="cover"
                >
                  <View style={styles.recipeTitleContainer}>
                    <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight: '500' }]}>
                      {category.title}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
        <BottomNavigation />
      </View>

      <CustomAlertModal
        isVisible={isCategoryNonExistVisible}
        message="Todavía no existen recetas en esta categoría"
        onConfirm={closeModalSuccess}
        confirmText="Aceptar"
        showCancelButton={false}
      />
    </>
  );
};

export default Home;
