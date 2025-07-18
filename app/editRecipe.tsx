// app/editRecipe.tsx

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate de que estas rutas sean correctas
import LogoHeader from './components/logoHeader';
import NavBar from './components/navBar'; // Posible fuente del error si tiene un ScrollView/FlatList vertical interno
import ModalSelector from './components/modalSelector';
import CustomAlertModal from './components/alert';

// Importa tus estilos separados
import editRecipeStyles from './styles/editrecipeStyles'; // Asegúrate que el nombre del archivo es 'editRecipeStyles.ts'

// Importa tus funciones de API
import { fetchRecipeDetails, useUpdateRecipe } from '../hooks/hooks';


const { width } = Dimensions.get('window');

interface RecipeDetail {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  porciones: number;
  composiciones: Array<{ ingrediente: string; cantidad: string }>;
  pasos: Array<{ orden: number; descripcion: string; imagenUrl?: string }>;
  imagenes: string[];
  valoracionPromedio?: number;
}

const EditRecipeScreen = () => {
    const { id } = useLocalSearchParams();
    const recipeId = typeof id === 'string' ? id : '';

    // ¡¡¡CORRECCIÓN CLAVE AQUÍ!!!
    // Inicializa el hook useUpdateRecipe correctamente


  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState([{ ingrediente: '', cantidad: '' }]);
  const [steps, setSteps] = useState<{ orden: number; descripcion: string; imagenUrl?: string }[]>(
    [{ orden: 1, descripcion: '', imagenUrl: undefined }]
  );
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [servingError, setServingError] = useState(false);
  const [ingredientNameErrors, setIngredientNameErrors] = useState<boolean[]>([]);
  const [ingredientQuantityErrors, setIngredientQuantityErrors] = useState<boolean[]>([]);
  const [stepDescriptionErrors, setStepDescriptionErrors] = useState<boolean[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  // Mantengo isUpdatingLocal por si hay otra lógica de carga que no sea del hook,
  // pero para el botón, usaremos isUpdatingHook o una combinación de ambos.
  const [isUpdatingLocal, setIsUpdatingLocal] = useState(false);


  const [fontsLoaded] = useFonts({ WorkSans_400Regular, WorkSans_700Bold });


  useEffect(() => {
    if (!fontsLoaded) SplashScreen.preventAutoHideAsync();
    else SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      setError(null);
      fetchRecipeDetails(
        recipeId,
        (data: RecipeDetail) => {
          setRecipe(data);
          setRecipeName(data.titulo || '');
          setDescription(data.descripcion || '');
          setRecipeType(data.tipo || '');
          setServings(String(data.porciones || ''));
          setIngredients(
            data.composiciones && data.composiciones.length > 0
              ? data.composiciones.map((ing: any) => ({
                  ingrediente: ing.ingrediente,
                  cantidad: String(ing.cantidad),
                }))
              : [{ ingrediente: '', cantidad: '' }]
          );
          setSteps(
            data.pasos && data.pasos.length > 0
              ? data.pasos.map((step: any) => ({
                  orden: step.orden,
                  descripcion: step.descripcion,
                  imageUrl: step.imagenUrl || undefined,
                }))
              : [{ orden: 1, descripcion: '', imageUrl: undefined }]
          );
          setMainImages(data.imagenes || []);
        },
        (porciones: number) => setServings(String(porciones)),
        (rating: number) => setUserRating(rating),
        (loadingStatus: boolean) => setLoading(loadingStatus),
        (errorMsg: string) => {
            Alert.alert('Error al cargar receta', errorMsg);
            router.back();
          },
        (bookmarkedStatus: boolean) => setIsBookmarked(bookmarkedStatus)
      );
    } else {
      Alert.alert('Error', 'ID de receta no proporcionado para edición.');
      router.back();
    }
  }, [recipeId, fontsLoaded]);

  useEffect(() => {
    setIngredientNameErrors(new Array(ingredients.length).fill(false));
    setIngredientQuantityErrors(new Array(ingredients.length).fill(false));
  }, [ingredients.length]);

  useEffect(() => {
    setStepDescriptionErrors(new Array(steps.length).fill(false));
  }, [steps.length]);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF9A16" />
        <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'WorkSans_400Regular' }}>Cargando receta...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', fontFamily: 'WorkSans_400Regular' }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: '#FF9A16', borderRadius: 5 }}>
          <Text style={{ color: '#fff', fontFamily: 'WorkSans_700Bold' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingrediente: '', cantidad: '' }]);
  };

  const handleIngredientChange = (index: number, field: 'ingrediente' | 'cantidad', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
    const newErrors = field === 'ingrediente' ? [...ingredientNameErrors] : [...ingredientQuantityErrors];
    newErrors[index] = false;
    field === 'ingrediente' ? setIngredientNameErrors(newErrors) : setIngredientQuantityErrors(newErrors);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    setIngredientNameErrors(prev => prev.filter((_, i) => i !== index));
    setIngredientQuantityErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { orden: steps.length + 1, descripcion: '', imagenUrl: undefined }]);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].descripcion = value;
    setSteps(newSteps);
    const newErrors = [...stepDescriptionErrors];
    newErrors[index] = false;
    setStepDescriptionErrors(newErrors);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, idx) => ({ ...step, orden: idx + 1 }));
    setSteps(newSteps);
    setStepDescriptionErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    let isValid = true;

    if (!recipeName.trim()) { setNameError(true); isValid = false; } else { setNameError(false); }
    if (!description.trim()) { setDescError(true); isValid = false; } else { setDescError(false); }
    if (!recipeType.trim()) { setTypeError(true); isValid = false; } else { setTypeError(false); }
    if (!servings.trim() || isNaN(Number(servings)) || Number(servings) <= 0) { setServingError(true); isValid = false; } else { setServingError(false); }

    const newIngredientNameErrors = new Array(ingredients.length).fill(false);
    const newIngredientQuantityErrors = new Array(ingredients.length).fill(false);
    ingredients.forEach((ing, index) => {
      if (!ing.ingrediente.trim()) { newIngredientNameErrors[index] = true; isValid = false; }
      if (!ing.cantidad.trim()) { newIngredientQuantityErrors[index] = true; isValid = false; }
    });
    setIngredientNameErrors(newIngredientNameErrors);
    setIngredientQuantityErrors(newIngredientQuantityErrors);

    const newStepDescriptionErrors = new Array(steps.length).fill(false);
    steps.forEach((step, index) => {
      if (!step.descripcion.trim()) { newStepDescriptionErrors[index] = true; isValid = false; }
    });
    setStepDescriptionErrors(newStepDescriptionErrors);

    if (!isValid) {
      Alert.alert('Campos Obligatorios', 'Por favor, completa todos los campos requeridos y asegúrate de que las cantidades sean válidas.');
      return;
    }

    setIsUpdatingLocal(true);
    try {
        const payload = {
          titulo: recipeName,
          descripcion: description,
          tipo: recipeType,
          porciones: Number(servings),
          composiciones: ingredients,
          pasos: steps,
        };

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'No se encontró token de autenticación.');
          setIsUpdatingLocal(false);
          return;
        }

        console.log('Enviando datos de edición:', payload);

        
        // ¡¡¡CORRECCIÓN CLAVE AQUÍ!!!
        // Llama a la función `updateRecipe` devuelta por el hook, no al hook directamente

        
      } catch (error: any) {
        console.error('Error al editar receta:', error);
        Alert.alert('Error al guardar', 'Hubo un error al guardar los cambios: ' + (error.message || 'Error desconocido'));
      } finally {
        setIsUpdatingLocal(false);
      }
  };

  const closeModalSuccess = () => {
    setIsSuccessModalVisible(false);
    router.back();
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={editRecipeStyles.container}>
          {/* Header con botón de retroceso */}
          <View style={editRecipeStyles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={editRecipeStyles.backButton}>
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
            <LogoHeader />
          </View>

          <Text style={editRecipeStyles.title}>Editar Receta</Text>

          {/* Carrusel de imágenes - Solo para VISUALIZAR las imágenes existentes */}
          {mainImages.length > 0 ? (
            // Este FlatList es horizontal, por lo que no debería causar el error si el ScrollView es vertical.
            <FlatList
              data={mainImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `main-image-${index}`}
              renderItem={({ item }) => (
                <View style={[editRecipeStyles.mainImageContainer, { width: width - 40 }]}>
                  <Image source={{ uri: item }} style={editRecipeStyles.mainImage} resizeMode="cover" />
                </View>
              )}
            />
          ) : (
            <View style={editRecipeStyles.imagePlaceholderContainer}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="image-outline" size={50} color="#888" />
                <Text style={editRecipeStyles.imagePlaceholderIconText}>Sin imágenes principales</Text>
              </View>
            </View>
          )}
          <Text style={{textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 20, fontFamily: 'WorkSans_400Regular'}}>Las imágenes de la receta no se pueden editar.</Text>


          <TextInput
            style={[editRecipeStyles.input, nameError ? editRecipeStyles.inputError : {}]}
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={recipeName}
            onChangeText={(value) => {
              setRecipeName(value);
              setNameError(false);
            }}
          />
          <TextInput
            style={[editRecipeStyles.input, descError ? editRecipeStyles.inputError : {}]}
            placeholder="Descripción"
            placeholderTextColor="#888"
            multiline
            value={description}
            onChangeText={(value) => {
              setDescription(value);
              setDescError(false);
            }}
          />

          <TouchableOpacity
            style={[
              editRecipeStyles.pickerButton,
              { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', alignItems: 'center' },
              typeError ? editRecipeStyles.inputError : {}
            ]}
            onPress={() => setShowPicker(true)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              <Text style={[editRecipeStyles.servingsInput, recipeType ? { fontFamily: 'WorkSans_400Regular', color: '#333' } : { color: '#888', fontFamily: 'WorkSans_400Regular' }]}>
                {recipeType
                  ? recipeType.charAt(0).toUpperCase() + recipeType.slice(1)
                  : 'Seleccionar tipo de receta'}
              </Text>
              <AntDesign name="caretdown" size={10} color="#555" />
            </View>
          </TouchableOpacity>


          <View style={[editRecipeStyles.servingsContainer, servingError ? editRecipeStyles.inputError : {}]}>
            <Ionicons name="people-outline" size={24} color="#555" style={editRecipeStyles.servingsIcon} />
            <TextInput
              style={[editRecipeStyles.servingsInput, { fontFamily: 'WorkSans_400Regular' }]}
              placeholder="Cantidad de porciones"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              value={servings}
              onChangeText={(value) => {
                setServings(value);
                setServingError(false);
              }}
            />
          </View>

          <View style={editRecipeStyles.section}>
            <Text style={[editRecipeStyles.sectionTitle, { fontFamily: 'WorkSans_700Bold' }]}>Ingredientes</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={editRecipeStyles.ingredientRow}>
                <TextInput
                  style={[editRecipeStyles.ingredientInput, ingredientNameErrors[index] ? editRecipeStyles.inputError : {}, { fontFamily: 'WorkSans_400Regular' }]}
                  placeholder="ej. Comino"
                  placeholderTextColor="#888"
                  value={ingredient.ingrediente}
                  onChangeText={(value) => handleIngredientChange(index, 'ingrediente', value)}
                />
                <TextInput
                  style={[editRecipeStyles.quantityInput, ingredientQuantityErrors[index] ? editRecipeStyles.inputError : {}, { fontFamily: 'WorkSans_400Regular' }]}
                  placeholder="ej. 200 g"
                  placeholderTextColor="#888"
                  value={ingredient.cantidad}
                  onChangeText={(value) => handleIngredientChange(index, 'cantidad', value)}
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
                    <Ionicons name="close-circle-outline" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={editRecipeStyles.addIngredientButton} onPress={handleAddIngredient}>
              <Ionicons name="add-circle-outline" size={30} color="#5CB85C" />
            </TouchableOpacity>
          </View>

          <View style={editRecipeStyles.section}>
            <Text style={[editRecipeStyles.sectionTitle, { fontFamily: 'WorkSans_700Bold' }]}>Pasos</Text>
            {steps.map((step, index) => (
              <View key={index} style={editRecipeStyles.stepRow}>
                <TextInput
                  style={[editRecipeStyles.stepInput, stepDescriptionErrors[index] ? editRecipeStyles.inputError : {}, { fontFamily: 'WorkSans_400Regular' }]}
                  placeholder={`Paso ${index + 1}: ej. Agrega la sal lentamente`}
                  placeholderTextColor="#888"
                  multiline
                  value={step.descripcion}
                  onChangeText={(value) => handleStepChange(index, value)}
                />
                <View style={editRecipeStyles.stepImagePlaceholder}>
                  {step.imagenUrl ? (
                    <Image source={{ uri: step.imagenUrl }} style={editRecipeStyles.stepExistingImage} />
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons name="image-outline" size={24} color="#BBB" />
                      <Text style={editRecipeStyles.stepImagePlaceholderText}>No editable</Text>
                    </View>
                  )}
                </View>

                {steps.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                    <Ionicons name="close-circle-outline" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={editRecipeStyles.addStepButton} onPress={handleAddStep}>
              <Ionicons name="add-circle-outline" size={30} color="#5CB85C" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={editRecipeStyles.publishButton} onPress={handleSaveChanges} disabled={isUpdatingLocal }>
            {isUpdatingLocal ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={editRecipeStyles.publishButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          <ModalSelector
            visible={showPicker}
            title="Selecciona el tipo de receta"
            options={['Salado', 'Dulce', 'Vegetariana', 'Vegana', 'Postre']}
            highlightedOption={recipeType ? recipeType.charAt(0).toUpperCase() + recipeType.slice(1) : ''}
            onClose={() => setShowPicker(false)}
            onSelectOption={(option: string) => {
              setRecipeType(option.toLowerCase());
              setTypeError(false);
              setShowPicker(false);
            }}
          />

          <CustomAlertModal
            isVisible={isSuccessModalVisible}
            message="¡Receta actualizada con éxito!"
            onConfirm={closeModalSuccess}
            confirmText="Aceptar"
            showCancelButton={false}
          />
        </ScrollView>
        <NavBar />
      </View>
    </>
  );
};

export default EditRecipeScreen;