import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
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
  showCreateButton?: boolean;
  onCreatePress?: () => void;
  emptyMessage?: string;
  showEditButton?: boolean;
  onEditPress?: (recipe: Recipe) => void;
  horizontal?: boolean; // ✅ NUEVA PROP
}

const RecipeGrid: React.FC<Props> = ({
  recipes,
  onRecipePress,
  showCreateButton = false,
  onCreatePress = () => {},
  emptyMessage = 'No hay recetas para mostrar.',
  showEditButton = false,
  onEditPress = () => {},
  horizontal = false, // ✅ Valor por defecto
}) => {
  const renderCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.recipeGridCard, { width: horizontal ? 180 : cardWidth, marginRight: horizontal ? 12 : 0 }]}
      onPress={() => onRecipePress?.(item.id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.recipeGridImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.recipeGridInfo}>
        <Text
          style={[styles.recipeGridTitle, { fontFamily: 'WorkSans_400Regular' }]}
          numberOfLines={2}
        >
          {typeof item.title === 'string' && item.title.trim() !== ''
            ? item.title
            : 'Receta sin título'}
        </Text>

        <View style={styles.recipeGridRatingContainer}>
          <Text style={styles.recipeGridRating}>
            {typeof item.rating === 'number' ? item.rating.toFixed(1) : '0.0'}
          </Text>
          <Ionicons name="star" size={16} color="#000000" />
        </View>
        <Text style={styles.recipeGridChef}>@{item.chef ?? 'Chef'}</Text>
      </View>

      {showEditButton && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            onEditPress(item);
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="rgba(255,154,22,0.8)" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (recipes.length === 0) {
    return (
      <View style={styles.recipeGridContainer}>
        <Text style={styles.emptyMessege}>{emptyMessage}</Text>
      </View>
    );
  }

  return (

      <View style={styles.recipeGridContainer}>
              {horizontal ? (
        <View style={{ height: 260 }}>
          <FlatList
            data={recipes.slice(0, 5)}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // 👈 importante para no chocar con el ScrollView padre
          contentContainerStyle={{ paddingHorizontal: 0 }}
        />
      )}

      </View>    
  );
};

export default RecipeGrid;
