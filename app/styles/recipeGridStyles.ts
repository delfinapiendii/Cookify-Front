// styles/Styles.ts (o un nuevo archivo, por ejemplo, recipeGridStyles.ts)

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardMargin = 10; // Margen entre las tarjetas
const numColumns = 2; // Número de columnas
const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns; // Calcula el ancho de cada tarjeta

const styles = StyleSheet.create({
  // ... tus estilos existentes ...

  // Estilos para RecipeGrid
  recipeGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los elementos se envuelvan a la siguiente línea
    justifyContent: 'flex-start', // Alinea las tarjetas al principio de la fila
    paddingHorizontal: cardMargin / 2, // Pequeño padding horizontal para la cuadrícula
    // Puedes ajustar el paddingBottom si hay una barra de navegación inferior
    paddingBottom: 20,
    marginTop: 10,
    paddingLeft:5,
    paddingRight:5,
  },
  recipeGridCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    
        margin: cardMargin / 2, // Aplica la mitad del margen para que el total sea `cardMargin`
    overflow: 'hidden', // Asegura que la imagen respete el borderRadius
  },
  imageContainer: {
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',     // Centra horizontalmente
    // ... dar un height fijo a este contenedor
  },
  recipeGridImage: {
    width: 160,
    alignContent: 'center', // <-- Esto se puede quitar, no tiene efecto aquí
    height: 160,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
  recipeGridInfo: {
    padding: 10,
    paddingTop: 8,
  },
  recipeGridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  recipeGridRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  recipeGridRating: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  recipeGridChef: {
    fontSize: 13,
    color: '#999',
  },
  
  // Mantén tus estilos existentes para RecipeList.tsx si aún los necesitas
  // searchResultsContainer: { ... }
  // recipeCardS: { ... }
  // recipeImageS: { ... }
  // recipeInfo: { ... }
  // recipeTitleS: { ... }
  // ratingContainer: { ... }
  // rating: { ... }
  // chef: { ... }
});

export default styles;