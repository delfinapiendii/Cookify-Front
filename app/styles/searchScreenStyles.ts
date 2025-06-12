import { StyleSheet } from 'react-native';

const seacrhScreenStyles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
    marginBottom: 90,

  },
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

});

export default seacrhScreenStyles;