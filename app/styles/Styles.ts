import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9a16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 100,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    color: '#000000',
    fontFamily: 'WorkSans_400Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },
  loginText: {
    marginTop: 30,
    fontSize: 20,
    color: '#000000',
    fontFamily: 'WorkSans_400Regular',
  },
  loginLink: {
    color: '#fff',
    textDecorationLine: 'underline',
  },


 // Estilos para la pantalla de registro
 containerRegister: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 20,
  paddingTop: 58,
},


backarrow: {
  alignItems: 'flex-start',
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
logoContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
centerlogo: {
  width: 220,
  height: 100,
},

  logoWhite: {
    width: 150.24,
    height: 58.55,
    marginBottom: 20,

  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: '#333',
    fontFamily: 'WorkSans_400Regular',
   paddingBottom: 20,

  },
  input: {
    height: 65,
    borderColor: '#ccc',
    borderRadius: 30,
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
        marginBottom: 15,
      fontFamily: 'WorkSans_400Regular',
    fontSize: 17,
    maxHeight: 65,
    marginLeft: 10,
    marginRight: 10,
  },
  start: {
    height: 65,
    borderRadius: 30,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
      fontFamily: 'WorkSans_400Regular',
    fontSize: 17,
    color: '#fff',
    backgroundColor: '#FF9A16',
  },

   // Estilos para la pantalla de home
   containerHome: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
    paddingBottom: 60,
    marginBottom: 90,

  },
  homeBanner: {
    width: '100%',
    height: 200,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_400Bold',
    padding: 15,
    width: '80%',
  },
  verMasButton: {
    position: 'absolute',
    right: 15,
    borderRadius: 5,
    width: '15%',
  },
  verMasText: {
    color: '#FF9A16',
    fontSize: 12,
    textAlign: 'right',
    alignContent: 'center',
    justifyContent: 'center',

    fontFamily: 'WorkSans_400Bold',

  },
  newSection: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
  },

  featuredRecipesContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  recipeCard: {
    height: 140,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeTitleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
      },
  recipeImage: {
    width: '100%',
    height: 140,
    //opacity: 0.6,

  },
  recipeTitle: {
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',

  },

  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  categoryCard: {
    height: 70,
    width: 97,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },


  // Estilos para la pantalla de búsqueda
  searchBarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 2, 
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor : '#FFFFFF',

   },
  searchBarInputContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FF9A16',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
  },
  searchBarInput: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
  },

  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FF9A16',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  filterButtonText: {
    color: '#FF9A16',
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sortButtonText: {
    color: '#888',
    fontSize: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'WorkSans_400Regular',
  },
  searchResultsContainer: {
    paddingHorizontal: 15,
  },
  
  recipeCardS: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    alignItems: 'center',
  },
  recipeImageS: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
  },
  recipeTitleS: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    marginRight: 5,
  },
  chef: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'WorkSans_400Regular',
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#FF9A16',
    borderWidth: 1,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'WorkSans_700Bold',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#333',
  },
  modalCloseButton: {
    backgroundColor: '#FF9A16',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'WorkSans_700Bold',
  },





  // Estilos para la barra de navegación
  bottomNavigation: {
    position: 'absolute',
    bottom: 20,
    left: 7,
    right: 7,
    borderRadius: 30,
    backgroundColor: '#FFD091',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#FF9A16', // Color naranja similar
    borderRadius: 30,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:2,
  },


});

export default styles;