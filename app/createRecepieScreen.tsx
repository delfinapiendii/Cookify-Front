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
 import { Ionicons, AntDesign } from '@expo/vector-icons';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';
 import { Picker } from '@react-native-picker/picker';
 import { router } from 'expo-router';
 import LogoHeader from './components/logoHeader';
 import NavBar from './components/navBar';
 import styles from './styles/createRecipeStyles';
 import ModalSelector from './components/modalSelector';
 import CustomAlertModal from './components/alert'; // Tu modal reutilizable
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { publishRecipe, uploadImage, UsehandleDeleteRecipe, useCreatedRecipes } from '../hooks/hooks';




 const CreateRecipeScreen = () => {
   const [recipeName, setRecipeName] = useState('');
   const [nameError, setNameError] = useState('');

   const [description, setDescription] = useState('');
   const [descError, setDescError] = useState('');

   const [recipeType, setRecipeType] = useState('');
   const [typeError, setTypeError] = useState('');

   const [servings, setServings] = useState('');
   const [servingError, setServingError] = useState('');

   const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
   const [ingError, setIngError] = useState('');

   const [steps, setSteps] = useState([{ description: '', imageUri: null as string | null, imageUrl: null as string | null }]); // CAMBIO AQUÍ
   const [stepError, setStepError] = useState('');

   const [showPicker, setShowPicker] = useState(false);

   const [isDuplicateRecipeModalVisible, setIsDuplicateRecipeModalVisible] = useState(false);
   const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 
   const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(null); 
  const { recipes, loading } = useCreatedRecipes();



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
    setSteps([...steps, { description: '', imageUri: null, imageUrl: null }]); 
  };
 const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].description = value; 
    setSteps(newSteps);
  };    

   const handleRemoveStep = (index: number) => {
     const newSteps = steps.filter((_, i) => i !== index);
     setSteps(newSteps);
   };
   const handleConfirm = () => {
    console.log('receta creada con exito');
    setIsSuccessModalVisible(true); 
        setRecipeName('');
        setDescription('');
        setRecipeType('');
        setServings('');
        setIngredients([{ name: '', quantity: '' }]);
        setSteps([{ description: '', imageUri: null, imageUrl: null }]);
        setImage('');
  };

   const handleConfirmReplace = () => {
     console.log('Usuario eligió "Sí", reemplazando receta...');
     setIsDuplicateRecipeModalVisible(false);
     try{
       if (recipes && recipes.length > 0) {
         const existingRecipe = recipes.find(recipe => recipe.title === recipeName);
         console.log('Receta a reemplazar:', existingRecipe);
         
         if (existingRecipe) {
           UsehandleDeleteRecipe(existingRecipe.id, () => {
             console.log('Receta eliminada exitosamente');
           }, (error) => {
             console.error('Error al eliminar receta:', error);
           });
         }
       }
       setIsSuccessModalVisible(true); 
     } catch (error) {
       console.error('Error en el manejo de recetas duplicadas:', error);
     }
   };

   const handleCancelPublication = () => {
     console.log('Usuario eligió "No", cancelando publicación.');
     setIsDuplicateRecipeModalVisible(false);
   };

   const closeModalSuccess = () => {
     setIsSuccessModalVisible(false);
     
   };
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert("Necesitamos permiso para acceder a tu galería.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
  
    if (!result.canceled) {
      const imageSelected = result.assets[0];
  
      setImage(imageSelected); 
  
      const uploadedUrl = await uploadImage(imageSelected.uri);
  
      if (uploadedUrl) {
        
        setImageUrl(uploadedUrl); 
      }
    }
  };
    

   const handlePublishRecipe = async () => {
    if (!recipeName || !description || !recipeType || !servings || ingredients.some(ing => !ing.name || !ing.quantity) || steps.some(step => !step.description)) {
      if(!recipeName){setNameError('true')}
      if(!description){setDescError('true')}
      if(!recipeType){setTypeError('true')}
      if(!servings){setServingError('true')}
      if(ingredients.some(ing => !ing.name || !ing.quantity)){setIngError('true')}
      if(steps.some(step => !step.description)){setStepError('true')}
      alert('Por favor, completa todos los campos obligatorios.');
      return;

    }
    try {
      await publishRecipe(
        recipeName,
        description,
        recipeType,
        servings,
        ingredients,
        steps,
        image,
        imageUrl,
        () => handleConfirm(),         
        (msg) => {
          if (msg) {
            if (msg.includes('Ya existe una receta')) {
              setIsDuplicateRecipeModalVisible(true);
            } else {
              alert(`Error: ${msg}`);
            }
          }
        }        
      );  
        
    } catch (error) {
      console.error('Error al publicar receta:', error);
    }
    
  };

  const pickImageForStep = async (stepIndex: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Necesitamos permiso para acceder a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageSelected = result.assets[0];

      const newSteps = [...steps];
      newSteps[stepIndex].imageUri = imageSelected.uri; 
      setSteps(newSteps);

      const uploadedUrl = await uploadImage(imageSelected.uri);

      if (uploadedUrl) {
        const updatedStepsWithUrl = [...newSteps]; 
        updatedStepsWithUrl[stepIndex].imageUrl = uploadedUrl;
        setSteps(updatedStepsWithUrl);
      }
    }
  };



   return (
     <>
     <View style={{ flex: 1, backgroundColor: '#fff' }}>
       <ScrollView style={styles.container}>
         <LogoHeader />

         <Text style={styles.title}></Text>

         <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.selectedImage} />
            ) : image ? (
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            ) : (
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={40} color="#888" />
                <Ionicons name="add-circle" size={20} color="#555" style={styles.addIcon} />
              </View>
            )}
          </TouchableOpacity>

         <TextInput
           style={[styles.input, nameError ? styles.inputError : {}]}
           
           placeholder="Nombre"
           placeholderTextColor="#888"
           value={recipeName}
           onChangeText={setRecipeName}
         />
         <TextInput
           style={[styles.input, descError ? styles.inputError : {}]}
           placeholder="Descripción"
           placeholderTextColor="#888"
           multiline
           value={description}
           onChangeText={setDescription}
         />

         <TouchableOpacity
           style={[styles.pickerButton, { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', alignItems: 'center' }, typeError ? styles.inputError : {}]}
           onPress={() => setShowPicker(true)}
         >
           <Text style={[styles.servingsInput]}>
             {recipeType
               ? recipeType.charAt(0).toUpperCase() + recipeType.slice(1)
               : 'Seleccionar tipo de receta'}
           </Text>
           <AntDesign name="caretdown" size={10} color="#555" />
         </TouchableOpacity>

         <View style={[styles.servingsContainer, servingError ? styles.inputError : {}]}>
           <Ionicons name="people-outline" size={24} color="#555" style={styles.servingsIcon} />
           <TextInput
             style={styles.servingsInput}
             placeholder="Cantidad de porciones"
             placeholderTextColor="#888"
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
                 style={[styles.ingredientInput, ingError ? styles.inputError : {}]}
                 placeholder="ej. Comino"
                 placeholderTextColor="#888"
                 value={ingredient.name}
                 onChangeText={(value) => handleIngredientChange(index, 'name', value)}
               />
               <TextInput
                 style={styles.quantityInput}
                 placeholder="ej. 200 g"
                 placeholderTextColor="#888"
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
        style={[styles.stepInput, stepError ? styles.inputError : {}]}
        placeholder={`ej. Agrega la sal lentamente`}
        placeholderTextColor="#888"
        multiline
        value={step.description} 
        onChangeText={(value) => handleStepChange(index, value)}
      />
      
      {/* BOTÓN PARA SUBIR IMAGEN DEL PASO */}
      <TouchableOpacity 
        style={styles.stepImagePicker} 
        onPress={() => pickImageForStep(index)} 
      >
        {step.imageUrl ? ( 
          <Image source={{ uri: step.imageUrl }} style={styles.stepSelectedImage} />
        ) : step.imageUri ? ( 
          <Image source={{ uri: step.imageUri }} style={styles.stepSelectedImage} />
        ) : ( 
          <View style={styles.stepCameraIconContainer}>
            <Ionicons name="camera" size={24} color="#888" />
            <Ionicons name="add-circle" size={12} color="#555" style={styles.stepAddIcon} />
          </View>
        )}
      </TouchableOpacity>

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


         <TouchableOpacity style={styles.publishButton} onPress={handlePublishRecipe}>
           <Text style={styles.publishButtonText}>Publicar</Text>
         </TouchableOpacity>

         <ModalSelector
           visible={showPicker}
           title="Selecciona el tipo de receta"
           options={[ 'salado', 'dulce', 'artesanal', 'vegetariana', 'vegana', 'postre']}
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
           onConfirm={closeModalSuccess} 
           confirmText="Aceptar"
           showCancelButton={false}
         />

         {/* Modal de "Receta Eliminada" */}
         <CustomAlertModal
           isVisible={isDeleteModalVisible}
           message="Receta Eliminada" 
           confirmText="Aceptar"
           showCancelButton={false}
         />

       </ScrollView>

       <NavBar />
         </View>
       </>
     );
 };

 export default CreateRecipeScreen;