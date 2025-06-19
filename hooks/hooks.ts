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

        const res = await fetch(`http://10.0.2.2:3000/api/v1/recetas/usuario/${userId}`);
        const data = await res.json();

        const formatted = data.map((r: any) => ({
          id: r.id,
          title: r.titulo,
          image: r.imagenes?.[0] || '',
          rating: r.valoracionPromedio || 0,
          chef: r.usuario?.alias || 'Desconocido',
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
};
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

  const nuevaAccion = !isBookmarked;
  setIsBookmarked(nuevaAccion);

  try {
    if (nuevaAccion) {
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

      const data = await response.json();
    } else {
      const response = await fetch(`${url}/api/v1/favoritos/${userId}/${parsedRecipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200 ) {
        const data = await response.text();
        console.error('Error desfaveando:', response.status, data);
      }
    }
  } catch (err) {
    console.error('Error en toggleBookmark:', err);
    Alert.alert('Error', 'No se pudo modificar el favorito.');
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

export const fetchRecipeDetails = async (recipeIdParam: string, setRecipe: Function, setServings: Function, setUserRating: Function, setLoading: Function, setError: Function) => {
  if (!recipeIdParam) {
    setError('No se proporcionó un ID de receta.');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${url}/api/v1/recetas/${recipeIdParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setRecipe(data);
    setServings(data.porciones || 1);
    setUserRating(data.valoracionPromedio || 0);
  } catch (err: any) {
    console.error('Error fetching recipe details:', err);
    setError('No se pudo cargar la receta. Por favor, inténtalo de nuevo más tarde.');
    Alert.alert('Error', 'No se pudo cargar la receta. ' + err.message);
  } finally {
    setLoading(false);
  }
};

