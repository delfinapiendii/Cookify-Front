import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/recipeGridStyles';

const { width } = Dimensions.get('window');
const cardMargin = 10;
const numColumns = 2;
const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

interface Recipe {
  id: string;
  title: string;
  image: string;
  rating: number;
  chef: string;
}

interface Props {
  recipes: Recipe[];
  onRecipePress?: (id: string) => void;
  showCreateButton?: boolean; // Sigue siendo opcional
  onCreatePress?: () => void; // Sigue siendo opcional
  emptyMessage?: string;      // Sigue siendo opcional
  // Nueva prop para mostrar el botón de editar en cada tarjeta (opcional)
  showEditButton?: boolean;
  onEditPress?: (recipe: Recipe) => void; // Función para el botón de editar
}

const RecipeGrid: React.FC<Props> = ({
  recipes,
  onRecipePress,
  showCreateButton = false, // Valor por defecto: false
  onCreatePress = () => {}, // Función vacía por defecto
  emptyMessage = 'No hay recetas para mostrar.', // Mensaje por defecto
  showEditButton = false, // Valor por defecto: false
  onEditPress = () => {}, // Función vacía por defecto
}) => {
 

  // Caso: Hay recetas
  return (
    <View style={styles.recipeGridContainer}>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={[styles.recipeGridCard, { width: cardWidth }]}
          onPress={() => onRecipePress?.(recipe.id)}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={styles.recipeGridImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.recipeGridInfo}>
            <Text
              style={[styles.recipeGridTitle, { fontFamily: 'WorkSans_400Regular' }]}
              numberOfLines={2}
            >
              {typeof recipe.title === 'string' && recipe.title.trim() !== ''
                ? recipe.title
                : 'Receta sin título'}
            </Text>

            <View style={styles.recipeGridRatingContainer}>
              <Text style={styles.recipeGridRating}>
                  {typeof recipe.rating === 'number' ? recipe.rating.toFixed(1) : '0.0'}
              </Text>

              <Ionicons name="star" size={16} color="#00000" />
            </View>
            <Text style={styles.recipeGridChef}>@{recipe.chef ?? 'Chef'}</Text>
          </View>

          {/* Botón de Editar - SOLO se muestra si showEditButton es true */}
          {showEditButton && (
            <TouchableOpacity
              style={styles.editButton} // Asegúrate de definir este estilo en recipeGridStyles
              onPress={(e) => {
                e.stopPropagation(); // Evita que se dispare el onPress de la tarjeta
                onEditPress(recipe); // Pasa la receta a la función onEditPress
              }}
            >
              <Ionicons name="pencil-outline" size={20} color="rgba(255,154,22,0.8)" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RecipeGrid;