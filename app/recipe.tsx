import React, { useState, useEffect } from 'react';
 import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';
 import { styles } from './styles/recipeStyles'; 

 import { useLocalSearchParams, useNavigation } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

 // Definimos la interfaz para la estructura de la receta que viene de tu API
 interface Ingredient {
   cantidad: number;
   ingrediente: string;
 }

 interface Step {
   orden: number;
   descripcion: string;
   imagenUrl: string | null;
 }

 interface User {
   id: string;
   email: string;
   alias: string;
 }

 interface Comment {
   contenido: any;
   usuario: any;
   author: string; 
   text: string;    
 }

 interface ApiRecipe {
   id: number; 
   titulo: string;
   descripcion: string;
   categoria: string;
   estado: string;
   porciones: number;
   usuario: User;
   composiciones: Ingredient[]; // Asegúrate de que este campo sea 'composiciones' según tu backend
   pasos: Step[];
   imagenes: string[]; 
   valoracionPromedio: number | null;
   comentarios: Comment[];
 }

 const RecipeDetailScreen = () => { 
     const { id: recipeIdParam } = useLocalSearchParams<{ id: string }>(); 
     const navigation = useNavigation();

     const [recipe, setRecipe] = useState<ApiRecipe | null>(null); 
     const [loading, setLoading] = useState(true); 
     const [error, setError] = useState<string | null>(null); 

     const [servings, setServings] = useState(0); 
     const [isBookmarked, setIsBookmarked] = useState(false);
     const [userRating, setUserRating] = useState(0);
     const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
     const [tempRating, setTempRating] = useState(0);
     const [comment, setComment] = '';


     const [fontsLoaded] = useFonts({
         WorkSans_400Regular,
         WorkSans_700Bold,
     });

     useEffect(() => {
         if (!fontsLoaded) {
             SplashScreen.preventAutoHideAsync();
         } else {
             SplashScreen.hideAsync();
         }
     }, [fontsLoaded]);

     useEffect(() => {
         const fetchRecipeDetails = async () => {
             if (!recipeIdParam) {
                 setError('No se proporcionó un ID de receta.');
                 setLoading(false);
                 return;
             }

             try {
                 const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/${recipeIdParam}`);
                 if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                 }
                 const data: ApiRecipe = await response.json();
                 
                 setRecipe(data);
                 setServings(data.porciones || 1); 
                 setUserRating(data.valoracionPromedio || 0); 
                 
             } catch (err: any) {
                 console.error('Error fetching recipe details:', err);
                 setError('No se pudo cargar la receta. Por favor, inténtalo de nuevo más tarde.');
                 Alert.alert('Error', 'No se pudo cargar la receta. ' + err.message);
             } finally {
                 setLoading(false);
             }
         };

         fetchRecipeDetails();
     }, [recipeIdParam]); 

     if (!fontsLoaded) {
         return null;
     }

     if (loading) {
         return (
             <View style={styles.loadingContainer}>
                 <ActivityIndicator size="large" color="#FF9A16" />
                 <Text>Cargando receta...</Text>
             </View>
         );
     }

     if (error || !recipe) { // Añadido !recipe para manejar el caso donde recipe es null después de un error
         return (
             <View style={styles.errorContainer}>
                 <Text style={styles.errorText}>{error || 'Receta no encontrada.'}</Text>
                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
                     <Text style={styles.backButtonErrorText}>Volver</Text>
                 </TouchableOpacity>
             </View>
         );
     }

     const renderStars = (rating: number, onStarPress?: (value: number) => void) => {
         const stars = [];
         for (let i = 1; i <= 5; i++) {
             const starIcon = i <= rating ? 'star' : 'star-outline';
             const starColor = i <= rating ? '#FFC107' : '#888';
             stars.push(
                 <TouchableOpacity key={`star-${i}`} onPress={() => onStarPress?.(i)}>
                     <Ionicons name={starIcon} size={30} color={starColor} />
                 </TouchableOpacity>
             );
         }
         return stars;
     };

     const modifiedRecipes = async () => {
        try {
            console.log('--- INICIO modifiedRecipes ---');
            console.log('Servings actual antes de la llamada a escalar:', servings); // Verifica el valor de servings
            
            const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/${recipeIdParam}/escalar?porciones=${servings}`);
            
            if (!response.ok) {
                const errorText = await response.text(); // Captura el texto del error
                console.error('Error HTTP al escalar:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}. Detalle: ${errorText}`);
            }
            
            const data = await response.json(); 
            console.log('RESPUESTA DE LA API /escalar:', data); // <--- CLAVE: qué devuelve la API
            
            setRecipe(prevRecipe => {
                if (!prevRecipe) return null;
              
                const composicionesAdaptadas = data.ingredientes?.map((ing: any) => ({
                  cantidad: ing.cantidad,
                  ingrediente: ing.nombre,
                }));
              
                return {
                  ...prevRecipe,
                  composiciones: composicionesAdaptadas || prevRecipe.composiciones,
                  valoracionPromedio:
                    data.valoracionPromedio !== undefined
                      ? data.valoracionPromedio
                      : prevRecipe.valoracionPromedio,
                };
              });
              
            
        } catch (err: any) {
            console.error('Error en modifiedRecipes:', err);
            Alert.alert('Error de escalado', 'No se pudo escalar la receta. ' + err.message);
        } finally {
            console.log('--- FIN modifiedRecipes ---');
        }
    };

     const decreaseServings = () => {
         if (servings > 1) {
             setServings(servings - 1);
             // Llama a modifiedRecipes después de actualizar servings para que use el nuevo valor
             // Puedes considerar usar un debounce si las llamadas son muy rápidas
             setTimeout(modifiedRecipes, 100); // Pequeño retraso para que el estado se actualice
         }
     };

     const increaseServings = () => {
         setServings(servings + 1);
         // Llama a modifiedRecipes después de actualizar servings para que use el nuevo valor
         // Puedes considerar usar un debounce si las llamadas son muy rápidas
         setTimeout(modifiedRecipes, 100); // Pequeño retraso para que el estado se actualice
     };

     const toggleBookmark = async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userid');
    
        if (!token || !userId) {
            Alert.alert("Error", "No estás autenticado.");
            return;
        }
    
        const parsedRecipeId = parseInt(recipeIdParam);
        if (isNaN(parsedRecipeId)) {
            Alert.alert("Error", "ID de receta inválido.");
            return;
        }
    
        const nuevaAccion = !isBookmarked;
        setIsBookmarked(nuevaAccion);
    
        try {
            if (nuevaAccion) {
                const response = await fetch('http://10.0.2.2:3000/api/v1/favoritos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        recetaId: parsedRecipeId,
                        usuarioId: userId,
                    }),
                });
    
                const data = await response.json();
                console.log('Receta faveada:', data.message);
            } else {
                const response = await fetch(`http://10.0.2.2:3000/api/v1/favoritos/${userId}/${parsedRecipeId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.status === 200 || response.status === 204) {
                    console.log('Receta desfaveada correctamente');
                } else {
                    const data = await response.text(); // texto, por si hay mensaje de error
                    console.error('Error desfaveando:', response.status, data);
                }
            }
        } catch (err) {
            console.error('Error en toggleBookmark:', err);
            Alert.alert('Error', 'No se pudo modificar el favorito.');
        }
    };
    
     const openRatingModal = () => {
         setIsRatingModalVisible(true);
         setTempRating(userRating);
     };

     const closeRatingModal = () => {
         setIsRatingModalVisible(false);
     };

     const confirmRating = async () => {
         setUserRating(tempRating);
         console.log('User rated:', tempRating);
         const token = await AsyncStorage.getItem('token');
         const userId = await AsyncStorage.getItem('userid');
    
         try {
                const parsedRecipeId = parseInt(recipeIdParam); // Define parsedRecipeId here
                if (isNaN(parsedRecipeId)) {
                    Alert.alert("Error", "ID de receta inválido.");
                    return;
                }

                const response = await fetch('http://10.0.2.2:3000/api/v1/valoraciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        recetaId: parsedRecipeId,
                        usuarioId: userId,
                        puntaje:tempRating,
                    }),
                });
    
                const data = await response.json();
                console.log('Receta valorada:', data.message);
            } catch (err) {
                console.error('Error en valoracion:', err);
                Alert.alert('Error', 'No se pudo modificar el favorito.');
            }
         closeRatingModal();
     };

     const postComment = async () => {
        console.log('User commented:', comment);
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userid');

   {/*
        try {
               const parsedRecipeId = parseInt(recipeIdParam); // Define parsedRecipeId here
               if (isNaN(parsedRecipeId)) {
                   Alert.alert("Error", "ID de receta inválido.");
                   return;
               }

               const response = await fetch('http://10.0.2.2:3000/api/v1/valoraciones', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       Authorization: `Bearer ${token}`,
                   },
                   body: JSON.stringify({
                       recetaId: parsedRecipeId,
                       usuarioId: userId,
                       puntaje:tempRating,
                   }),
               });
   
               const data = await response.json();
               console.log('Receta valorada:', data.message);
           } catch (err) {
               console.error('Error en valoracion:', err);
               Alert.alert('Error', 'No se pudo modificar el favorito.');
           }
        closeRatingModal();*/ }
    };

     const mainImageUrl = recipe.imagenes && recipe.imagenes.length > 0
         ? recipe.imagenes[0]
         : 'https://via.placeholder.com/400x200?text=No+Image';

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
                     <TouchableOpacity onPress={toggleBookmark}>
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
                         />
                         <TouchableOpacity style={styles.sendButton} onPress={postComment}>
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
                         <TouchableOpacity style={styles.confirmButton} onPress={confirmRating}>
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

 Object.assign(styles);
