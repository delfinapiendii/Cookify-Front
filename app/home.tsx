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
  const [showLoginModal, setShowLoginModal] = useState(false); // ✅ Nueva variable de estado para el modal de inicio de sesión
  const [isGuest, setIsGuest] = useState(true); // ✅ Nueva variable de estado para el modo invitado
  const { recipes, fetchRecipes } = useRecipes();
   const { handleCategoryPress } = useCategoryNavigation(setIsCategoryNonExistVisible, setShowLoginModal);

  useEffect(() => {
    const checkUserStatus = async () => {
      const userId = await AsyncStorage.getItem('userid');
      if (userId && userId !== 'null') {
        setIsGuest(false);
      }
    };
    checkUserStatus();
    fetchRecipes();
    

  }, []);

  // ✅ Lógica modificada para el onPress de la receta
  const handleRecipePress = (recipeId: string) => {
    if (isGuest) {
      setShowLoginModal(true); // Muestra el modal si es invitado
    } else {
      router.push(`/recipe?id=${recipeId}`); // Navega si el usuario está logueado
    }
  };

  // ✅ Lógica modificada para el botón de "Ver más"
  const handleVerMas = () => {
    if (isGuest) {
      setShowLoginModal(true); // Muestra el modal si es invitado
    } else {
      fetchRecipes();
      const recipesString = encodeURIComponent(JSON.stringify(recipes));
      router.push({
        pathname: '/viewMore',
        params: {
          recipes: recipesString,
          title: '¡Recetas que pueden gustarte!',
        },
      });
    }
  };

  const closeModalSuccess = () => {
    setIsCategoryNonExistVisible(false);
  };

  // ✅ Función para cerrar el modal y redirigir
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    router.push('/'); // Redirige a la pantalla de inicio de sesión
  };

  // ✅ Función para cerrar el modal sin redirigir
  const handleLoginCancel = () => {
    setShowLoginModal(false);
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

      {/* ✅ Nuevo modal de alerta para el modo invitado */}
      <CustomAlertModal
        isVisible={showLoginModal}
        message="Para acceder a esta sección, debes iniciar sesión o registrarte."
        onConfirm={handleLoginConfirm}
        onCancel={handleLoginCancel}
        confirmText="Iniciar"
        cancelText='Volver'
        showCancelButton={true} // Se habilita el botón de cancelar
      />

    </>
  );
};

export default Home;
