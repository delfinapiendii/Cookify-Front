import { StyleSheet, Dimensions } from 'react-native';

 const { width, height } = Dimensions.get('window');

 export const loginStyles = StyleSheet.create({
   safeArea: {
     flex: 1,
     backgroundColor: '#fff',
     position: 'relative',
   },
   backgroundImage: {
     position: 'absolute',
     bottom: 0,
     width: 220,
     height: 220,
     zIndex: 0,
   },
   contentWrapper: {
     flex: 1,
     zIndex: 1,
     backgroundColor: 'transparent',
   },
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'flex-start',
     paddingTop: 0,
   },
   backarrow: {
   },
   header: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     width: '100%',
     paddingHorizontal: 20,
     paddingTop: 50,
     marginBottom: 40,
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
   backButton: {
   },
   logoComponent: {
     marginBottom: 10,
   },
   title: {
     fontSize: 28,
     fontFamily: 'WorkSans_700Bold',
     color: '#333',
     marginBottom: 30,
     alignSelf: 'flex-start',
     marginLeft: width * 0.05,
   },
   input: {
     width: '90%',
     height: 65,
     backgroundColor: '#F5F5F5',
     borderRadius: 30,
     paddingHorizontal: 15,
     fontSize: 20,
     fontFamily: 'WorkSans_400Regular',
     marginBottom: 20,
     
     textAlign: 'center',
     color: '#A2A2A2',
   },
   loginButton: {
     width: '90%',
     height: 65,
     backgroundColor: '#FF9A16',
     borderRadius: 30,
     justifyContent: 'center',
     alignItems: 'center',
     marginTop: 10,
     marginBottom: 25,
   },
   loginButtonText: {
     color: '#fff',
     fontSize: 20,
     fontFamily: 'WorkSans_400Regular',
   },
   forgotPasswordText: {
     color: '#000000',
     fontSize: 15,
     fontFamily: 'WorkSans_400Regular',
     textAlign: 'center',
   },
   emailResetText: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'WorkSans_400Regular',
    textAlign: 'center',
    paddingBottom: 20,
  },
   forgotPasswordLink: {
     color: '#FF9A16',
     fontSize: 15,
     fontFamily: 'WorkSans_400Regular',
     textDecorationLine: 'underline',
     justifyContent: 'center',
   },
   errorMessage: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'WorkSans_400Regular',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
 });
 export default  loginStyles;
