import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
const uploadImage = async (localUri: string): Promise<string | null> => {
  console.log('📤 Intentando subir imagen desde:', localUri);
  const formData = new FormData();

  formData.append('file', {
    uri: localUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  } as any);

  try {
    const response = await fetch('http://10.0.2.2:3000/api/v1/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('✅ Imagen subida con URL:', data.url);
    return data.url;
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    return null;
  }
};

export const loadDefaultRecipes = async () => {

  const alreadyLoaded = await AsyncStorage.getItem('defaultRecipesLoaded');
  if (alreadyLoaded) {
    return;
  }
  
  const userId = await AsyncStorage.getItem('userid');
  const token = await AsyncStorage.getItem('token');
  
  console.log('🧩 userId:', userId);
  console.log('🧩 token:', token);
  
  if (!userId || !token) {
    console.warn('⚠️ userId o token no están disponibles, abortando carga de recetas.');
    return;
  }
  

  // 📸 Lista de imágenes locales
  const imageFiles = [
    require('../assets/images/tarta.png'),
    require('../assets/images/pasta.jpg'),
    require('../assets/images/pan.avif'),
  ];

  // 📦 Datos básicos de las recetas
  const defaultRecipes = [
    {
      titulo: 'Tarta de Espinaca',
      descripcion: 'Tarta saludable con espinaca y queso.',
      categoria: 'vegetariana',
      porciones: 4,
      ingredientes: [
        { nombre: 'Espinaca', cantidad: 200 },
        { nombre: 'Queso ricotta', cantidad: 150 },
        { nombre: 'Huevos', cantidad: 2 }
      ],
      pasos: [
        { orden: 1, descripcion: 'Lavar bien la espinaca.' },
        { orden: 2, descripcion: 'Mezclar con ricotta y huevos.' },
        { orden: 3, descripcion: 'Hornear 30 minutos a 180°C.' }
      ]
    },
    {
      titulo: 'Pasta con salsa Alfredo',
      descripcion: 'Pasta cremosa con queso y crema.',
      categoria: 'salado',
      porciones: 2,
      ingredientes: [
        { nombre: 'Fideos', cantidad: 250 },
        { nombre: 'Crema de leche', cantidad: 200 },
        { nombre: 'Queso parmesano', cantidad: 50 }
      ],
      pasos: [
        { orden: 1, descripcion: 'Hervir los fideos.' },
        { orden: 2, descripcion: 'Preparar la salsa con crema y queso.' },
        { orden: 3, descripcion: 'Mezclar todo y servir caliente.' }
      ]
    },
    {
      titulo: 'Pan casero',
      descripcion: 'Pan fácil con pocos ingredientes.',
      categoria: 'artesanal',
      porciones: 6,
      ingredientes: [
        { nombre: 'Harina', cantidad: 500 },
        { nombre: 'Agua', cantidad: 300 },
        { nombre: 'Levadura', cantidad: 10 }
      ],
      pasos: [
        { orden: 1, descripcion: 'Mezclar los ingredientes secos.' },
        { orden: 2, descripcion: 'Agregar agua y amasar.' },
        { orden: 3, descripcion: 'Dejar levar y hornear.' }
      ]
    }
  ];
  console.log('', defaultRecipes); // 👈 Asegura que se llama


  try {
    for (let i = 0; i < defaultRecipes.length; i++) {
      const asset = Asset.fromModule(imageFiles[i]);
      await asset.downloadAsync();
      const localUri = asset.localUri || asset.uri;

      const uploadedUrl = await uploadImage(localUri);

      if (!uploadedUrl) {
        console.warn(`No se pudo subir la imagen para la receta: ${defaultRecipes[i].titulo}`);
        continue;
      }

      const recetaConImagen = {
        ...defaultRecipes[i],
        imagenes: [uploadedUrl],
        usuarioId: userId,
      };
      console.log(token)
      console.log('📦 Enviando receta al backend:', JSON.stringify(recetaConImagen, null, 2));


      const response = await fetch('http://10.0.2.2:3000/api/v1/recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recetaConImagen),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ Error publicando receta ${recetaConImagen.titulo}:`, errText);
      } else {
        console.log(`✅ Receta "${recetaConImagen.titulo}" publicada`);
      }
      
    }
    

    await AsyncStorage.setItem('defaultRecipesLoaded', 'true');
    console.log('✅ Recetas por defecto cargadas correctamente');

  } catch (error) {
    console.error('Error general al cargar recetas por defecto:', error);
  }
};
