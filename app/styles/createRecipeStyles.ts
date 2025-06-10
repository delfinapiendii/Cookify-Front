import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
    paddingBottom: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  stepInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 60,
    textAlignVertical: 'top',
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
});
