// styles/RegisterStyles.js
import { StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: '#333',
    fontFamily: 'WorkSans_400Regular',
    paddingBottom: 20,
  },
  titleContrasena: {
    fontSize: 20,
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'WorkSans_400Regular',
    paddingBottom: 20,
  },
  input: {
    height: 65,
    borderColor: '#ccc',
    borderRadius: 30,
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
    fontFamily: 'WorkSans_400Regular',
    fontSize: 17,
    maxHeight: 65,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
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
    maxHeight: 65,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#FF9A16',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'WorkSans_400Regular',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
});

export default registerStyles;
