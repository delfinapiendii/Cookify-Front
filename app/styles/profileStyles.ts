import { StyleSheet, Dimensions } from 'react-native';
 const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 60,
        marginBottom: 90,
        paddingLeft: 10,
        paddingRight: 10,
    
      },
  
  headerText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular', // Asegúrate de que la fuente esté cargada
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

  greetingText: {
    fontSize: 26,
    fontFamily: 'WorkSans_700Bold', // Fuente más negrita para el saludo
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#FFF8EF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400, // Limitar el ancho para pantallas más grandes
    
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans_700Bold',
    color: '#333',
  },
  dataText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#555',
    marginBottom: 5,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#333',
    marginLeft: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  containerEdit: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'WorkSans_700Bold',
    color: '#333',
    alignSelf: 'flex-start',
    paddingBottom: 20,

    marginLeft: width * 0.05,
  },

  input: {
    height: 65,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    fontFamily: 'WorkSans_400Regular',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,

    
    textAlign: 'center',
    color: '#A2A2A2',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },

  errorMessage: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'WorkSans_400Regular',
    marginBottom: 20,
    alignSelf: 'center',
  },
  loginButton: {
    height: 65,
    backgroundColor: '#FF9A16',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'WorkSans_400Regular',
  },
  infoText: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'WorkSans_400Regular',
    textAlign: 'center',
    padding:20,
  }, divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom:30,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  recipesListContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    flex: 1,},
  recipeItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans_700Bold', // Use your bold font
    color: '#333',
    marginBottom: 5,
  },
  recipeStatus: {
    fontSize: 14,
    fontFamily: 'WorkSans_400Regular', // Use your regular font
    color: '#666',
    marginBottom: 3,
  },
  recipeDate: {
    fontSize: 12,
    fontFamily: 'WorkSans_400Regular',
    color: '#999',
  },
  noRecipesText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },


});
export default  styles;
