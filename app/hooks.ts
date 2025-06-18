import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCreatedRecipes() {
  const [recipesCreated, setRecipesCreated] = useState([]);

  useEffect(() => {
    const fetchRecipesCreated = async () => {
      try {
        const userId = await AsyncStorage.getItem('userid');
        const response = await fetch(`http://10.0.2.2:3000/api/v1/recetas/usuario/${userId}`, {
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
          setRecipesCreated(formatted);
        } else {
          console.error('Error al obtener recetas creadas:', data.message);
        }
      } catch (error) {
        console.error('Error en la petición de recetas creadas:', error);
      }
    };

    fetchRecipesCreated();
  }, []);

  return recipesCreated;
}

export function useSavedRecipes() {
  const [recipesSaved, setRecipesSaved] = useState([]);

  useEffect(() => {
    const fetchRecipesSaved = async () => {
      try {
        const userId = await AsyncStorage.getItem('userid');
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`http://10.0.2.2:3000/api/v1/favoritos/usuario/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const formatted = data.map((r) => ({
            id: r.id,
            title: r.titulo,
            image: r.imagenes?.[0] ?? 'https://via.placeholder.com/150?text=No+Image',
            rating: r.valoracionPromedio || 0,
            chef: r.usuario?.alias || 'Desconocido',
          }));
          setRecipesSaved(formatted);
        } else {
          console.error('Error al obtener recetas guardadas:', data.message);
        }
      } catch (error) {
        console.error('Error en la petición de recetas guardadas:', error);
      }
    };

    fetchRecipesSaved();
  }, []);

  return recipesSaved;
}
