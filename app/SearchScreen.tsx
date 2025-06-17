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
    setSearchQuery(text); // Actualiza el estado
    if (filter === undefined) {
      try {
        const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/search?titulo=${text}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        if (response.ok) {
          const formatted = data.map((r) => ({
            id: r.id,
            title: r.titulo,
            image: r.imagenes[0],
            rating: r.valoracionPromedio || 0,
            chef: r.usuario?.alias || 'Desconocido',
          }));
          setRecipes(formatted); // Asignar las recetas obtenidas al estado
        } else {
          //setIsErrorSearchModalVisible(true); 
        }
      } catch (error) {
        console.error('Error en la petición de recetas filtradas:', error);
        fetchRecipes(); // Si no hay filtro, cargar todas las recetas
      }
    }
    else{
      filterRecepies(filter);

    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModalVisible(!isSortModalVisible);

  useEffect(() => {
    fetchRecipes();
  }, []); // Arreglo de dependencias vacío para que se ejecute solo una vez
  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/v1/recetas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const formatted = data.map((r) => ({
          id: r.id,
          title: r.titulo,
          //description: r.descripcion,
          image: r.imagenes[0],
          rating: r.valoracionPromedio || 0,
          //category: r.categoria,
          chef: r.usuario?.alias || 'Desconocido',
        }));
        setRecipes(formatted); // Asignar las recetas obtenidas al estado
      } else {
        console.error('Error al obtener recetas:', data.message);
      }
    } catch (error) {
      console.error('Error en la petición de recetas:', error);
      alert('Error de red o servidor');
    }
  };
  const hookfilter = async (filterurl:String) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/${filterurl}/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        const formatted = data.map((r) => ({
          id: r.id,
          title: r.titulo,
          image: r.imagenes[0],
          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
        }));
        setRecipes(formatted); // Asignar las recetas obtenidas al estado
      } else {
        //setIsErrorSearchModalVisible(true); 
      }
    } catch (error) {
      console.error('Error en la petición de recetas filtradas:', error);
      fetchRecipes(); // Si no hay filtro, cargar todas las recetas
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
      fetchRecipes(); // Si no hay filtro, cargar todas las recetas
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
          // Aquí iría la lógica para navegar a la pantalla de detalle de la receta
          console.log(`Receta tocada con ID: ${recipeId}`);
          router.push(`/recipe?id=${recipeId}`);        // Ejemplo de navegación usando expo-router:
          // navigation.navigate('RecipeDetail', { id: recipeId });
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
           isVisible={isErrorSearchModalVisible} // Estado para controlar la visibilidad del modal
           message="Error en la elección de filtro"
           onConfirm={closeModalSuccess} // Ahora solo cierra este modal, sin navegación
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
