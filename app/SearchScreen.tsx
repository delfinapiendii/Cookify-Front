import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
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
import BottomNavigation from './components/navBar';
import LogoHeader from './components/logoHeader';
import RecipeGrid from './components/recipeGrid'; // RecipeList no se usa, solo RecipeGrid
import { FontAwesome } from '@expo/vector-icons';
import ModalSelector from './components/modalSelector';
import CustomAlertModal from './components/alert';
import {
  searchByFilter,
  searchRecipesByTitle,
  fetchRecipes,
  searchByAlias,
} from '../hooks/hooks';

const FIXED_CATEGORIES = [
  'salado',
  'dulce',
  'artesanal',
  'vegetariana',
  'postre',
];


const SearchScreen = () => {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSortModalVisible, setSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aliasQuery, setAliasQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [activeFilter, setActiveFilter] = useState<'Nombre' | 'Ingredientes' | 'Categoría' | 'Sin el ingrediente' | 'Usuario' | undefined>('Nombre'); // Estado para el filtro ACTIVO
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [isErrorSearchModalVisible, setIsErrorSearchModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // === Implementación del debounce ===
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = async (query: string, currentFilter: string | undefined) => {
    if (query.trim() === '') {
      fetchRecipes(setRecipes); // Si la búsqueda está vacía, mostrar todas las recetas
      return;
    }

    if (!currentFilter || currentFilter === 'Nombre') {
      await searchRecipesByTitle(query, setRecipes);
    } else if (currentFilter === 'Ingredientes') {
      await hookfilter('ingrediente', query);
    } else if (currentFilter === 'Sin el ingrediente') {
      await hookfilter('sin-ingrediente', query);
    } else if (currentFilter === 'Categoría') {
      await hookfilter('categoria', query);
    } else if (currentFilter === 'Usuario') { 
      await searchByAlias(query, setRecipes);
    }
  }

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(text, activeFilter);
    }, 500); // <--- No necesita 'as any' aquí
  };
  // ====================================

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

  // useEffect inicial para cargar todas las recetas al montar la pantalla por primera vez
  // Y establecer el filtro por defecto a 'Nombre'
  useEffect(() => {
    fetchRecipes(setRecipes);
    setActiveFilter('Nombre'); // Establece el filtro por defecto a 'Nombre'
  }, []);

  // useEffect para ejecutar la búsqueda cada vez que cambie el filtro activo (no el query de texto)
  useEffect(() => {
    if (activeFilter && activeFilter !== 'Nombre' && searchQuery.trim() !== '') {
      // Si hay un filtro activo diferente de 'Nombre' y hay una búsqueda, ejecutarla
      performSearch(searchQuery, activeFilter);
    } else if (activeFilter === 'Nombre' && searchQuery.trim() === '') {
        // Si el filtro es nombre y no hay texto, trae todo de nuevo
        fetchRecipes(setRecipes);
    } else if (activeFilter === 'Nombre' && searchQuery.trim() !== '') {
        // Si el filtro es nombre y hay texto, buscar por título (debounce lo manejará)
        performSearch(searchQuery, activeFilter);
    }
  }, [activeFilter]); // Dependencia del filtro activo


  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModal(!isSortModalVisible);
  const toggleCategoryModal = () => setCategoryModalVisible(!isCategoryModalVisible);

  const hookfilter = async (filterurl: string, query: string) => {
    try {
      await searchByFilter(filterurl, query, setRecipes);
    } catch (error) {
      console.error('Error al aplicar filtro:', error);
      setIsErrorSearchModalVisible(true); // Mostrar modal de error
      fetchRecipes(setRecipes); // Cargar todas las recetas en caso de error
    }
  };

  const filterRecepies = async (option: string) => {
  setActiveFilter(option as any);
  toggleFilterModal();
  setSearchQuery(''); // Limpia el query general al cambiar de filtro
  setAliasQuery(''); // Limpia el alias al cambiar de filtro

  if (option === 'Nombre') {
    // La búsqueda de nombre se maneja con el debounce
    if (searchQuery.trim() !== '') {
        performSearch(searchQuery, 'Nombre');
    } else {
        fetchRecipes(setRecipes);
    }
  } else if (option === 'Categoría') {
    toggleCategoryModal();
  } else if (option === 'Ingredientes') {
    // No dispares la búsqueda aquí, deja que el debounce la maneje
  } else if (option === 'Sin el ingrediente') {
    // No dispares la búsqueda aquí
  } else if (option === 'Usuario') { // ✅ Nuevo caso para 'Usuario'
    // La búsqueda se disparará cuando el usuario ingrese texto
  } else {
    console.error('Filtro desconocido:', option);
    setIsErrorSearchModalVisible(true);
    fetchRecipes(setRecipes);
  }
};


  const handleCategorySelection = (categoryName: string) => {
    setSearchQuery(categoryName); // El query se convierte en el nombre de la categoría
    hookfilter('categoria', categoryName); // Ejecuta la búsqueda por categoría
    toggleCategoryModal(); // Cierra el modal de categorías
    // El activeFilter ya debería ser 'Categoría' desde filterRecepies
  };

  const closeModalSuccess = () => {
    setIsErrorSearchModalVisible(false);
  };

  const handleDoneSearch = () => {
    setSearchQuery(''); // Limpia la barra de búsqueda
    setActiveFilter('Nombre'); // Restablece el filtro a 'Nombre'
    setOrder(undefined); // Limpia el orden
    fetchRecipes(setRecipes); // Carga todas las recetas
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current); // Limpia cualquier debounce pendiente
    }
  }

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe?id=${recipeId}`);
  };

  const sortRecipes = (option: string) => {
    let sortedRecipes = [...recipes];
    switch (option) {
      case 'De A a Z':
        sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'De Z a A':
        sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Novedad':
        sortedRecipes.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case 'Usuario':
        // if (searchQuery.trim() !== '') {
        //   sortedRecipes = sortedRecipes.filter((r) =>
        //     r.chef.toLowerCase().includes(searchQuery.toLowerCase())
        //   );
        // }
        sortedRecipes.sort((a, b) => (a.chef || '').localeCompare(b.chef || ''));
        break;
      default:
        break;
    }
    setRecipes(sortedRecipes);
  };


  if (!fontsLoaded) {
    return <View><Text>Cargando fuentes...</Text></View>;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom:80 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.containerHome,
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
                onChangeText={handleSearchInputChange}
                onSubmitEditing={() => performSearch(searchQuery, activeFilter)}
                onBlur={() => performSearch(searchQuery, activeFilter)}
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
            options={['Nombre', 'Ingredientes', 'Categoría', 'Sin el ingrediente', 'Usuario']}
            onClose={toggleFilterModal}
            highlightedOption={activeFilter} // Usa el nuevo estado para resaltar
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
            message="Error en la búsqueda o filtro. Por favor, intenta de nuevo." // Mensaje más genérico
            onConfirm={closeModalSuccess}
            confirmText="Aceptar"
            showCancelButton={false}
          />
        </ScrollView>
      </View>

      <View >
        <BottomNavigation />
      </View>
    </>
  );
};

export default SearchScreen;