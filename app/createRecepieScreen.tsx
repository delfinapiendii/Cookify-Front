import React, { useState } from 'react';
 import {
   ScrollView,
   View,
   Text,
   TextInput,
   TouchableOpacity,
   Image,
   StyleSheet,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';
 import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

 const CreateRecipeScreen = () => {
   const [recipeName, setRecipeName] = useState('');
   const [description, setDescription] = useState('');
   const [recipeType, setRecipeType] = useState('');
   const [servings, setServings] = useState('');
   const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
   const [steps, setSteps] = useState(['']);

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

   const handlePublishRecipe = () => {
     // Aquí iría la lógica para guardar la receta
     console.log('Receta a publicar:', {
       recipeName,
       description,
       recipeType,
       servings,
       ingredients,
       steps,
     });
   };
   const handleNavigationPress = (screen: string) => {
         if (screen == 'Home') {
            router.push('/home'); // Corrected the typo in the path
         }  
       if (screen == 'Search') {
         router.push('/SearchScreen'); // Corrected the typo in the path
       }
       if (screen == 'AddRecipe') {
           router.push('/createRecepieScreen'); // Corrected the typo in the path
         }
       console.log(`Navegar a: ${screen}`);
       // Ejemplo de navegación usando expo-router:
       // navigation.navigate(screen);
     };

   return (
     <><ScrollView style={styles.container}>

           <View style={styles.logoContainer}>
               <Image
                   source={require('../assets/images/logoWhite.png')}
                   style={styles.logo}
                   resizeMode="contain" />
           </View>
           <View style={styles.header}>
               <Text style={styles.title}>Crear Receta</Text>
           </View>

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
               onChangeText={setRecipeName} />
           <TextInput
               style={styles.textArea}
               placeholder="Descripción"
               multiline
               value={description}
               onChangeText={setDescription} />

           <View style={styles.pickerContainer}>
               <Picker
                   selectedValue={recipeType}
                   style={styles.picker}
                   onValueChange={(itemValue: React.SetStateAction<string>) => setRecipeType(itemValue)}
               >
                   <Picker.Item label="Seleccionar tipo de receta" value="" />
                   <Picker.Item label="Desayuno" value="desayuno" />
                   <Picker.Item label="Almuerzo" value="almuerzo" />
                   <Picker.Item label="Cena" value="cena" />
                   {/* Agrega más tipos de receta */}
               </Picker>
           </View>

           <View style={styles.servingsContainer}>
               <Ionicons name="person-outline" size={24} color="#555" style={styles.servingsIcon} />
               <TextInput
                   style={styles.servingsInput}
                   placeholder="Cantidad de porciones"
                   keyboardType="number-pad"
                   value={servings}
                   onChangeText={setServings} />
           </View>

           <View style={styles.section}>
               <Text style={styles.sectionTitle}>Agregar ingredientes</Text>
               {ingredients.map((ingredient, index) => (
                   <View key={index} style={styles.ingredientRow}>
                       <TextInput
                           style={styles.ingredientInput}
                           placeholder="ej. Comino"
                           value={ingredient.name}
                           onChangeText={(value) => handleIngredientChange(index, 'name', value)} />
                       <TextInput
                           style={styles.quantityInput}
                           placeholder="ej. 200 g"
                           value={ingredient.quantity}
                           onChangeText={(value) => handleIngredientChange(index, 'quantity', value)} />
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
                           onChangeText={(value) => handleStepChange(index, value)} />
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

           <TouchableOpacity style={styles.removeRecipeButton}>
               <Ionicons name="trash-outline" size={20} color="#FF4D4D" style={styles.trashIcon} />
               <Text style={styles.removeRecipeText}>Eliminar receta</Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.publishButton} onPress={handlePublishRecipe}>
               <Text style={styles.publishButtonText}>Publicar</Text>
           </TouchableOpacity>
       </ScrollView>
       
       
       
       <View style={styles.bottomNavigation}>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Home')}>
           <Ionicons name="home-outline" size={24} color="#333" />
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Search')}>
           <Ionicons name="search-outline" size={24} color="#333" />
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('AddRecipe')}>
           <View style={styles.addButton}>
             <Ionicons name="add" size={32} color="#000000" />
           </View>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Bookmarks')}>
           <Ionicons name="book-outline" size={24} color="#333" />
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavigationPress('Profile')}>
           <Ionicons name="person-outline" size={24} color="#333" />
         </TouchableOpacity>
       </View></>
     
   );
 };

 const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo: {
        width: 150.24,
        height: 58.55,
        marginBottom: 20,
    
      },
   container: {
     flex: 1,
     padding: 20,
     backgroundColor: '#FFFFFF',
   },
   header: {
     alignItems: 'center',
     marginBottom: 20,
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
   },
   imagePicker: {
     backgroundColor: '#ddd',
     borderRadius: 10,
     height: 100,
     width: '100%',
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 20,
   },
   cameraIconContainer: {
     alignItems: 'center',
     justifyContent: 'center',
   },
   addIcon: {
     position: 'absolute',
     bottom: 0,
     right: 0,
   },
   input: {
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 15,
     marginBottom: 15,
     borderWidth: 1,
     borderColor: '#ccc',
     fontFamily: 'WorkSans_400Regular',
   },
   textArea: {
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 15,
     marginBottom: 15,
     borderWidth: 1,
     borderColor: '#ccc',
     fontFamily: 'WorkSans_400Regular',
     minHeight: 80,
     textAlignVertical: 'top',
   },
   pickerContainer: {
     backgroundColor: '#fff',
     borderRadius: 8,
     marginBottom: 15,
     borderWidth: 1,
     borderColor: '#ccc',
   },
   picker: {
     height: 50,
     fontFamily: 'WorkSans_400Regular',
   },
   servingsContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#fff',
     borderRadius: 8,
     paddingHorizontal: 15,
     paddingVertical: 10,
     marginBottom: 15,
     borderWidth: 1,
     borderColor: '#ccc',
   },
   servingsIcon: {
     marginRight: 10,
   },
   servingsInput: {
     flex: 1,
     fontFamily: 'WorkSans_400Regular',
   },
   section: {
     marginBottom: 20,
   },
   sectionTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     marginBottom: 10,
     fontFamily: 'WorkSans_700Bold',
   },
   ingredientRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 10,
   },
   ingredientInput: {
     flex: 2,
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 10,
     marginRight: 10,
     borderWidth: 1,
     borderColor: '#ddd',
     fontFamily: 'WorkSans_400Regular',
   },
   quantityInput: {
     flex: 1,
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 10,
     marginRight: 10,
     borderWidth: 1,
     borderColor: '#ddd',
     fontFamily: 'WorkSans_400Regular',
   },
   addIngredientButton: {
     alignSelf: 'flex-start',
     marginTop: 10,
   },
   stepRow: {
     flexDirection: 'row',
     alignItems: 'flex-start',
     marginBottom: 10,
   },
   stepInput: {
     flex: 1,
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 10,
     marginRight: 10,
     borderWidth: 1,
     borderColor: '#ddd',
     fontFamily: 'WorkSans_400Regular',
     minHeight: 60,
     textAlignVertical: 'top',
   },
   addStepButton: {
     alignSelf: 'flex-start',
     marginTop: 10,
   },
   removeRecipeButton: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 12,
     backgroundColor: '#FFFFFF',
     borderRadius: 8,
     borderWidth: 1,
     borderColor: '#ddd',
     marginBottom: 20,
   },
   trashIcon: {
     marginRight: 10,
   },
   removeRecipeText: {
     color: '#FF4D4D',
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
   },
   publishButton: {
     backgroundColor: '#FF9A16',
     borderRadius: 8,
     paddingVertical: 15,
     alignItems: 'center',
     marginBottom: 130,
   },
   publishButtonText: {
     color: '#fff',
     fontSize: 18,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
   },

   bottomNavigation: {
    position: 'absolute',
    bottom: 20,
    left: 7,
    right: 7,
    borderRadius: 30,
    backgroundColor: '#FFD091',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#FF9A16', // Color naranja similar
    borderRadius: 30,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:2,
  },
 });

 export default CreateRecipeScreen;