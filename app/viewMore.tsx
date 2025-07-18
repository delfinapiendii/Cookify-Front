// app/filteredRecipesScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RecipeGrid from './components/recipeGrid'; // Asegúrate de que esta ruta sea correcta
import { styles } from './styles/profileStyles'; // Tus estilos generales
import LogoHeader from './components/logoHeader'; // Si quieres usar tu LogoHeader
import BottomNavigation from './components/navBar'; // Si quieres usar tu barra de navegación


interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  image?: string; // Added optional 'image' property
  imagenes?: string;
  rating: number;
  chef: string;
}

export default function FilteredRecipesScreen() {
  // useLocalSearchParams permite acceder a los parámetros pasados a esta ruta
  const { recipes, title } = useLocalSearchParams<{ recipes: string; title: string }>();

  const [parsedRecipes, setParsedRecipes] = React.useState<Recipe[]>([]);

  useEffect(() => {
    if (recipes) {
      try {
        // Los arrays de objetos deben pasarse como strings JSON a través de los parámetros
        const decodedRecipes = JSON.parse(decodeURIComponent(recipes));
        setParsedRecipes(decodedRecipes);
      } catch (e) {
        console.error('Error al parsear las recetas:', e);
        // Puedes redirigir o mostrar un mensaje de error si los datos son inválidos
        router.back(); 
      }
    } else {
      console.warn('No se recibieron recetas para filtrar.');
      router.back(); // Si no hay recetas, quizás no tenga sentido mostrar la página
    }
  }, [recipes]);

  const handleRecipePress = (recipeId: string) => {
    // Aquí iría la lógica para navegar a la pantalla de detalle de la receta
    console.log(`Receta tocada con ID: ${recipeId}`);
    router.push(`/recipe?id=${recipeId}`); 
    //router.push(`/recipe-detail/${recipeId}`); // Asume que tienes una ruta para el detalle de la receta
  };

  return (
    <SafeAreaView style={[styles.safeArea, {paddingBottom:80}]}>
      {/* Header superior fijo - similar a tu captura de pantalla */}
      <View style={localStyles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={localStyles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <LogoHeader />
    </View>

      <ScrollView contentContainerStyle={localStyles.scrollViewContent}>
        {/* Título dinámico que recibe de los parámetros */}
        <Text style={localStyles.pageTitle}>{title || 'Recetas'}</Text>

        {parsedRecipes.length > 0 ? (
          <RecipeGrid
          recipes={parsedRecipes.map(recipe => ({
            ...recipe,
            image: recipe.image || recipe.imageUrl || recipe.imagenes || null
          }))}
          onRecipePress={handleRecipePress}
        />
        
        ) : (
          <Text style={localStyles.noRecipesText}>No se encontraron recetas.</Text>
        )}
      </ScrollView>

      {/* Navegación inferior */}
      <BottomNavigation />
    </SafeAreaView>
  );
}

// Estilos específicos para esta pantalla, puedes moverlos a tu Styles.ts si prefieres
const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'flex-start', // Alinea el botón de retroceso a la izquierda
  },
  backButton: {
    marginRight: 10,
    padding: 5, // Área táctil más grande
  },
  logo: {
    width: 100, // Ajusta el tamaño de tu logo
    height: 40,
    marginLeft: 'auto', // Empuja el logo a la derecha (si hay espacio)
    marginRight: 'auto', // Centra el logo si no hay otros elementos
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
    textAlign: 'left', // Alineado a la izquierda como en la captura
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para la barra de navegación inferior
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});