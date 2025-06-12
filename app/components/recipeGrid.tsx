// components/RecipeGrid.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/recipeGridStyles'; // Asume que importarás los estilos de aquí

// Obtener el ancho de la pantalla para calcular el tamaño de la tarjeta
const { width } = Dimensions.get('window');
const cardMargin = 10; // Margen entre las tarjetas
const numColumns = 2; // Número de columnas
const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns; // Calcula el ancho de cada tarjeta

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  chef: string; // Asumiendo que 'chef' es el nombre de usuario
}

interface Props {
  recipes: Recipe[];
  onRecipePress?: (id: string) => void;
}

const RecipeGrid: React.FC<Props> = ({ recipes, onRecipePress }) => {
  return (
    // Utilizamos un View con flexWrap: 'wrap' para que los elementos se distribuyan en filas
    <View style={styles.recipeGridContainer}> 
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={[styles.recipeGridCard, { width: cardWidth }]} // Aplicamos el ancho calculado
          onPress={() => onRecipePress?.(recipe.id)}
        >
          <View style={styles.imageContainer}>
          <Image 
            source={{ uri: recipe.imageUrl }} 
            style={styles.recipeGridImage} 
            resizeMode="contain" // <-- CAMBIA AQUÍ
          />        </View>
          <View style={styles.recipeGridInfo}>
            <Text 
              style={[styles.recipeGridTitle, { fontFamily: 'WorkSans_400Regular' }]} 
              numberOfLines={2} // Limita el título a 2 líneas si es muy largo
            >
              {recipe.title}
            </Text>
            <View style={styles.recipeGridRatingContainer}>
              <Text style={styles.recipeGridRating}>{recipe.rating}</Text>
              <Ionicons name="star" size={16} color="#FFC107" />
            </View>
            <Text style={styles.recipeGridChef}>@{recipe.chef}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RecipeGrid;