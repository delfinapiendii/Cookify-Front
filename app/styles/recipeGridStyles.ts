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
    height: 157,
    width: 160,

    alignContent: 'center', // <-- Esto se puede quitar, no tiene efecto aquí
    borderRadius: 10,
    borderTopRightRadius: 10,
  },
  recipeGridInfo: {
    padding: 10,
    paddingTop: 8,
  },
  recipeGridTitle: {
    fontSize: 14,
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
  
  emptyGridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyGridText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyMessege: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  createRecipeButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF9A16',
    borderStyle: 'dashed',
    backgroundColor: '#FFF',
    width: cardWidth * 1.5,
    height: cardWidth * 1.2,
  },
  createRecipeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9A16',
    textAlign: 'center',
  },
  editButton: { // Nuevo estilo para el botón de editar dentro de la tarjeta
    position: 'absolute',
    top: 5,    
    right: 20,  
    backgroundColor: '#fff',
    borderRadius: 15, // Más pequeño para que quepa bien en la tarjeta
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Asegura que esté por encima de la imagen y el título
  },
});

export default styles;