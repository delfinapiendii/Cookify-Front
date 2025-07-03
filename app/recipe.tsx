import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
  FlatList,
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
const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width;

const RecipeDetailScreen = () => {
  const { id: recipeIdParam } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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

  const handlePostComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío.');
      return;
    }
    try {
      const newCommentData = await postComment(comment, recipeIdParam); // Esperar y obtener el nuevo comentario

      // Actualizar el estado de la receta añadiendo el nuevo comentario al array 'comentarios'
      setRecipe((prevRecipe: any) => {
        if (!prevRecipe) return prevRecipe; // Si prevRecipe es null, no hagas nada
        return {
          ...prevRecipe,
          // Asegúrate de que comentarios sea un array antes de hacer spread
          comentarios: [...(prevRecipe.comentarios || []), newCommentData],
        };
      });
      setComment(''); // Limpiar el campo de texto

    } catch (error) {
      // El error ya se maneja y se muestra una alerta en postComment,
      // aquí solo lo logueamos si es necesario.
      console.error('Error en handlePostComment:', error);
    }
  };
  const goToNextImage = () => {
    if (recipe.imagenes && recipe.imagenes.length > 1) {
      const nextIndex = (currentImageIndex + 1) % recipe.imagenes.length;
      setCurrentImageIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  // Función para desplazar a la imagen anterior
  const goToPreviousImage = () => {
    if (recipe.imagenes && recipe.imagenes.length > 1) {
      const prevIndex = (currentImageIndex - 1 + recipe.imagenes.length) % recipe.imagenes.length;
      setCurrentImageIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const mainImageUrl = recipe.imagenes?.[0] || 'https://via.placeholder.com/400x200?text=No+Image';

  return (
        <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
        {/* Cambia <Image> por <FlatList> para el carrusel de imágenes */}
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled // Hace que se desplace una imagen completa a la vez
          showsHorizontalScrollIndicator={false}
          data={recipe.imagenes} // Usar el array completo de imágenes
          keyExtractor={(item, index) => item + index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
          )}
          onScroll={e => {
            const contentOffsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(contentOffsetX / CAROUSEL_ITEM_WIDTH);
            if (index !== currentImageIndex) {
              setCurrentImageIndex(index);
            }
          }}
          scrollEventThrottle={16} // Para que onScroll sea más responsivo
        />

        {/* Flechas de navegación (visibles solo si hay más de una imagen) */}
        {recipe.imagenes && recipe.imagenes.length > 1 && (
          <>
            <TouchableOpacity style={styles.arrowButtonLeft} onPress={goToPreviousImage}>
              <Ionicons name="chevron-back" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButtonRight} onPress={goToNextImage}>
              <Ionicons name="chevron-forward" size={25} color="#fff" />
            </TouchableOpacity>
          </>
        )}

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
                  <Text key={index} style={styles.listItem}>
            • {parseFloat(item.cantidad) % 1 === 0 
                ? parseInt(item.cantidad) 
                : parseFloat(item.cantidad).toFixed(2)} {item.ingrediente}
        </Text>
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
