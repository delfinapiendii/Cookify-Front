import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ImageBackground } from 'react-native';
import styles from './styles/Styles';
import { router, useNavigation } from 'expo-router'; // useNavigation no se está usando aquí, pero lo mantengo si lo necesitas
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from './components/navBar';
import LogoHeader from './components/logoHeader'; 
import categoriesData from '../assets/data/categories.json';
import CustomAlertModal from './components/alert'; 
import { loadDefaultRecipes } from './loadDefaultRecipes'; 



// import { NavigationContainer } from '@react-navigation/native'; // No necesario si usas Expo Router directamente

   
const Home = () => {
    // Mueve la declaración de 'recipes' al nivel del componente Home
    const [recipes, setRecipes] = useState([]); // Estado para recetas, ahora es parte del componente Home
    const [isCategoryNonExistVisible,setisCategoryNonExistVisible] = useState(false);

    // Si estás usando fuentes personalizadas
    // const [fontsLoaded] = useFonts({ ... });
    // if (!fontsLoaded) {
    //   return <AppLoading />;
    // }

    const handleRecipePress = (recipeId: string) => {
        // Aquí iría la lógica para navegar a la pantalla de detalle de la receta
        console.log(`Receta tocada con ID: ${recipeId}`);
        router.push(`/recipe?id=${recipeId}`);        // Ejemplo de navegación usando expo-router:
        // navigation.navigate('RecipeDetail', { id: recipeId });
    };

    const handleVerMas = () => {
        // Serializa la lista de recetas destacadas
        fetchRecipes();
        const recipesString = encodeURIComponent(JSON.stringify(recipes)); 
      
        router.push({
          pathname: '/viewMore', 
          params: { 
            recipes: recipesString, 
            title: '¡Recetas que pueden gustarte!' 
          },
        });

    };

    const handleCategoryPress = async (categoryId: string) => {
        console.log(`Categoría tocada con ID: ${categoryId}`);
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/categoria/${categoryId}`, {
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
                imageUrl: r.imagenes && r.imagenes.length > 0 ? r.imagenes[0] : 'https://via.placeholder.com/150/CCCCCC/000000?text=No+Image', // CAMBIO CLAVE AQUÍ: usar imageUrl y un fallback
                rating: r.valoracionPromedio || 0,
                chef: r.usuario?.alias || 'Desconocido',
              }));
              
              // setRecipes(formatted); // No es estrictamente necesario asignar al estado local si solo vas a pasar a la siguiente página

              // Serializa las recetas a un string JSON antes de pasarlas
              const recipesString = encodeURIComponent(JSON.stringify(formatted));

              router.push({
                pathname: '/viewMore', // Asegúrate de que esta ruta sea correcta para tu estructura de archivos (ej. app/filteredRecipesScreen.tsx)
                params: {
                  recipes: recipesString, // Pasa el string JSON codificado
                  title: `Categoría: ${categoryId}` // O cualquier otro título que quieras mostrar
                },
              });
            } else {
                console.log('Falló la carga de categoría:', categoryId);
                setisCategoryNonExistVisible(true);
              //setIsErrorSearchModalVisible(true); 
            }
          } catch (error) {
            console.error('Error en la petición de recetas filtradas:', error);
          }
    }; // Cierre de handleCategoryPress

    const closeModalSuccess = () => {
        setisCategoryNonExistVisible(false);
    };

    useEffect(() => {
        loadDefaultRecipes();
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
            imageUrl: r.imagenes[0],
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



    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <ScrollView style={styles.containerHome} contentContainerStyle={{ paddingBottom: 80 }}>
                    <LogoHeader />

                    <Image
                        source={require('../assets/images/homeBanner.jpg')}
                        style={styles.homeBanner}
                        resizeMode="cover" />

                    <View style={styles.newSection}>
                        <Text style={styles.sectionTitle}>¡Recetas que pueden gustarte!</Text>

                        <TouchableOpacity style={styles.verMasButton} onPress={handleVerMas}>
                            <Text style={styles.verMasText}>Ver más</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredRecipesContainer}>
                        {recipes.slice(0, 5).map((recipe) => ( // <--- ¡AQUÍ ESTÁ EL CAMBIO!
                            <TouchableOpacity key={recipe.id} style={[styles.recipeCard ]} onPress={() => handleRecipePress(recipe.id)}>
                                <ImageBackground source={{ uri: recipe.imageUrl }} style={styles.recipeImage} imageStyle={{ opacity: 0.6 }}  resizeMode="cover">
                                    <View style={styles.recipeTitleContainer}>
                                        <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight:'500' }]}>{recipe.title}</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Sección "Categorías" */}
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                        {categoriesData.map((category) => (
                            <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => handleCategoryPress(category.id)}>
                                
                                <ImageBackground source={{ uri: category.imageUrl }} style={styles.categoryImage} imageStyle={{ opacity: 0.6 }}  resizeMode="cover">
                                    <View style={styles.recipeTitleContainer}>
                                        <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight:'500' }]}>{category.title}</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </ScrollView>
                <BottomNavigation />
            </View>
            <CustomAlertModal
                isVisible={isCategoryNonExistVisible} // Estado para controlar la visibilidad del modal
                message="Todavía no existen recetas en esta categoría"
                onConfirm={closeModalSuccess} // Ahora solo cierra este modal, sin navegación
                confirmText="Aceptar"
                showCancelButton={false}
         />
        </>
    );
};


export default Home;