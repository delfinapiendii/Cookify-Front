// components/RecipeList.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/Styles';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  chef: string;
}

interface Props {
  recipes: Recipe[];
  onRecipePress?: (id: string) => void;
}

const RecipeList: React.FC<Props> = ({ recipes, onRecipePress }) => {
  return (
    <View style={styles.searchResultsContainer}>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.recipeCardS}
          onPress={() => onRecipePress?.(recipe.id)}
        >
          <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImageS} resizeMode="cover" />
          <View style={styles.recipeInfo}>
            <Text style={[styles.recipeTitleS, { fontFamily: 'WorkSans_400Regular' }]}>
              {recipe.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{recipe.rating}</Text>
              <Ionicons name="star" size={16} color="#FFC107" />
            </View>
            <Text style={styles.chef}>@{recipe.chef}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RecipeList;
