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
import recipesData from '../assets/data/recepie.json';
import ModalSelector from './components/modalSelector';
import RecipeGrid from './components/recipeGrid';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  if (!fontsLoaded) return null;

  const updateSearch = (text: string) => {
    setSearchQuery(text);
    console.log('Buscando:', text);
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleSortModal = () => setSortModalVisible(!isSortModalVisible);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff'}}>
    
      <ScrollView style={[styles.containerHome, { paddingTop: 80, marginBottom: 80, bottom: 40 }]}>
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
              onPress={() => updateSearch('')}
            />
          }
        />

        {/* Filtros y Ordenar por */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
            <Ionicons name="filter-outline" size={20} color="#FF9A16" style={{ marginRight: 5 }} />
            <Text style={[styles.filterButtonText, { fontFamily: 'WorkSans_400Regular' }]}>
              Filtros (2)
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
        <Text style={styles.resultsCount}>700 Recetas Encontradas</Text>
        <RecipeGrid
          recipes={recipesData.map((r) => ({ ...r, rating: Number(r.rating) }))}
          onRecipePress={(id) => {
            console.log('Receta tocada:', id);
          }}
        />
        {/* 
        <RecipeList
          recipes={recipesData.map((r) => ({ ...r, rating: Number(r.rating) }))}
          onRecipePress={(id) => {
            console.log('Receta tocada:', id);
          }}
        />
        */}

      </ScrollView>

      {/* Modal Filtros */}
      <ModalSelector
        visible={isFilterModalVisible}
        title="Filtrar"
        options={['Nombre', 'Ingredientes', 'Categoría', 'Sin el ingrediente']}
        onClose={toggleFilterModal}
        onSelectOption={(option) => {
          console.log('Filtro seleccionado:', option);
          toggleFilterModal();
        }}
      />

      {/* Modal Ordenar por */}
      <ModalSelector
        visible={isSortModalVisible}
        title="Ordenar por"
        options={['De A a Z', 'De Z a A', 'Novedad', 'Usuario']}
        highlightedOption="De A a Z"
        onClose={toggleSortModal}
        onSelectOption={(option) => {
          console.log('Orden seleccionado:', option);
          toggleSortModal();
        }}
      />

      <BottomNavigation />
    </View>
    </>
  );
};

export default SearchScreen;
