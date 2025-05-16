import React, { useState } from 'react';
 import {
   ScrollView,
   View,
   Text,
   Image,
   TouchableOpacity,
   StyleSheet,
   Modal,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { router, useNavigation } from 'expo-router';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import styles from './styles/Styles';

 import { SearchBar } from '@rneui/themed'; // Usando React Native Elements para la barra de búsqueda
 import { FontAwesome } from '@expo/vector-icons'; // Para el icono de ordenar

 // Importa tus datos de recetas (simulados por ahora)
 import recipesData from '../assets/data/recepie.json'; // Crea este archivo JSON

 const SearchScreen = () => {
   const navigation = useNavigation();
   const [isFilterModalVisible, setFilterModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
   const [isSortModalVisible, setSortModalVisible] = useState(false); // Nuevo estado para el modal de ordenar


   const [fontsLoaded] = useFonts({
     WorkSans_400Regular,
     WorkSans_700Bold,
   });
   const [searchQuery, setSearchQuery] = useState('');

   React.useEffect(() => {
     if (!fontsLoaded) {
       SplashScreen.preventAutoHideAsync();
     } else {
       SplashScreen.hideAsync();
     }
   }, [fontsLoaded]);

   if (!fontsLoaded) {
     return null;
   }

   const updateSearch = (text: React.SetStateAction<string>) => {
     setSearchQuery(text);
     // Aquí iría la lógica para filtrar las recetas basadas en la búsqueda
     console.log('Buscando:', text);
   };

   const handleRecipePress = (recipeId: string) => {
     console.log(`Receta tocada con ID: ${recipeId}`);
     // navigation.navigate('RecipeDetail', { id: recipeId });
   };

   const handleNavigationPress = (screen: string) => {
    if (screen == 'Search') {
      router.push('/SearchScreen'); // Corrected the typo in the path
    }
    else if (screen == 'Home') {
      router.push('/home'); // Corrected the typo in the path
    }
    console.log(`Navegar a: ${screen}`);
   };
   const toggleFilterModal = () => {
    setFilterModalVisible(!isFilterModalVisible);
  };
  const toggleSortModal = () => {
    setSortModalVisible(!isSortModalVisible);
  };

   

   return (
     <>
     <ScrollView style={[styles.containerHome, { paddingTop: 80 , marginBottom:80}]}>
       {/* Logo */}
       <View style={styles.logoContainer}>
         <Image
           source={require('../assets/images/logoWhite.png')}
           style={styles.logo}
           resizeMode="contain" />
       </View>


       <SearchBar
         placeholder="Buscar Receta"
         onChangeText={updateSearch}
         value={searchQuery}
         lightTheme
         round
         containerStyle={styles.searchBarContainer}
         inputContainerStyle={styles.searchBarInputContainer}
         inputStyle={styles.searchBarInput}
         searchIcon={<Ionicons name="search-outline" size={24} color="#86939e" />}
         clearIcon={<Ionicons name="close-circle-outline" size={24} color="#86939e" onPress={() => updateSearch('')} />} />

       {/* Filtros y Ordenar por */}
       <View style={styles.filtersContainer}>
         <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
           <Ionicons name="filter-outline" size={20} color="#FF9A16" style={{ marginRight: 5 }} />
           <Text style={[styles.filterButtonText, { fontFamily: 'WorkSans_400Regular' }]}>Filtros (2)</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.sortButton} onPress={toggleSortModal}>
           <FontAwesome name="sort-amount-desc" size={20} color="#888" style={{ marginRight: 5 }} />
           <Text style={[styles.sortButtonText, { fontFamily: 'WorkSans_400Regular' }]}>Ordenar por</Text>
         </TouchableOpacity>
       </View>

       {/* Resultados de la búsqueda */}
       <Text style={styles.resultsCount}>700 Recetas Encontradas</Text>
       <View style={styles.searchResultsContainer}>
         {recipesData.map((recipe) => (
           <TouchableOpacity key={recipe.id} style={styles.recipeCardS} onPress={() => handleRecipePress(recipe.id)}>
             <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImageS} resizeMode="cover" />
             <View style={styles.recipeInfo}>
               <Text style={[styles.recipeTitleS, { fontFamily: 'WorkSans_400Regular' }]}>{recipe.title}</Text>
               <View style={styles.ratingContainer}>
                 <Text style={styles.rating}>{recipe.rating}</Text>
                 <Ionicons name="star" size={16} color="#FFC107" />
               </View>
               <Text style={styles.chef}>@{recipe.chef}</Text>
             </View>
           </TouchableOpacity>
         ))}
       </View>
     </ScrollView>


        {/* Modal de Filtros */}
        <Modal
         animationType="slide"
         transparent={true}
         visible={isFilterModalVisible}
         onRequestClose={toggleFilterModal}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Filtrar</Text>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Nombre</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Ingredientes</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Categoría</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Sin el ingrediente</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalCloseButton} onPress={toggleFilterModal}>
               <Text style={styles.modalCloseButtonText}>Cerrar</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

        {/* Modal de Ordenar Por */}
        <Modal
         animationType="slide"
         transparent={true}
         visible={isSortModalVisible}
         onRequestClose={toggleSortModal}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Ordenar por</Text>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={[styles.modalOptionText, { color: '#FF9A16' }]}>De A a Z</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>De Z a A</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Novedad</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalOption}>
               <Text style={styles.modalOptionText}>Usuario</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalCloseButton} onPress={toggleSortModal}>
               <Text style={styles.modalCloseButtonText}>Cerrar</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>


     <View style={styles.bottomNavigation}>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Home')}>
           <Ionicons name="home-outline" size={24} color="#333" />
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Search')}>
           <Ionicons name="search-outline" size={24} color="#FF9A16" />
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
       </View></>
   );
 };

 
 export default SearchScreen;