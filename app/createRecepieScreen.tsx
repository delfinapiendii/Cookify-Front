import React, { useState, useEffect } from 'react';
 import {
   ScrollView,
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Modal,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';
 import { Picker } from '@react-native-picker/picker';
 import { router } from 'expo-router';
 import LogoHeader from './components/logoHeader';
 import NavBar from './components/navBar';
 import { styles } from './styles/createRecipeStyles';
 import ModalSelector from './components/modalSelector';
 import CustomAlertModal from './components/alert'; // Tu modal reutilizable

 const CreateRecipeScreen = () => {
   const [recipeName, setRecipeName] = useState('');
   const [description, setDescription] = useState('');
   const [recipeType, setRecipeType] = useState('');
   const [servings, setServings] = useState('');
   const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
   const [steps, setSteps] = useState(['']);
   const [showPicker, setShowPicker] = useState(false);

   const [isDuplicateRecipeModalVisible, setIsDuplicateRecipeModalVisible] = useState(false);
   const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Estado para el modal de eliminación

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

   if (!fontsLoaded) {
     return null;
   }

   const handleAddIngredient = () => {
     setIngredients([...ingredients, { name: '', quantity: '' }]);
   };

   const handleIngredientChange = (index: number, field: string, value: string) => {
     const newIngredients = [...ingredients];
     newIngredients[index][field as 'name' | 'quantity'] = value;
     setIngredients(newIngredients);
   };

   const handleRemoveIngredient = (index: number) => {
     const newIngredients = ingredients.filter((_, i) => i !== index);
     setIngredients(newIngredients);
   };

   const handleAddStep = () => {
     setSteps([...steps, '']);
   };

   const handleStepChange = (index: number, value: string) => {
     const newSteps = [...steps];
     newSteps[index] = value;
     setSteps(newSteps);
   };

   const handleRemoveStep = (index: number) => {
     const newSteps = steps.filter((_, i) => i !== index);
     setSteps(newSteps);
   };

   const handleConfirmReplace = () => {
     console.log('Usuario eligió "Sí", reemplazando receta...');
     setIsDuplicateRecipeModalVisible(false);
     setIsSuccessModalVisible(true); // Muestra éxito después de reemplazar
   };

   const handleCancelPublication = () => {
     console.log('Usuario eligió "No", cancelando publicación.');
     setIsDuplicateRecipeModalVisible(false);
   };

   const closeModalSuccess = () => {
     setIsSuccessModalVisible(false);
     
   };

   const handleDeleteRecipe = () => {
     console.log('Eliminando receta...');
     setIsDeleteModalVisible(true); 
   };

   const handleConfirmDelete = () => {
     setIsDeleteModalVisible(false); 
   };


   const handlePublishRecipe = () => {
     setIsDuplicateRecipeModalVisible(true);
   };


   const handleNavigationPress = (screen: string) => {
     if (screen === 'Home') router.push('/home');
     if (screen === 'Search') router.push('/SearchScreen');
     if (screen === 'AddRecipe') router.push('/createRecepieScreen');
   };

   return (
     <>
       <ScrollView style={styles.container}>
         <LogoHeader />

         <Text style={styles.title}>Crear Receta</Text>

         <TouchableOpacity style={styles.imagePicker}>
           <View style={styles.cameraIconContainer}>
             <Ionicons name="camera" size={40} color="#888" />
             <Ionicons name="add-circle" size={20} color="#555" style={styles.addIcon} />
           </View>
         </TouchableOpacity>

         <TextInput
           style={styles.input}
           placeholder="Nombre"
           value={recipeName}
           onChangeText={setRecipeName}
         />
         <TextInput
           style={styles.input}
           placeholder="Descripción"
           multiline
           value={description}
           onChangeText={setDescription}
         />

         <TouchableOpacity
           style={[styles.pickerButton, { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', alignItems: 'center' }]}
           onPress={() => setShowPicker(true)}
         >
           <Text style={styles.pickerButtonText}>
             {recipeType
               ? recipeType.charAt(0).toUpperCase() + recipeType.slice(1)
               : 'Seleccionar tipo de receta'}
           </Text>
           <Ionicons name="chevron-down" size={20} color="#555" />
         </TouchableOpacity>

         <View style={styles.servingsContainer}>
           <Ionicons name="person-outline" size={24} color="#555" style={styles.servingsIcon} />
           <TextInput
             style={styles.servingsInput}
             placeholder="Cantidad de porciones"
             keyboardType="number-pad"
             value={servings}
             onChangeText={setServings}
           />
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Agregar ingredientes</Text>
           {ingredients.map((ingredient, index) => (
             <View key={index} style={styles.ingredientRow}>
               <TextInput
                 style={styles.ingredientInput}
                 placeholder="ej. Comino"
                 value={ingredient.name}
                 onChangeText={(value) => handleIngredientChange(index, 'name', value)}
               />
               <TextInput
                 style={styles.quantityInput}
                 placeholder="ej. 200 g"
                 value={ingredient.quantity}
                 onChangeText={(value) => handleIngredientChange(index, 'quantity', value)}
               />
               {ingredients.length > 1 && (
                 <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
                   <Ionicons name="close-circle-outline" size={24} color="#FF4D4D" />
                 </TouchableOpacity>
               )}
             </View>
           ))}
           <TouchableOpacity style={styles.addIngredientButton} onPress={handleAddIngredient}>
             <Ionicons name="add-circle-outline" size={30} color="#5CB85C" />
           </TouchableOpacity>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Agregar paso</Text>
           {steps.map((step, index) => (
             <View key={index} style={styles.stepRow}>
               <TextInput
                 style={styles.stepInput}
                 placeholder={`ej. Agrega la sal lentamente`}
                 multiline
                 value={step}
                 onChangeText={(value) => handleStepChange(index, value)}
               />
               {steps.length > 1 && (
                 <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                   <Ionicons name="close-circle-outline" size={24} color="#FF4D4D" />
                 </TouchableOpacity>
               )}
             </View>
           ))}
           <TouchableOpacity style={styles.addStepButton} onPress={handleAddStep}>
             <Ionicons name="add-circle-outline" size={30} color="#5CB85C" />
           </TouchableOpacity>
         </View>

         <TouchableOpacity style={styles.removeRecipeButton} onPress={handleDeleteRecipe}>
           <Ionicons name="trash-outline" size={20} color="#FF4D4D" style={styles.trashIcon} />
           <Text style={styles.removeRecipeText}>Eliminar receta</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.publishButton} onPress={handlePublishRecipe}>
           <Text style={styles.publishButtonText}>Publicar</Text>
         </TouchableOpacity>

         <ModalSelector
           visible={showPicker}
           title="Selecciona el tipo de receta"
           options={['Desayuno', 'Almuerzo', 'Cena']}
           highlightedOption={recipeType.charAt(0).toUpperCase() + recipeType.slice(1)}
           onClose={() => setShowPicker(false)}
           onSelectOption={(option: string) => {
             setRecipeType(option.toLowerCase());
             setShowPicker(false);
           }}
         />

         {/* Modal de Atención (Publicar) */}
         <CustomAlertModal
           isVisible={isDuplicateRecipeModalVisible}
           title="Atención"
           message="Usted ya tiene una receta creada con este nombre. ¿Desea reemplazarla?"
           onConfirm={handleConfirmReplace}
           onCancel={handleCancelPublication}
           confirmText="Sí"
           cancelText="No"
           showCancelButton={true}
         />

         {/* Modal de Éxito (Publicación/Reemplazo) */}
         <CustomAlertModal
           isVisible={isSuccessModalVisible}
           message="¡Receta creada con éxito!"
           onConfirm={closeModalSuccess} // Ahora solo cierra este modal, sin navegación
           confirmText="Aceptar"
           showCancelButton={false}
         />

         {/* Modal de "Receta Eliminada" */}
         <CustomAlertModal
           isVisible={isDeleteModalVisible}
           message="Receta Eliminada" // Usamos solo el mensaje, el título es opcional
           onConfirm={handleConfirmDelete} // Esta función ahora maneja el cierre del modal y la navegación
           confirmText="Aceptar"
           showCancelButton={false}
         />

       </ScrollView>

       <NavBar />
     </>
   );
 };

 export default CreateRecipeScreen;