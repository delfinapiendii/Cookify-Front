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