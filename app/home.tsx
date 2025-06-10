import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ImageBackground } from 'react-native';
import styles from './styles/Styles';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from './components/navBar';
 import LogoHeader from './components/logoHeader'; 





 import featuredRecipesData from '../assets/data/featuredRecepies.json';
 import categoriesData from '../assets/data/categories.json';
import { NavigationContainer } from '@react-navigation/native';

   

   // Si estás usando fuentes personalizadas
   // const [fontsLoaded] = useFonts({ ... });
   // if (!fontsLoaded) {
   //   return <AppLoading />;
   // }

   const handleRecipePress = (recipeId: string) => {
     // Aquí iría la lógica para navegar a la pantalla de detalle de la receta
     console.log(`Receta tocada con ID: ${recipeId}`);
     router.push('/recipe'); // Cambia a la ruta correcta de tu pantalla de detalle
     // Ejemplo de navegación usando expo-router:
     // navigation.navigate('RecipeDetail', { id: recipeId });
   };

   const handleCategoryPress = (categoryId: string) => {
     // Aquí iría la lógica para navegar a la pantalla de la categoría
     console.log(`Categoría tocada con ID: ${categoryId}`);
     // Ejemplo de navegación usando expo-router:
     // navigation.navigate('CategoryRecipes', { category: categoryId });
   };

   const handleNavigationPress = (screen: string) => {
    if (screen == 'Search') {
      router.push('/SearchScreen'); // Corrected the typo in the path
    }
    if (screen == 'AddRecipe') {
        router.push('/createRecepieScreen'); // Corrected the typo in the path
      }
    console.log(`Navegar a: ${screen}`);
    // Ejemplo de navegación usando expo-router:
    // navigation.navigate(screen);
  };

  const Home = () => {
     return (
       <><ScrollView style={styles.containerHome} contentContainerStyle={{ paddingBottom: 80 }}>
           <LogoHeader />


           <Image
               source={require('../assets/images/homeBanner.jpg')}
               style={styles.homeBanner}
               resizeMode="cover" />


           <View style={styles.newSection}>
               <Text style={styles.sectionTitle}>¡Recetas que pueden gustarte!</Text>

               <TouchableOpacity style={styles.verMasButton}>
                   <Text style={styles.verMasText}>Ver más</Text>
               </TouchableOpacity>
           </View>

           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredRecipesContainer}>
               {featuredRecipesData.map((recipe) => (
                   <TouchableOpacity key={recipe.id} style={[styles.recipeCard ]} onPress={() => handleRecipePress(recipe.id)}>
                       <ImageBackground source={{ uri: recipe.imageUrl }} style={styles.recipeImage} imageStyle={{ opacity: 0.6 }}  resizeMode="cover">
                           <View style={styles.recipeTitleContainer}>
                               <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight:'500' }]}>{recipe.title}</Text>
                           </View>
                       </ImageBackground>
                   </TouchableOpacity>
               ))}
           </ScrollView>



           {/* Sección "Categorías" */}
           <Text style={styles.sectionTitle}>Categorías</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
               {categoriesData.map((category) => (
                   <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => handleCategoryPress(category.id)}>
                       
                       <ImageBackground source={{ uri: category.imageUrl }} style={styles.categoryImage} imageStyle={{ opacity: 0.6 }}  resizeMode="cover">
                           <View style={styles.recipeTitleContainer}>
                               <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight:'500' }]}>{category.title}</Text>
                           </View>
                       </ImageBackground>
                   </TouchableOpacity>
               ))}
           </ScrollView>
     </ScrollView>
     <BottomNavigation />
     </>
 )};


 export default Home;