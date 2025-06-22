import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { styles } from './styles/recipeStyles';
import {
  modifiedRecipes,
  toggleBookmark,
  confirmRating,
  postComment,
  fetchRecipeDetails
} from '../hooks/hooks';

const RecipeDetailScreen = () => {
  const { id: recipeIdParam } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [comment, setComment] = useState('');

  const [fontsLoaded] = useFonts({ WorkSans_400Regular, WorkSans_700Bold });

  useEffect(() => {
    if (!fontsLoaded) SplashScreen.preventAutoHideAsync();
    else SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    fetchRecipeDetails(
      recipeIdParam,
      setRecipe,
      setServings,
      setUserRating,
      setLoading,
      setError,
      setIsBookmarked
    );
  }, [recipeIdParam]);
  

  if (!fontsLoaded) return null;
  if (loading) return <ActivityIndicator size="large" color="#FF9A16" />;
  if (error || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Receta no encontrada.'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Text style={styles.backButtonErrorText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderStars = (rating, onStarPress?) =>
    [...Array(5)].map((_, i) => (
      <TouchableOpacity key={i} onPress={() => onStarPress?.(i + 1)}>
        <Ionicons
          name={i + 1 <= rating ? 'star' : 'star-outline'}
          size={30}
          color={i + 1 <= rating ? '#FFC107' : '#888'}
        />
      </TouchableOpacity>
    ));

  const decreaseServings = () => {
    if (servings > 1) {
      const newServings = servings - 1;
      setServings(newServings);
      setTimeout(() => modifiedRecipes(newServings, recipeIdParam, setRecipe), 100);
    }
  };

  const increaseServings = () => {
    const newServings = servings + 1;
    setServings(newServings);
    setTimeout(() => modifiedRecipes(newServings, recipeIdParam, setRecipe), 100);
  };

  const handleToggleBookmark = () => {
    toggleBookmark(recipeIdParam, isBookmarked, setIsBookmarked);
  };

  const openRatingModal = () => {
    setIsRatingModalVisible(true);
    setTempRating(userRating);
  };

  const closeRatingModal = () => setIsRatingModalVisible(false);

  const handleConfirmRating = () => {
    confirmRating(tempRating, recipeIdParam, setUserRating, closeRatingModal);
  };

  const handlePostComment = () => {
    postComment(comment, recipeIdParam).catch((error) => {
      console.error('Failed to post comment:', error);
    });
    setComment('');
  };

  const mainImageUrl = recipe.imagenes?.[0] || 'https://via.placeholder.com/400x200?text=No+Image';

  return (
        <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: mainImageUrl }} style={styles.recipeImage} resizeMode="cover" />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.recipeInfo}>
            <View style={styles.bookmarkContainer}>
                <TouchableOpacity onPress={() => handleToggleBookmark()}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={32}
                        color={isBookmarked ? '#FF9A16' : '#FF9A16'}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{recipe.titulo}</Text>
            <View style={styles.divider} />

            <Text style={styles.author}>Autor: {recipe.usuario?.alias || 'Desconocido'}</Text>
            <View style={styles.ratingAndServings}>
                <View style={styles.ratingContainer}>
                    {renderStars(recipe.valoracionPromedio || 0)}
                    <Text style={styles.ratingCount}>({recipe.comentarios?.length || 0})</Text>
                </View>
                <View style={styles.servingsContainer}>
                    <Text style={styles.servingsLabel}>Porciones</Text>
                    <View style={styles.servingsControl}>
                        <TouchableOpacity style={styles.servingsButton} onPress={decreaseServings}>
                            <Ionicons name="remove" size={20} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.servingsValue}>{servings}</Text>
                        <TouchableOpacity style={styles.servingsButton} onPress={increaseServings}>
                            <Ionicons name="add" size={20} color="#333" />
                        </TouchableOpacity>
                        </View>

                </View>
                </View>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{recipe.descripcion}</Text>

            <View style={styles.section}>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Ingredientes</Text>
                {recipe.composiciones?.map((item, index) => ( // Agregado ?.
                    <Text key={index} style={styles.listItem}>• {item.cantidad} {item.ingrediente}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preparación</Text>
                {recipe.pasos?.map((step, index) => ( // Agregado ?.
                    <View key={index} style={styles.stepContainer}>
                        <Text style={styles.listItem}>
                        <Text style={styles.stepNumber}>{`${step.orden}. `}</Text>
                        {step.descripcion}
                    </Text>


                        {step.imagenUrl && (
                            <Image source={{ uri: step.imagenUrl }} style={styles.stepImage} resizeMode="cover" /> 
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.openRatingButton} onPress={openRatingModal}>
                <Text style={styles.openRatingText}>¿Desea valorar esta receta?</Text>
                <View style={styles.currentRating} >
                    {renderStars(userRating)}
                </View>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comentarios</Text>
                {recipe.comentarios && recipe.comentarios.length > 0 ? (
                    recipe.comentarios.map((comment, index) => (
                        <View key={index} style={styles.comment}>

                            <Text style={styles.commentAuthor}>{comment.usuario.alias || 'Anónimo'}:</Text>
                            <Text style={styles.commentText}>{String(comment.contenido)}</Text>
                            </View>
                    ))
                ) : (
                    <Text style={styles.noCommentsText}>Aún no hay comentarios.</Text>
                )}
                <View style={styles.addCommentContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Añadir un comentario..."
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handlePostComment}>
                        <Ionicons name="send" size={24} color="#FF9A16" />
                    </TouchableOpacity>
                    
                    
                </View>
            </View>
        </View>
        <Modal
            visible={isRatingModalVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>¿Desea valorar esta receta?</Text>
                    <View style={styles.modalRatingStars}>
                        {renderStars(tempRating, (value) => setTempRating(value))}
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmRating()}>
                        <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={closeRatingModal}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </ScrollView>
  );
};

export default RecipeDetailScreen;
