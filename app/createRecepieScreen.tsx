import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert, 
  FlatList,
  Dimensions,
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
import CustomAlertModal from './components/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { publishRecipe, uploadImage, UsehandleDeleteRecipe, useCreatedRecipes } from '../hooks/hooks';
import * as Network from 'expo-network';


const { width } = Dimensions.get('window');
const ITEM_MARGIN_HORIZONTAL = 10;  
const TOTAL_MARGIN = ITEM_MARGIN_HORIZONTAL * 2;
const IMAGE_MAIN_WIDTH = width - TOTAL_MARGIN;
const ADD_BUTTON_WIDTH = 120; 

const CreateRecipeScreen = () => {
  const [recipeName, setRecipeName] = useState('');
  const [nameError, setNameError] = useState(false);

  const [description, setDescription] = useState('');
  const [descError, setDescError] = useState(false);

  const [recipeType, setRecipeType] = useState('');
  const [typeError, setTypeError] = useState(false);

  const [servings, setServings] = useState('');
  const [servingError, setServingError] = useState(false);

  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [ingredientNameErrors, setIngredientNameErrors] = useState<boolean[]>([]);
  const [ingredientQuantityErrors, setIngredientQuantityErrors] = useState<boolean[]>([]);

  const [steps, setSteps] = useState([{ description: '', imageUri: null as string | null, imageUrl: null as string | null }]);
  const [stepDescriptionErrors, setStepDescriptionErrors] = useState<boolean[]>([]);

  const [showPicker, setShowPicker] = useState(false);

  const [isDuplicateRecipeModalVisible, setIsDuplicateRecipeModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [images, setImages] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false); 
  const carouselData = [...imageUrls, 'ADD_BUTTON'];


  const { recipes } = useCreatedRecipes();

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
    setIngredientNameErrors(new Array(ingredients.length).fill(false));
    setIngredientQuantityErrors(new Array(ingredients.length).fill(false));
  }, [ingredients]);

  useEffect(() => {
    setStepDescriptionErrors(new Array(steps.length).fill(false));
  }, [steps]);

  if (!fontsLoaded) {
    return null;
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);

    if (field === 'name') {
      const newErrors = [...ingredientNameErrors];
      newErrors[index] = false;
      setIngredientNameErrors(newErrors);
    } else {
      const newErrors = [...ingredientQuantityErrors];
      newErrors[index] = false;
      setIngredientQuantityErrors(newErrors);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    setIngredientNameErrors(prev => prev.filter((_, i) => i !== index));
    setIngredientQuantityErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { description: '', imageUri: null, imageUrl: null }]);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].description = value;
    setSteps(newSteps);

    const newErrors = [...stepDescriptionErrors];
    newErrors[index] = false;
    setStepDescriptionErrors(newErrors);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    setStepDescriptionErrors(prev => prev.filter((_, i) => i !== index));
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
    setImages([]);
    setImageUrls([]); 

    setNameError(false);
    setDescError(false);
    setTypeError(false);
    setServingError(false);
    setImageError(false); 
    setIngredientNameErrors(new Array(1).fill(false));
    setIngredientQuantityErrors(new Array(1).fill(false));
    setStepDescriptionErrors(new Array(1).fill(false));
  };

  const handleConfirmReplace = async () => {
    console.log('Usuario eligió "Sí", reemplazando receta...');
    setIsDuplicateRecipeModalVisible(false);
    try {
      if (recipes && recipes.length > 0) {
        const existingRecipe = recipes.find(recipe => recipe.title === recipeName);
        console.log('Receta a reemplazar:', existingRecipe);

        if (existingRecipe) {
          await UsehandleDeleteRecipe(
            existingRecipe.id,
            () => { console.log('Receta eliminada exitosamente'); },
            (error) => { console.error('Error al eliminar receta:', error); Alert.alert("Error", "No se pudo eliminar la receta existente."); }
          );
        }
      }
      handleConfirm();
    } catch (error) {
      console.error('Error en el manejo de recetas duplicadas:', error);
      Alert.alert("Error", "Ocurrió un error al intentar reemplazar la receta.");
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
    Alert.alert("Permiso Denegado", "Necesitamos permiso para acceder a tu galería.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: false,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    const selected = result.assets[0];

    try {
      const uploadedUrl = await uploadImage(selected.uri);
      console.log("Imagen subida con éxito:", uploadedUrl);
      if (uploadedUrl) {
        setImageUrls(prev => [...prev, uploadedUrl]); 
        setImageError(false); 
      } else {
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "Fallo en la carga de imagen.");
    }
  }
};
  

  const handlePublishRecipe = async () => {
    let isValid = true;

    
    if (!images && !imageUrls) { 
      setImageError(true);
      isValid = false;
    } else {
      setImageError(false);
    }

    if (!recipeName.trim()) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (!description.trim()) {
      setDescError(true);
      isValid = false;
    } else {
      setDescError(false);
    }

    if (!recipeType.trim()) {
      setTypeError(true);
      isValid = false;
    } else {
      setTypeError(false);
    }

    if (!servings.trim() || isNaN(Number(servings)) || Number(servings) <= 0) {
      setServingError(true);
      isValid = false;
    } else {
      setServingError(false);
    }

    const newIngredientNameErrors = new Array(ingredients.length).fill(false);
    const newIngredientQuantityErrors = new Array(ingredients.length).fill(false);
    ingredients.forEach((ing, index) => {
      if (!ing.name.trim()) {
        newIngredientNameErrors[index] = true;
        isValid = false;
      }

      if (!ing.quantity.trim() || isNaN(Number(ing.quantity)) || Number(ing.quantity) <= 0) {
        newIngredientQuantityErrors[index] = true;
        isValid = false;
      }
    });
    setIngredientNameErrors(newIngredientNameErrors);
    setIngredientQuantityErrors(newIngredientQuantityErrors);

    const newStepDescriptionErrors = new Array(steps.length).fill(false);
    steps.forEach((step, index) => {
      if (!step.description.trim()) {
        newStepDescriptionErrors[index] = true;
        isValid = false;
      }
    });
    setStepDescriptionErrors(newStepDescriptionErrors);

    if (!isValid) {
      Alert.alert('Campos Obligatorios', 'Por favor, completa todos los campos requeridos y asegúrate de que las cantidades sean válidas, incluyendo la imagen principal.');
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
        imageUrls,
        () => handleConfirm(),
        (msg) => {
          if (msg && msg.includes('Ya existe una receta')) {
            setIsDuplicateRecipeModalVisible(true);
          } else {
            Alert.alert('Error al Publicar', msg || 'Ocurrió un error desconocido al publicar la receta.');
          }
        }
      );
    } catch (error) {
      console.error('Error al publicar receta:', error);
      Alert.alert('Error', 'Ocurrió un error de red o servidor al intentar publicar la receta.');
    }
  };

  const pickImageForStep = async (stepIndex: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permiso Denegado", "Necesitamos permiso para acceder a tu galería.");
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

      try {
        const uploadedUrl = await uploadImage(imageSelected.uri);
        if (uploadedUrl) {
          const updatedStepsWithUrl = [...newSteps];
          updatedStepsWithUrl[stepIndex].imageUrl = uploadedUrl;
          setSteps(updatedStepsWithUrl);
        } else {
          Alert.alert("Error", "No se pudo subir la imagen del paso.");
          newSteps[stepIndex].imageUri = null;
          setSteps(newSteps);
        }
      } catch (uploadError) {
        console.error("Error al subir la imagen del paso:", uploadError);
        Alert.alert("Error", "Fallo en la carga de la imagen del paso.");
        newSteps[stepIndex].imageUri = null;
        setSteps(newSteps);
      }
    }
  };

  
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={styles.container}>
          <LogoHeader />

          <Text style={styles.title}></Text>
<View style={[styles.carouselContainer, imageError ? styles.inputErrorCarrousel : {}]}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={carouselData}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={({ item }) => {
          if (item === 'ADD_BUTTON') {
            return (
              <TouchableOpacity
                style={styles.imagePickerCarrousel}
                onPress={pickImage}
              >
                <View style={styles.cameraIconContainerCarrousel}>
                  <Ionicons name="camera" size={40} color="#888" />
                  <Ionicons name="add-circle" size={20} color="#555" style={styles.addIconCarrousel} />
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <Image
                source={{ uri: item }}
                style={styles.selectedImageCarrusel}
              />
            );
          }
        }}
        contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN_HORIZONTAL }} 
      />
      {/* Nueva vista para la flecha de navegación, visible solo si hay más de 1 imagen (+ el botón) */}
      {carouselData.length > 1 && (
        <View style={styles.carouselArrowContainer}>
          <Ionicons name="chevron-forward-circle" size={30} color="#555" />
        </View>
      )}
    </View>

          <TextInput
            style={[styles.input, nameError ? styles.inputError : {}]}
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={recipeName}
            onChangeText={(value) => {
              setRecipeName(value);
              setNameError(false);
            }}
          />
          <TextInput
            style={[styles.input, descError ? styles.inputError : {}]}
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
              styles.pickerButton,
              { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', alignItems: 'center' },
              typeError ? styles.inputError : {}
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Text style={[styles.servingsInput, recipeType ? {} : { color: '#888' }]}>
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
              onChangeText={(value) => {
                setServings(value);
                setServingError(false);
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agregar ingredientes</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TextInput
                  style={[styles.ingredientInput, ingredientNameErrors[index] ? styles.inputError : {}]}
                  placeholder="ej. Comino"
                  placeholderTextColor="#888"
                  value={ingredient.name}
                  onChangeText={(value) => handleIngredientChange(index, 'name', value)}
                />
                <TextInput
                  style={[styles.quantityInput, ingredientQuantityErrors[index] ? styles.inputError : {}]}
                  placeholder="ej. 200 g"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
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
                  style={[styles.stepInput, stepDescriptionErrors[index] ? styles.inputError : {}]}
                  placeholder={`ej. Agrega la sal lentamente`}
                  placeholderTextColor="#888"
                  multiline
                  value={step.description}
                  onChangeText={(value) => handleStepChange(index, value)}
                />

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
            options={['salado', 'dulce', 'vegetariana', 'vegana', 'postre']}
            highlightedOption={recipeType.charAt(0).toUpperCase() + recipeType.slice(1)}
            onClose={() => setShowPicker(false)}
            onSelectOption={(option: string) => {
              setRecipeType(option.toLowerCase());
              setTypeError(false);
              setShowPicker(false);
            }}
          />

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

          
          <CustomAlertModal
            isVisible={isSuccessModalVisible}
            message="¡Receta creada con éxito!"
            onConfirm={() => {
                closeModalSuccess();
                router.push('/pendingProfile');
            }}
            confirmText="Aceptar"
            showCancelButton={false}
          />

          <CustomAlertModal
            isVisible={isDeleteModalVisible}
            message="Receta Eliminada"
            onConfirm={() => setIsDeleteModalVisible(false)}
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