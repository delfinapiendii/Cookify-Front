import React, { useState } from 'react';
 import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';
 import { styles } from './styles/recipeStyles';

 import recipeData from '../assets/data/recepieData.json';
import { useNavigation } from 'expo-router';

 const recipeDetail = () => {
    const [servings, setServings] = useState(4);
   const { recipe } = recipeData;
   const [isBookmarked, setIsBookmarked] = useState(false);
   const navigation = useNavigation();
   const [userRating, setUserRating] = useState(0); // Estado para la valoración del usuario
   const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
   const [tempRating, setTempRating] = useState(0);


   const [fontsLoaded] = useFonts({
     WorkSans_400Regular,
     WorkSans_700Bold,
   });

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


   const decreaseServings = () => {
    if (servings > 1) {
      setServings(servings - 1);
    }
  };

  const increaseServings = () => {
    setServings(servings + 1);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Aquí iría la lógica para guardar/eliminar de la lista de favoritos
    console.log('Bookmark toggled:', !isBookmarked);
  };

  const openRatingModal = () => {
    setIsRatingModalVisible(true);
    setTempRating(userRating); // Inicializar la valoración temporal con la actual
    console.log('Modal visibility:', isRatingModalVisible); // Agrega esto
  };
  const closeRatingModal = () => {
    setIsRatingModalVisible(false);
  };

  const confirmRating = () => {
    setUserRating(tempRating);
    // Aquí iría la lógica para guardar la valoración del usuario (por ejemplo, en una base de datos)
    console.log('User rated:', tempRating);
    closeRatingModal();
  };

  
  



   return (
     <ScrollView style={styles.container}>
       <View style={styles.imageContainer}>
        <Image source={require('../assets/images/carnePoster.jpg')} style={styles.recipeImage} resizeMode="cover" />
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
                color={isBookmarked ? '#FF9A16' : '#FF9A16  '}
              />
            </TouchableOpacity>
          </View>
         <Text style={styles.title}>{recipe.title}</Text>
         <View style={styles.divider} />

         <Text style={styles.author}>Autor: {recipe.author}</Text>
         <View style={styles.ratingAndServings}>
           <View style={styles.ratingContainer}>
             {renderStars(recipe.rating)}
             <Text style={styles.ratingCount}>({recipe.ratingCount})</Text>
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
         <Text style={styles.date}>{recipe.publicationDate}</Text>
         <Text style={styles.sectionTitle}>Descripción</Text>
         <Text style={styles.description}>{recipe.description}</Text>

         <View style={styles.section}>

         <View style={styles.divider} />

           <Text style={styles.sectionTitle}>Ingredientes</Text>
           {recipe.ingredients.map((ingredient, index) => (
             <Text key={index} style={styles.listItem}>• {ingredient}</Text>
           ))}
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Preparación</Text>
           {recipe.preparation.map((step, index) => (
             <Text key={index} style={styles.listItem}>
               <Text style={styles.stepNumber}>{index + 1}. </Text>
               {step}
             </Text>
           ))}
         </View>

         <View style={styles.divider} />

         <TouchableOpacity style={styles.openRatingButton} onPress={openRatingModal}>
           <Text style={styles.openRatingText}>¿Desea valorar esta receta?</Text>
           <View style={styles.currentRating}>
             {renderStars(userRating)}
           </View>
         </TouchableOpacity>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Comentarios</Text>
           {recipe.comments.map((comment, index) => (
             <View key={index} style={styles.comment}>
               <Text style={styles.commentAuthor}>{comment.author}:</Text>
               <Text style={styles.commentText}>{comment.text}</Text>
             </View>
           ))}
           <View style={styles.addCommentContainer}>
             <TextInput
               style={styles.commentInput}
               placeholder="Añadir un comentario..."
             />
             <TouchableOpacity style={styles.sendButton}>
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

 

 export default recipeDetail;