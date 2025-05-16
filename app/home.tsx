import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ImageBackground } from 'react-native';
import styles from './styles/Styles';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


// Importa tus fuentes si las estás utilizando
 // import { useFonts, ... } from '@expo-google-fonts/work-sans';
 // import AppLoading from 'expo-app-loading';

 // Importa los datos desde tus archivos JSON
 import featuredRecipesData from '../assets/data/featuredRecepies.json';
 import categoriesData from '../assets/data/categories.json';

   

   // Si estás usando fuentes personalizadas
   // const [fontsLoaded] = useFonts({ ... });
   // if (!fontsLoaded) {
   //   return <AppLoading />;
   // }

   const handleRecipePress = (recipeId: string) => {
     // Aquí iría la lógica para navegar a la pantalla de detalle de la receta
     console.log(`Receta tocada con ID: ${recipeId}`);
     router.push('/RecepieDetailScreen'); // Cambia a la ruta correcta de tu pantalla de detalle
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
    console.log(`Navegar a: ${screen}`);
    // Ejemplo de navegación usando expo-router:
    // navigation.navigate(screen);
  };

  const Home = () => {
     return (
       <><ScrollView style={styles.containerHome} contentContainerStyle={{ paddingBottom: 80 }}>
           <View style={styles.logoContainer}>
               <Image
                   source={require('../assets/images/logoWhite.png')}
                   style={styles.logo}
                   resizeMode="contain" />
           </View>

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
     <View style={styles.bottomNavigation}>
             <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Home')}>
                 <Ionicons name="home-outline" size={24} color="#FF9A16" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Search')}>
                 <Ionicons name="search-outline" size={24} color="#333" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('AddRecipe')}>
                 <View style={styles.addButton}>
                     <Ionicons name="add" size={32} color="#000000" />
                 </View>
             </TouchableOpacity>
             <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Bookmarks')}>
                 <Ionicons name="book-outline" size={24} color="#333" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Profile')}>
                 <Ionicons name="person-outline" size={24} color="#333" />
             </TouchableOpacity>
         </View>
     </>
 )};


 export default Home;