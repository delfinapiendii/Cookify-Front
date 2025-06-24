import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import styles from './styles/searchScreenStyles';
import BottomNavigation from './components/navBar';
import LogoHeader from './components/logoHeader';
import RecipeList from './components/recepieList';
import { FontAwesome } from '@expo/vector-icons';
import ModalSelector from './components/modalSelector';
import RecipeGrid from './components/recipeGrid';
import CustomAlertModal from './components/alert';
import {
  searchByFilter,
  searchRecipesByTitle,
  fetchRecipes
} from '../hooks/hooks';

// === DEFINICIÓN DE CATEGORÍAS FIJAS ===
// Tomadas de createRecepieScreen
const FIXED_CATEGORIES = [
  'salado',
  'dulce',
  'artesanal',
  'vegetariana',
  'vegana',
  'postre',
];
// ======================================

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [isErrorSearchModalVisible, setIsErrorSearchModalVisible] = useState(false);

  // NUEVOS ESTADOS para el modal de categorías
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

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

  // Modificación en updateSearch:
  // Ahora, si hay un filtro activo (diferente de 'Nombre' que resetea el filtro),
  // la búsqueda en el TextInput debería re-ejecutar el filtro con el nuevo texto.
  const updateSearch = async (text: string) => {
    setSearchQuery(text);
    if (!filter || filter === 'Nombre') { // Si no hay filtro o el filtro es "Nombre"
      searchRecipesByTitle(text, setRecipes);
    } else {
      // Si hay un filtro activo (Ingredientes, Sin el ingrediente),
      // re-ejecuta el filtro con la nueva searchQuery
      hookfilter(filter === 'Ingredientes' ? 'ingrediente' : 'sin-ingrediente', text);
    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModalVisible(!isSortModalVisible);
  // Nuevo toggle para el modal de categorías
  const toggleCategoryModal = () => setCategoryModalVisible(!isCategoryModalVisible);

  useEffect(() => {
    fetchRecipes(setRecipes);
  }, []);

  // hookfilter ahora recibe la query como argumento
  const hookfilter = async (filterurl: string, query: string) => {
    try {
      await searchByFilter(filterurl, query, setRecipes); // Usamos await aquí
      // Puedes añadir una lógica para mostrar el error si no se encuentran recetas
      // if (recipes.length === 0 && query !== '') {
      //   setIsErrorSearchModalVisible(true);
      // }
    }
    catch (error) {
      console.error('Error al aplicar filtro:', error);
      fetchRecipes(setRecipes);
    }
  };

  const filterRecepies = async (option: string) => { // Cambiado a string para mayor claridad
    setFilter(option); // Establecer el filtro seleccionado

    if (option === 'Nombre') {
      setFilter(undefined); // Resetear el filtro si es "Nombre"
      updateSearch(searchQuery); // Re-ejecutar búsqueda por título
      toggleFilterModal(); // Cerrar el modal de filtros
    } else if (option === 'Categoría') {
      toggleFilterModal(); // Cerrar el modal de filtros actual
      toggleCategoryModal(); // Abrir el nuevo modal de categorías
      // No se llama a hookfilter aquí, se hará cuando se seleccione una categoría
    } else if (option === 'Ingredientes') {
      toggleFilterModal(); // Cerrar el modal de filtros
      hookfilter('ingrediente', searchQuery); // Usa searchQuery para ingredientes
    } else if (option === 'Sin el ingrediente') {
      toggleFilterModal(); // Cerrar el modal de filtros
      hookfilter('sin-ingrediente', searchQuery); // Usa searchQuery para sin-ingrediente
    } else {
      console.error('Filtro desconocido:', option);
      fetchRecipes(setRecipes);
      toggleFilterModal(); // Cerrar el modal de filtros
    }
  };

  // Nueva función para manejar la selección de categoría
  const handleCategorySelection = (categoryName: string) => {
    setSearchQuery(categoryName); // Poner la categoría seleccionada en el campo de búsqueda
    hookfilter('categoria', categoryName); // Realizar la búsqueda por categoría
    toggleCategoryModal(); // Cerrar el modal de categorías
    setFilter('Categoría'); // Mantener el filtro de categoría activo
  };

  const closeModalSuccess = () => {
    setIsErrorSearchModalVisible(false);
  };

  const handleDoneSearch = () => {
    setFilter(undefined);
    setSearchQuery('');
    fetchRecipes(setRecipes);
  }

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe?id=${recipeId}`);
  };

  const sortRecipes = (option: string) => {
    let sortedRecipes = [...recipes]; // Crea una copia para no mutar el estado directamente

    switch (option) {
      case 'De A a Z':
        sortedRecipes.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case 'De Z a A':
        sortedRecipes.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      case 'Novedad':
        // === CORRECCIÓN AQUÍ ===
        // Ordena por ID de forma descendente. Asume que IDs más altos son más nuevos.
        // Convertimos a número en caso de que sean strings numéricos.
        sortedRecipes.sort((a: any, b: any) => Number(b.id) - Number(a.id));
        break;
      case 'Usuario':
        // Asumiendo que 'chef' es la propiedad del usuario
        sortedRecipes.sort((a: any, b: any) => a.chef.localeCompare(b.chef));
        break;
      default:
        // No hacer nada si la opción no es reconocida
        break;
    }
    setRecipes(sortedRecipes); // Actualiza el estado con las recetas ordenadas
  };

  if (!fontsLoaded) {
    return <View><Text>Cargando fuentes...</Text></View>;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={[styles.containerHome]}>
          <LogoHeader />

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBarInputContainer}>
              <Ionicons
                name="search-outline"
                size={24}
                color="#86939e"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Buscar Receta"
                value={searchQuery}
                onChangeText={updateSearch}
                style={styles.searchBarInput}
                placeholderTextColor="#86939e"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleDoneSearch}>
                  <Ionicons name="close-circle-outline" size={24} color="#86939e" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filtros y Ordenar por */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
              <Ionicons name="filter-outline" size={20} color="#FF9A16" style={{ marginRight: 5 }} />
              <Text style={[styles.filterButtonText, { fontFamily: 'WorkSans_400Regular' }]}>
                Filtros
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortButton} onPress={toggleSortModal}>
              <FontAwesome name="sort-amount-desc" size={20} color="#888" style={{ marginRight: 5 }} />
              <Text style={[styles.sortButtonText, { fontFamily: 'WorkSans_400Regular' }]}>
                Ordenar por
              </Text>
            </TouchableOpacity>
          </View>

          {/* Resultados de búsqueda */}
          <Text style={styles.resultsCount}>{recipes.length} Recetas Encontradas</Text>
          <RecipeGrid
            recipes={recipes.map((r: any) => ({ ...r, rating: Number(r.rating) }))}
            onRecipePress={(id) => handleRecipePress(id)}
          />

          {/* Modal Filtros */}
          <ModalSelector
            visible={isFilterModalVisible}
            title="Filtrar"
            options={['Nombre', 'Ingredientes', 'Categoría', 'Sin el ingrediente']}
            onClose={toggleFilterModal}
            highlightedOption={filter}
            onSelectOption={(option) => {
              filterRecepies(option);
              // El toggleFilterModal se maneja dentro de filterRecepies para cada opción
            }}
          />

          {/* Modal Ordenar por */}
          <ModalSelector
            visible={isSortModalVisible}
            title="Ordenar por"
            options={['De A a Z', 'De Z a A', 'Novedad', 'Usuario']}
            highlightedOption={order}
            onClose={toggleSortModal}
            onSelectOption={(option) => {
              setOrder(String(option));
              toggleSortModal();
              sortRecipes(String(option)); // === LLAMADA A LA FUNCIÓN DE ORDENAMIENTO ===
            }}
          />

          {/* NUEVO MODAL DE CATEGORÍAS */}
          <ModalSelector
            visible={isCategoryModalVisible}
            title="Selecciona una Categoría"
            options={FIXED_CATEGORIES} // Usa las categorías fijas de createRecepieScreen
            onClose={toggleCategoryModal}
            // Resalta la categoría actual si searchQuery coincide con una categoría fija
            highlightedOption={FIXED_CATEGORIES.includes(searchQuery) ? searchQuery : undefined}
            onSelectOption={handleCategorySelection}
          />

          <CustomAlertModal
            isVisible={isErrorSearchModalVisible}
            message="Error en la elección de filtro"
            onConfirm={closeModalSuccess}
            confirmText="Aceptar"
            showCancelButton={false}
          />
        </ScrollView>

        <BottomNavigation />
      </View>
    </>
  );
};

export default SearchScreen;