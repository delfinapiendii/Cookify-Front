import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import styles from './styles/searchScreenStyles';
import BottomNavigation from './components/navBar'; // Cambié a BottomNavigation si ese es el nombre correcto
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
  'postre',
];

// Define la altura que necesita la NavBar más un pequeño margen
  // (PaddingVertical de 10*2 + altura de icono ~40 + bottom de 20 + borde 2 + margen extra 8)
  const NAV_BAR_SAFE_AREA_HEIGHT = 82; // Ajusta este valor si es necesario, 100px es un buen inicio.
// ======================================

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSortModalVisible, setSortModal] = useState(false); 
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

  
  const updateSearch = async (text: string) => {
    setSearchQuery(text);
    if (!filter || filter === 'Nombre') { // Si no hay filtro o el filtro es "Nombre"
      searchRecipesByTitle(text, setRecipes);
    } else {
      hookfilter(filter === 'Ingredientes' ? 'ingrediente' : 'sin-ingrediente', text);
    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModal(!isSortModalVisible);
  const toggleCategoryModal = () => setCategoryModalVisible(!isCategoryModalVisible);

  useEffect(() => {
    fetchRecipes(setRecipes);
  }, []);

  // hookfilter ahora recibe la query como argumento
  const hookfilter = async (filterurl: string, query: string) => {
    try {
      await searchByFilter(filterurl, query, setRecipes); 
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
        sortedRecipes.sort((a: any, b: any) => {
          const chefA = a.chef || ''; // Usa string vacío si chef es null/undefined
          const chefB = b.chef || ''; // Usa string vacío si chef es null/undefined
          return chefA.localeCompare(chefB);
        });
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
        {/* El ScrollView ocupa todo el espacio del View padre y desplaza su contenido */}
        <ScrollView
          style={{ flex: 1 }} // Asegura que el ScrollView pueda expandirse y usar el espacio
          contentContainerStyle={[
            styles.containerHome,
            localStyles.scrollViewContentPadding,
          ]}
        >
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

          {/* Modals... */}
          <ModalSelector
            visible={isFilterModalVisible}
            title="Filtrar"
            options={['Nombre', 'Ingredientes', 'Categoría', 'Sin el ingrediente']}
            onClose={toggleFilterModal}
            highlightedOption={filter}
            onSelectOption={(option) => {
              filterRecepies(option);
            }}
          />

          <ModalSelector
            visible={isSortModalVisible}
            title="Ordenar por"
            options={['De A a Z', 'De Z a A', 'Novedad', 'Usuario']}
            highlightedOption={order}
            onClose={toggleSortModal}
            onSelectOption={(option) => {
              setOrder(String(option));
              toggleSortModal();
              sortRecipes(String(option));
            }}
          />

          <ModalSelector
            visible={isCategoryModalVisible}
            title="Selecciona una Categoría"
            options={FIXED_CATEGORIES}
            onClose={toggleCategoryModal}
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
      </View>

      {/* Nuevo contenedor para la BottomNavigation y su fondo */}
      <View style={localStyles.navBarWrapper}>
        {/* La capa blanca que ocultará el contenido */}
        <View style={localStyles.navBarBackground} />
        {/* Tu BottomNavigation existente */}
        <BottomNavigation />
      </View>
    </>
  );
};

// Se define un nuevo StyleSheet para los estilos locales específicos de este componente.
const localStyles = StyleSheet.create({
  scrollViewContentPadding: {
    paddingBottom: NAV_BAR_SAFE_AREA_HEIGHT, // Sigue siendo necesario para empujar el contenido
  },
  navBarWrapper: {
    position: 'absolute',
    bottom: 0, // Posiciona el contenedor en la parte inferior de la pantalla
    left: 0,
    right: 0,
    height: NAV_BAR_SAFE_AREA_HEIGHT + 20, // Altura de la NavBar + el offset 'bottom: 20' + un poco más si es necesario
    // Asegúrate de que esta altura cubra completamente la NavBar y el espacio debajo de ella.
    // Experimenta con este valor.
    overflow: 'hidden', // Importante para que el contenido no se escape si el fondo es más grande
  },
  navBarBackground: {
    position: 'absolute',
    bottom: 0, // Inicia desde el fondo del wrapper
    left: 0,
    right: 0,
    height: '100%', // Se expande para cubrir todo el wrapper
    backgroundColor: '#fff', // El color blanco que ocultará el contenido
    zIndex: 1, // Debe estar detrás de la NavBar pero delante del contenido
  },
});

export default SearchScreen;