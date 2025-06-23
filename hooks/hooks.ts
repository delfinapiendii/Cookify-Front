import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
const url = 'https://turnitos-production.up.railway.app';

export const useCreatedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreated = async () => {
      try {
        const userId = await AsyncStorage.getItem('userid');
        if (!userId) return;

        const res = await fetch(`${url}/api/v1/recetas/usuario/${userId}`);
        const data = await res.json();

        const formatted = data.map((r: any) => ({
          id: r.id,
          title: r.titulo,
          image: r.imagenes?.[0] || '',
          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
          imagenes: r.imagenes?.[0] ?? 'https://via.placeholder.com/150?text=No+Image',

          }));

        setRecipes(formatted);
      } catch (err) {
        console.log('Error al obtener recetas creadas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreated(); // ✅ La promesa vive dentro de useEffect
  }, []);

  return { recipes, loading }; // ahora devolvemos loading también
};

let refetchSavedRecipesCallback: (() => void) | null = null;

export const setRefetchSavedRecipesCallback = (callback: () => void) => {
  refetchSavedRecipesCallback = callback;
};

export function useSavedRecipes() {
  const [recipesSaved, setRecipesSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true); // Añadir estado de carga

  const fetchRecipesSaved = async () => {
    setLoadingSaved(true); // Iniciar carga
    try {
      const userId = await AsyncStorage.getItem('userid');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        console.warn('Usuario o token no encontrados, no se pueden cargar recetas guardadas.');
        setRecipesSaved([]);
        setLoadingSaved(false);
        return;
      }

      const response = await fetch(`${url}/api/v1/favoritos/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const formatted = data.map((r: any) => ({ // Asegúrate del tipo any para 'r' si no tienes interfaces
          id: r.id,
          title: r.titulo,
          image: r.imagenes?.[0]?.url ?? 'https://via.placeholder.com/150?text=No+Image',

          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
        }));
        setRecipesSaved(formatted);
        


      } else {
        console.error('Error al obtener recetas guardadas:', data.message || 'Error desconocido');
        setRecipesSaved([]); // Limpiar en caso de error
      }
    } catch (error) {
      console.error('Error en la petición de recetas guardadas:', error);
      setRecipesSaved([]); // Limpiar en caso de error
    } finally {
      setLoadingSaved(false); // Finalizar carga
    }
  };

  useEffect(() => {
    fetchRecipesSaved();
    // Registrar la función de recarga para que pueda ser llamada desde toggleBookmark
    setRefetchSavedRecipesCallback(fetchRecipesSaved);

    // Limpiar el callback al desmontar para evitar fugas de memoria
    return () => {
      setRefetchSavedRecipesCallback(null);
    };
  }, []);

  return { recipesSaved, loadingSaved, refetchRecipesSaved: fetchRecipesSaved };
}
export const useRegisterPhaseOne = () => {
  const [form, setForm] = useState({ username: '', name: '', email: '' });
  const [errors, setErrors] = useState({ username: '', name: '', email: '' });
  const [aliasSuggestions, setAliasSuggestions] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateAndSubmit = async (): Promise<boolean> => {
    const { username, name, email } = form;
    let valid = true;
    const newErrors = { username: '', name: '', email: '' };

    if (!username) { newErrors.username = 'Completa el campo de usuario'; valid = false; }
    if (!name) { newErrors.name = 'Completa el campo de nombre'; valid = false; }
    if (!email) { newErrors.email = 'Completa el campo de email'; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Por favor, ingresa un email válido';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return false;

    try {
      const res = await fetch(`${url}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, alias: username, name })
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.emailDuplicado) newErrors.email = 'El email ya está en uso';
        if (data.aliasDuplicado && data.sugerenciasAlias) {
          setAliasSuggestions(data.sugerenciasAlias);
        }
        setErrors(newErrors);
        return false;
      }

      setCanProceed(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  return { form, errors, aliasSuggestions, handleInputChange, validateAndSubmit, canProceed };
};
export const useRegisterPhaseTwo = (email: string) => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateAndSubmit = async (): Promise<boolean> => {
    const { password, confirmPassword } = form;
    const newErrors = { password: '', confirmPassword: '' };
    let valid = true;

    if (!password) { newErrors.password = 'Completa el campo de contraseña'; valid = false; }
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y números';
      valid = false;
    }

    if (!confirmPassword) { newErrors.confirmPassword = 'Completa la confirmación'; valid = false; }
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return false;

    try {
      const res = await fetch(`${url}/api/v1/auth/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      return res.ok;
    } catch (err) {
      return false;
    }
  };

  return { form, errors, handleChange, validateAndSubmit };
};
export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${url}/api/v1/recetas`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        const formatted = data.map((r) => ({
          id: r.id,
          title: r.titulo,
          imageUrl: r.imagenes[0],
          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
        }));
        setRecipes(formatted);
      } else {
        console.error('Error al obtener recetas:', data.message);
      }
    } catch (error) {
      console.error('Error en la petición de recetas:', error);
      alert('Error de red o servidor');
    }
  };

  return { recipes, setRecipes, fetchRecipes };
};

export const useCategoryNavigation = (setModalVisible: (visible: boolean) => void) => {
  const handleCategoryPress = async (categoryId: string) => {
    try {
      const response = await fetch(`${url}/api/v1/recetas/categoria/${categoryId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        const formatted = data.map((r) => ({
          id: r.id,
          title: r.titulo,
          imageUrl: r.imagenes?.[0] || 'https://via.placeholder.com/150/CCCCCC/000000?text=No+Image',
          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
        }));
        const recipesString = encodeURIComponent(JSON.stringify(formatted));
        router.push({
          pathname: '/viewMore',
          params: { recipes: recipesString, title: `Categoría: ${categoryId}` },
        });
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error en la petición de recetas filtradas:', error);
    }
  };

  return { handleCategoryPress };
};
export const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};
export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${url}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error en la petición de login:', error);
    return { success: false, message: 'Error de red o servidor' };
  }
};

export const modifiedRecipes = async (servings: number, recipeIdParam: string, setRecipe: Function) => {
  try {
    const response = await fetch(`${url}/api/v1/recetas/${recipeIdParam}/escalar?porciones=${servings}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error HTTP al escalar:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}. Detalle: ${errorText}`);
    }

    const data = await response.json();

    setRecipe((prevRecipe: any) => {
      if (!prevRecipe) return null;

      const composicionesAdaptadas = data.ingredientes?.map((ing: any) => ({
        cantidad: ing.cantidad,
        ingrediente: ing.nombre,
      }));

      return {
        ...prevRecipe,
        composiciones: composicionesAdaptadas || prevRecipe.composiciones,
        valoracionPromedio:
          data.valoracionPromedio !== undefined
            ? data.valoracionPromedio
            : prevRecipe.valoracionPromedio,
      };
    });
  } catch (err: any) {
    console.error('Error en modifiedRecipes:', err);
  } finally {
  }
};

export const toggleBookmark = async (recipeIdParam: string, isBookmarked: boolean, setIsBookmarked: Function) => {
  const token = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('userid');

  if (!token || !userId) {
    Alert.alert("Error", "No estás autenticado.");
    return;
  }

  const parsedRecipeId = parseInt(recipeIdParam);
  if (isNaN(parsedRecipeId)) {
    Alert.alert("Error", "ID de receta inválido.");
    return;
  }

  // Optimistic UI update: cambia el estado inmediatamente
  const previousBookmarkedState = isBookmarked; // Guardar estado previo
  setIsBookmarked(!isBookmarked);

  try {
    if (!previousBookmarkedState) { // Si antes no estaba marcado, ahora lo agregamos
      const response = await fetch(`${url}/api/v1/favoritos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recetaId: parsedRecipeId,
          usuarioId: userId,
        }),
      });

      if (!response.ok) {
        // Revertir el estado si la operación falla
        setIsBookmarked(previousBookmarkedState);
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo agregar a favoritos.');
        console.error('Error adding favorite:', response.status, errorData);
      }
    } else { // Si antes estaba marcado, ahora lo eliminamos
      const response = await fetch(`${url}/api/v1/favoritos/${userId}/${parsedRecipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Revertir el estado si la operación falla
        setIsBookmarked(previousBookmarkedState);
        const errorText = await response.text();
        Alert.alert('Error', 'No se pudo eliminar de favoritos.');
        console.error('Error removing favorite:', response.status, errorText);
      }
    }

    // Si la operación fue exitosa, llamar al callback para recargar los favoritos
    if (refetchSavedRecipesCallback) {
      refetchSavedRecipesCallback();
    }
  } catch (err) {
    console.error('Error en toggleBookmark:', err);
    Alert.alert('Error', 'No se pudo modificar el favorito debido a un error de red.');
    // Revertir el estado si la operación falla por error de red
    setIsBookmarked(previousBookmarkedState);
  }
};

export const confirmRating = async (
  tempRating: number,
  recipeIdParam: string,
  setUserRating: Function,
  closeRatingModal: Function
) => {
  setUserRating(tempRating);

  const token = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('userid');

  try {
    const parsedRecipeId = parseInt(recipeIdParam);
    if (isNaN(parsedRecipeId)) {
      Alert.alert("Error", "ID de receta inválido.");
      return;
    }

    const response = await fetch(`${url}/api/v1/valoraciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recetaId: parsedRecipeId,
        usuarioId: userId,
        puntaje: tempRating,
      }),
    });

    const data = await response.json();
  } catch (err) {
    console.error('Error en valoracion:', err);
    Alert.alert('Error', 'No se pudo valorar la receta.');
  }

  closeRatingModal();
};

export const postComment = async (comment: string, recipeIdParam: string) => {
  const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userid');

    try {
      const parsedRecipeId = parseInt(recipeIdParam);
      await fetch(`${url}/api/v1/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recetaId: parsedRecipeId,
          usuarioId: userId,
          contenido: comment,
        }),
      });

    } catch {
      Alert.alert('Error', 'No se pudo enviar el comentario.');
    }

};

export const fetchRecipeDetails = async (recipeIdParam: string, setRecipe: Function, setServings: Function, setUserRating: Function, setLoading: Function, setError: Function, setIsBookmarked: Function) => {
  if (!recipeIdParam) {
    setError('No se proporcionó un ID de receta.');
    setLoading(false);
    return;
  }

  try {
    // 1. Obtener los detalles de la receta
    const response = await fetch(`${url}/api/v1/recetas/${recipeIdParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setRecipe(data);
    setServings(data.porciones || 1);
    setUserRating(data.valoracionPromedio || 0);

    // 2. Obtener el ID del usuario y el token
    const userId = await AsyncStorage.getItem('userid');
    const token = await AsyncStorage.getItem('token');

    if (userId && token) {
      // 3. Hacer fetch a la API de recetas guardadas del usuario
      const savedRecipesResponse = await fetch(`${url}/api/v1/favoritos/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (savedRecipesResponse.ok) {
        const savedRecipesData = await savedRecipesResponse.json();
        // 4. Verificar si la receta actual está en las favoritas
        const isCurrentlyBookmarked = savedRecipesData.some(
          (favRecipe: any) => String(favRecipe.id) === recipeIdParam // Asegurarse de que los IDs sean del mismo tipo para la comparación
        );
        setIsBookmarked(isCurrentlyBookmarked);
      } else {
        console.warn('No se pudieron cargar los favoritos del usuario:', savedRecipesResponse.status);
        setIsBookmarked(false); // Por defecto, no marcado si hay error al cargar favoritos
      }
    } else {
      setIsBookmarked(false); // No está logueado, no puede tener favoritos
    }
  } catch (err: any) {
    console.error('Error fetching recipe details or user favorites:', err);
    setError('No se pudo cargar la receta o verificar favoritos. Por favor, inténtalo de nuevo más tarde.');
    Alert.alert('Error', 'No se pudo cargar la receta. ' + err.message);
  } finally {
    setLoading(false);
  }
};

export const searchRecipesByTitle = async (text: string, setRecipes: Function) => {
  try {
    const response = await fetch(`${url}/api/v1/recetas/search?titulo=${text}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      const formatted = data.map((r: any) => ({
        id: r.id,
        title: r.titulo,
        image: r.imagenes?.[0],
        rating: r.valoracionPromedio || 0,
        chef: r.usuario?.alias || 'Desconocido',
      }));
      setRecipes(formatted);
    } else {
    }
  } catch (error) {
    console.error('Error en búsqueda por título:', error);
  }
};

export const searchByFilter = async (filterurl: string, searchQuery: string, setRecipes: Function) => {

  try {
    const response = await fetch(`${url}/api/v1/recetas/${filterurl}/${searchQuery}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      const formatted = data.map((r: any) => ({
        id: r.id,
        title: r.titulo,
        image: r.imagenes?.[0],
        rating: r.valoracionPromedio || 0,
        chef: r.usuario?.alias || 'Desconocido',
      }));
      setRecipes(formatted);
    } else {
      setRecipes([]);
    }
  } catch (error) {
    console.error('Error en búsqueda con filtro:', error);
  }
};

export const fetchRecipes = async (setRecipes: Function) => {
  try {
    const response = await fetch(`${url}/api/v1/recetas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        
      },
    });

    const data = await response.json();

    if (response.ok) {
      const formatted = data.map((r: any) => ({
        id: r.id,
        title: r.titulo,
        image: r.imagenes[0],
        rating: r.valoracionPromedio || 0,
        chef: r.usuario?.alias || 'Desconocido',
      }));
      setRecipes(formatted);
    } else {
      console.error('Error al obtener recetas:', data.message);
      setRecipes([]);
    }
  } catch (error) {
    console.error('Error en la petición de recetas:', error);
    alert('Error de red o servidor');
  }
};

export const loadPendingRecipes = async (setRecipes: Function) => {
  const userId = await AsyncStorage.getItem('userid');
  const token = await AsyncStorage.getItem('token');

  try {
    const response = await fetch(`${url}/api/v1/recetas/pendientes/usuario/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      const formatted = data.map((r: any) => ({
        id: r.id,
        title: r.titulo,
        image: r.imagenes[0],
        rating: r.valoracionPromedio || 0,
        chef: r.usuario?.alias || 'Desconocido',
      }));
      setRecipes(formatted);
    } else {
      console.error('Error al obtener recetas:', data.message);
      setRecipes([]);
    }
  } catch (error) {
    console.error('Error en la petición de recetas:', error);
    alert('Error de red o servidor');
  }
};

export const publishRecipe = async (
  recipeName: string,
  description: string,
  recipeType: string,
  servings: string,
  ingredients: { name: string; quantity: string }[],
  steps: { description: string; imageUrl: string | null }[],
  image: any,
  imageUrl: string | null,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  try {
    const userId = await AsyncStorage.getItem('userid');
    if (!userId) {
      onError('No se encontró el ID del usuario');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${url}/api/v1/recetas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: recipeName,
        descripcion: description,
        categoria: recipeType,
        porciones: Number(servings),
        usuarioId: userId,
        ingredientes: ingredients.map((i) => ({
          nombre: i.name,
          cantidad: Number(i.quantity),
        })),
        pasos: steps.map((step, index) => ({
          orden: index + 1,
          descripcion: step.description,
          ...(step.imageUrl ? { imagenUrl: step.imageUrl } : {}),
        })),
        imagenes: [imageUrl || (image ? image.uri : '')],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const json = JSON.parse(errorText);
        onError(json.message || 'Error al publicar la receta');
      } catch {
        onError(errorText);
      }
    } else {
      onSuccess();
    }
  } catch (err: any) {
    onError(err.message || 'Error de red');
  }
};
export const uploadImage = async (imageUri) => {
  const formData = new FormData();
  const file = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  };

  formData.append('file', file as any);

  try {
    const response = await fetch(`${url}/api/v1/upload/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return null;
  };



};
