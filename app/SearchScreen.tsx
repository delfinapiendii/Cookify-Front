import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import styles from './styles/searchScreenStyles';
import BottomNavigation from './components/navBar';
import LogoHeader from './components/logoHeader';
import RecipeList from './components/recepieList';
import { SearchBar } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
//import recipesData from '../assets/data/recepie.json';
import ModalSelector from './components/modalSelector';
import RecipeGrid from './components/recipeGrid';
import CustomAlertModal from './components/alert'; // Tu modal reutilizable
import {
  searchByFilter,
  searchRecipesByTitle,
  useRecipes,
  fetchRecipes
} from '../hooks/hooks';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]); // Estado para recetas
  const [filter, setFilter] = useState<string | undefined>(undefined); // Estado para recetas
  const [order, setOrder] = useState<string | undefined>(undefined); // Estado para recetas
  const [isErrorSearchModalVisible, setIsErrorSearchModalVisible] = useState(false);
  




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
    if (filter === undefined) {
      searchRecipesByTitle(searchQuery,setRecipes);
    }
    else{
      filterRecepies(filter);
    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModalVisible(!isSortModalVisible);

  useEffect(() => {
    fetchRecipes(setRecipes);
  }, []); 
 
  const hookfilter = async (filterurl: string) => {
    try {
      searchByFilter(filterurl,searchQuery,setRecipes);
      if (recipes.length === 0){
      }
    } 
    catch (error) {
      fetchRecipes(setRecipes); 
    }
  };
  const filterRecepies = async (option:String) => {
  
    if (option) {
      setFilter(String(option));
      if (option === 'Nombre') {
        setFilter(undefined); 
        updateSearch(searchQuery); 
      } else if (option === 'Categoría') {
        hookfilter('categoria');
      } else if (option === 'Ingredientes') {
        hookfilter('ingrediente');
      } else if (option === 'Sin el ingrediente') {
        hookfilter('sin-ingrediente');
      } else {
        console.error('Filtro desconocido:', filter);
      }
    } else {
      fetchRecipes(setRecipes);
      return setRecipes(recipes); 
    }
  };
  const closeModalSuccess = () => {
    setIsErrorSearchModalVisible(false);
    
  };
  const handleDoneSearch = () => {
    setFilter(undefined); 
    filterRecepies('Nombre');
  }

  const handleRecipePress = (recipeId: string) => {
          router.push(`/recipe?id=${recipeId}`);       
      };


  if (!fontsLoaded) {
    return <View><Text>Cargando fuentes...</Text></View>;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={[styles.containerHome]}>
          <LogoHeader />

          <SearchBar
            placeholder="Buscar Receta"
            onChangeText={updateSearch}
            value={searchQuery}
            lightTheme
            round
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            inputStyle={styles.searchBarInput}
            searchIcon={<Ionicons name="search-outline" size={24} color="#86939e" />}
            clearIcon={
              <Ionicons
                name="close-circle-outline"
                size={24}
                color="#86939e"
                onPress={handleDoneSearch}
              />
            }
          />

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
            recipes={recipes.map((r) => ({ ...r, rating: Number(r.rating) }))}
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
            setFilter(String(option));
            filterRecepies(option); 
            toggleFilterModal();
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
          }}
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
