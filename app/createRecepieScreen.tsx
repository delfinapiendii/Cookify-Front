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
 import { styles } from './styles/createRecipeStyles';
 import ModalSelector from './components/modalSelector';
 import CustomAlertModal from './components/alert'; // Tu modal reutilizable
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';


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
   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Estado para el modal de eliminación
   const [image, setImage] = useState(null); // para la imagen local (objeto)
const [imageUrl, setImageUrl] = useState(null); // para la URL subida


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
    setSteps([...steps, { description: '', imageUri: null, imageUrl: null }]); // CAMBIO AQUÍ
  };
 const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].description = value; // CAMBIO AQUÍ
    setSteps(newSteps);
  };   

   const handleRemoveStep = (index: number) => {
     const newSteps = steps.filter((_, i) => i !== index);
     setSteps(newSteps);
   };
   const handleConfirm = () => {
    console.log('receta creada con exito');
    setIsSuccessModalVisible(true); // Muestra éxito después de reemplazar
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
   const uploadImage = async (imageUri: string) => {
    const formData = new FormData();
  
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any); // El `as any` es necesario por la diferencia en tipos en React Native
  
    try {
      const response = await fetch('http://10.0.2.2:3000/api/v1/upload/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log('Imagen subida con éxito:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  };
  
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert("Necesitamos permiso para acceder a tu galería.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // corregido según warning
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
  
    if (!result.canceled) {
      const imageSelected = result.assets[0];
      console.log('pickImage: imagen seleccionada:', imageSelected);
  
      setImage(imageSelected); // guarda objeto completo para mostrar la imagen local
  
      const uploadedUrl = await uploadImage(imageSelected.uri);
  
      if (uploadedUrl) {
        console.log('pickImage: URL subida recibida:', uploadedUrl);
        // Aquí cambia el estado a la URL, pero OJO:
        // Para evitar problemas en el render, te sugiero usar un estado distinto para la URL:
        setImageUrl(uploadedUrl); // <-- nuevo estado para url subida
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
      // Obtén el usuarioId de AsyncStorage
      const userId = await AsyncStorage.getItem('userid');
  
      if (!userId) {
        console.error('No se encontró el ID del usuario en AsyncStorage.');
        return;
      }
      console.log(recipeName, description, userId,steps);
      const token = await AsyncStorage.getItem('token');
  
      // Realiza la solicitud para publicar la receta
      const response = await fetch('http://10.0.2.2:3000/api/v1/recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify({
          titulo: recipeName,
          descripcion: String(description),
          categoria: recipeType,
          porciones: Number(servings),
          usuarioId: String(userId),
          ingredientes: ingredients.map(ingredient => ({
            nombre: ingredient.name,
            cantidad: Number(ingredient.quantity),
          })),
          pasos: steps.map((step, index) => ({
            orden: index + 1, // Asigna un número secuencial a cada paso
            descripcion: String(step),
          })),
          imagenes: [imageUrl || (image ? image.uri : '')], // Usa imageUrl si está disponible, o la URI de la imagen local
          // Si no hay imagen, puedes manejarlo como desees (por ejemplo, enviar un array vacío o un valor por defecto)
          // Si no hay imagen, puedes enviar un array vacío o un valor por defecto
          // imagenes: imageUrl ? [imageUrl] : [], // Si no hay imagen, envía un array vacío

        }),
      });
  
  
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error al publicar la receta:", errorJson);

        } catch {
          console.error("Error al publicar la receta (texto):", errorText);
        }
      } else {
        console.log("Receta publicada con éxito");
        setIsSuccessModalVisible(true)
      }      
    } catch (error) {
      console.error('Error al publicar receta:', error);
    }
  };
  // ... (otras funciones como uploadImage, pickImage para la imagen principal)

  // Nueva función para seleccionar imagen para un paso específico
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
      console.log(`pickImageForStep (${stepIndex}): imagen seleccionada:`, imageSelected);

      // Actualizar el estado local de la imagen para el paso
      const newSteps = [...steps];
      newSteps[stepIndex].imageUri = imageSelected.uri; // Guarda la URI local
      setSteps(newSteps);

      // Subir la imagen al servidor
      const uploadedUrl = await uploadImage(imageSelected.uri);

      if (uploadedUrl) {
        console.log(`pickImageForStep (${stepIndex}): URL subida recibida:`, uploadedUrl);
        // Actualizar el estado con la URL subida para el paso
        const updatedStepsWithUrl = [...newSteps]; // Usamos newSteps que ya tiene la URI local
        updatedStepsWithUrl[stepIndex].imageUrl = uploadedUrl;
        setSteps(updatedStepsWithUrl);
      }
    }
  };


   const handleNavigationPress = (screen: string) => {
     if (screen === 'Home') router.push('/home');
     if (screen === 'Search') router.push('/SearchScreen');
     if (screen === 'AddRecipe') router.push('/createRecepieScreen');
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
           value={recipeName}
           onChangeText={setRecipeName}
         />
         <TextInput
           style={[styles.input, descError ? styles.inputError : {}]}
           placeholder="Descripción"
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
        style={[styles.stepInput, stepError ? styles.inputError : {}]}
        placeholder={`ej. Agrega la sal lentamente`}
        multiline
        value={step.description} // CAMBIO AQUÍ: accede a la propiedad 'description'
        onChangeText={(value) => handleStepChange(index, value)}
      />
      
      {/* BOTÓN PARA SUBIR IMAGEN DEL PASO */}
      <TouchableOpacity 
        style={styles.stepImagePicker} // Nuevo estilo para el botón de la imagen del paso
        onPress={() => pickImageForStep(index)} // Llama a la nueva función con el índice del paso
      >
        {step.imageUrl ? ( // Si ya hay una URL subida, muestra la imagen
          <Image source={{ uri: step.imageUrl }} style={styles.stepSelectedImage} />
        ) : step.imageUri ? ( // Si hay una URI local, muestra la imagen
          <Image source={{ uri: step.imageUri }} style={styles.stepSelectedImage} />
        ) : ( // Si no hay imagen, muestra el icono de la cámara
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
         </View>
       </>
     );
 };

 export default CreateRecipeScreen;