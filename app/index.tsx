import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { Stack, useRouter } from "expo-router";
import styles from './styles/Styles'; // Importa los estilos
import defaultRecipes from '../assets/data/recepieData.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecipes } from '../hooks/hooks';
import { ImageBackground } from 'react-native';




export default function Index() {
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  const { recipes: fetchedRecipes, fetchRecipes } = useRecipes();

  useEffect(() => {
    const initialize = async () => {
      await AsyncStorage.clear();
      const loadRecipes = async () => {
        await fetchRecipes(); // 🔥 LLAMÁ al fetch
      };
      loadRecipes();
    };
    initialize();
  }, []);

  useEffect(() => {
    setRecipes(fetchedRecipes);
  }, [fetchedRecipes]);


  const handleStart = () => {
    router.push('/register');
  };
  const handleLogin = () => {
    router.push('/login');
  };
  const handleStartGuest = () => {
    router.push('/home');
  };
  

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container , { paddingTop: 50 }]}>
        <Image
          source={require('../assets/images/burger.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/cookifyOrange.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Buenas recetas en todo momento para todos.</Text>
        <ScrollView horizontal  showsHorizontalScrollIndicator={false} >
            {recipes.slice(0, 5).map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <ImageBackground
                  source={{ uri: recipe.imageUrl }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                >
                  <View style={styles.recipeTitleContainer}>
                    <Text style={[styles.recipeTitle, { fontFamily: 'WorkSans_400Regular', fontWeight: '700', color: '#fff',shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1 }]}>
                      {recipe.title}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
 

        <TouchableOpacity style={[styles.button]} onPress={handleStart} >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>

        <Text style={[styles.loginText]}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.loginLink} onPress={handleLogin}>
            Inicia sesión
          </Text>

          

        </Text>
        <TouchableOpacity style={[styles.buttonGuest, { marginTop:25,marginBottom:50, alignSelf: 'center', borderWidth:1, justifyContent: 'center'}]} onPress={handleStartGuest} >
            <Text style={[styles.buttonTextGuest, {textAlign:'center'}]}>iniciar como invitado</Text>
          </TouchableOpacity>
      </View>
    </>
  );
}
