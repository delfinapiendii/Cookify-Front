import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 40; // Por ejemplo, 20 de padding a cada lado
const BUTTON_WIDTH = 100; // Ancho del botón de añadir
const ITEM_MARGIN_HORIZONTAL = 10;
const TOTAL_MARGIN = ITEM_MARGIN_HORIZONTAL * 2;
const IMAGE_VIEW_WIDTH = width - TOTAL_MARGIN; // Ancho para las imágenes mostradas

const ADD_BUTTON_PREVIEW_WIDTH = 120; // Ancho que quieres que tenga el botón de añadir.

// El ancho real que el FlatList debe considerar para cada elemento para que 'pagingEnabled' funcione bien
// es la suma del ancho del item más sus márgenes horizontales.
const SNAP_TO_INTERVAL_WIDTH = IMAGE_VIEW_WIDTH + TOTAL_MARGIN; // Para que el paging se ajuste a una imagen completa

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
    paddingBottom: 60,
    paddingHorizontal: 20,
    marginBottom: 50,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },

  imagePicker: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'WorkSans_400Regular',
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  picker: {
    height: 50,
    fontFamily: 'WorkSans_400Regular',
  },

  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  servingsIcon: {
    marginRight: 10,
  },

  servingsInput: {
    flex: 1,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'WorkSans_700Bold',
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  ingredientInput: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  quantityInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  addIngredientButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },

 
  stepInput: {
    flex: 1, // Hace que el input ocupe el espacio restante
    minHeight: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },

  
  addStepButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  removeRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },

  trashIcon: {
    marginRight: 10,
  },

  removeRecipeText: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },

  publishButton: {
    backgroundColor: '#FF9A16',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 130,
  },

  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },

  pickerWrapperTipo: {
    marginBottom: 15,

  },

  label: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    fontFamily: 'WorkSans_400Regular',
    marginBottom: 6,
  },

  pickerContainerTipo: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },

  pickerTipo: {
    height: 48,
    width: '100%',
    backgroundColor: '#fff',
  },

  pickerButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  pickerButtonText: {
    color: '#ddd',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },

  closePickerButton: {
    alignItems: 'center',
    marginTop: 10,
  },

  closePickerText: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchModal: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  optionButton: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 16,
    color: '#FF4D4D',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  stepImagePicker: {
    width: 60, // Ancho fijo para el botón de la cámara
    height: 60, // Alto fijo
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden', // Para que la imagen se recorte si es más grande
  },
  stepCameraIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  stepAddIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  stepSelectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Asegura que la imagen cubra el área
    borderRadius: 8,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  

  cameraIconContainerCarrousel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconCarrousel: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  inputErrorCarrousel: {
    borderColor: 'red',
    borderWidth: 1,
  },
  carouselContainer: {
    height: 200, // Altura fija para el carrusel
    width: '100%', // Ancho completo del contenedor
    marginVertical: 15,
    overflow: 'hidden',
    position: 'relative', // Necesario para posicionar la flecha de forma absoluta
  },

  selectedImageCarrusel: {
    width: width-80, // La imagen ocupa este ancho
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
    marginHorizontal: ITEM_MARGIN_HORIZONTAL, // Margen a los lados de cada imagen
  },

  imagePickerCarrousel: {
    width: width - 80, 
    height: '100%',
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ITEM_MARGIN_HORIZONTAL, // Margen a los lados del botón
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },

  // Nuevo estilo para la flecha de navegación
  carouselArrowContainer: {
    position: 'absolute',
    right: 0, // Pegado al borde derecho del carouselContainer
    top: '50%', // Centrado verticalmente
    transform: [{ translateY: -15 }], // Ajuste para centrar el icono (mitad de su tamaño)
    backgroundColor: 'rgba(255,255,255,0.7)', // Fondo semi-transparente para la flecha
    borderRadius: 15,
    padding: 2,
  },
  
});

export default  styles;

