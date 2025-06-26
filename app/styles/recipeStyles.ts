import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  
  recipeImage: {
    width: '100%',
    height: '100%',
    
  },
  
  backButton: {
    position: 'absolute',
    top: 58, // o el valor que necesites para separarlo del borde superior (considera status bar)
    left: 15,
    backgroundColor: '#FF9A16',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  
  recipeInfo: {
    marginTop: -30, // Esto sube la sección blanca encima de la imagen
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  bookmarkContainer: {
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
    marginBottom: 10, // Espacio entre el bookmark y el título
  },
  
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
     marginBottom: 5,
     paddingBottom:20,


    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
      },
      
   author: {
     fontSize: 16,
     color: '#888',
     fontFamily: 'WorkSans_400Regular',
     marginBottom: 8,
     paddingTop: 15,
   },
   ratingAndServings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    marginLeft: 5,
    color: '#888',
    fontFamily: 'WorkSans_400Regular',
  },
  servingsContainer: {
    alignItems: 'center',

  },
  servingsLabel: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#333',
    alignItems: 'center',

  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  servingsButton: {
    padding: 5,
  },
  servingsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#333',
  },
   date: {
     fontSize: 14,
     color: '#aaa',
     fontFamily: 'WorkSans_400Regular',
     marginBottom: 15,
   },
   description: {
     fontSize: 16,
     lineHeight: 24,
     fontFamily: 'WorkSans_400Regular',
     marginBottom: 20,
     paddingLeft: 20,
   },
   section: {
     marginBottom: 20,
   },
   sectionTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
     marginBottom: 10,
     marginTop: 20,
   },
   listItem: {
     fontSize: 16,
     lineHeight: 24,
     margin:5,
     fontFamily: 'WorkSans_400Regular',
   },
   stepNumber: {
     fontWeight: 'bold',
     color: '#FF9A16',
   },
   comment: {
     marginBottom: 10,
     backgroundColor: '#F5F5F5',
     borderRadius: 10,
        padding: 20,
   },
   commentAuthor: {
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
     marginRight: 5,
   },
   commentText: {
     fontSize: 16,
     fontFamily: 'WorkSans_400Regular',
   },
   addCommentContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 15,
     borderColor: '#ccc',
     borderWidth: 1,
     borderRadius: 25,
     paddingHorizontal: 10,
   },
   commentInput: {
     flex: 1,
     paddingVertical: 10,
     fontFamily: 'WorkSans_400Regular',
   },
   sendButton: {
     padding: 10,
   },
   openRatingButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  openRatingText: {
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
    color: '#333',
    marginBottom: 5,
  },
  currentRating: {
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    borderColor: '#FF9A16',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans_700Regular',
    marginBottom: 15,
  },
  modalRatingStars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#FF9A16',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 1,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'WorkSans_400Regular',
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
// Estilos para imágenes de pasos (añade estos a tu styles/recipeStyles.ts si no los tienes)
stepContainer: {
    marginBottom: 10,
    width:'100%',

},
stepImage: {
    borderRadius: 8,
    marginTop: 10,
    height: 200,
    resizeMode: 'cover',
    width:'100%',
    backgroundColor: '#eee',
    aspectRatio: 4 / 3,
    justifyContent:'center',
},
noCommentsText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
}
 });
 export default  styles;
