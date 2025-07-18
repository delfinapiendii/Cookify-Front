import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileRecipesStyles = StyleSheet.create({
  recipeImage: {
    width: 140,
    height: 140,
  },
  recipeCard: {
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  featuredRecipesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recipeTitleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  recipeTitle: {
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollViewContent: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 90,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  infoBox: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '48%',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'WorkSans_400Bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
    color: '#333',
    marginRight: 5,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createdRecipesBox: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  createdRecipesCount: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },
  section: {
    width: '100%',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    marginLeft: 20,
    marginTop: 5,

    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
    color: '#333',
  },
  viewMoreText: {
    fontSize: 16,
    marginRight: 20,
    fontFamily: 'WorkSans_400Regular',
    color: '#FF9A16',
  },
  noRecipesText1: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: '#FF9A16',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonErrorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%',
    marginVertical: 15,
  },
  
  
  editButton: {
    position: 'absolute',
    top: 10, // Ajusta la posición superior según la imagen de referencia
    right: 10, // Ajusta la posición derecha según la imagen de referencia
    backgroundColor: 'rgba(255,154,22,0.8)', // Un color que resalte, similar al de la imagen
    borderRadius: 20, // Para hacerlo circular o con bordes redondeados
    padding: 5, // Espacio interno
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  noRecipesText: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default profileRecipesStyles;
