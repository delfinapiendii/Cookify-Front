import React from 'react';
 import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
 import * as SplashScreen from 'expo-splash-screen';

 // Define las props que el componente modal aceptará
 interface CustomAlertModalProps {
   isVisible: boolean; // Controla la visibilidad del modal
   title?: string; // Título del pop-up (ahora opcional con '?' )
   message: string; // Mensaje principal (sigue siendo obligatorio)
   onConfirm?: () => void; // Función a ejecutar al presionar "Sí" o "Aceptar"
   onCancel?: () => void; // Función a ejecutar al presionar "No" (opcional)
   confirmText?: string; // Texto para el botón de confirmación (por defecto "Sí" o "Aceptar")
   cancelText?: string; // Texto para el botón de cancelación (por defecto "No")
   showCancelButton?: boolean; // Controla si se muestra el botón de "No" (por defecto true)
 }

 const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
   isVisible,
   title, // Ya no es obligatorio aquí
   message,
   onConfirm,
   onCancel,
   confirmText = 'Sí', // Valor por defecto
   cancelText = 'No',   // Valor por defecto
   showCancelButton = true, // Valor por defecto
 }) => {
   const [fontsLoaded] = useFonts({
     WorkSans_400Regular,
     WorkSans_700Bold,
   });

   React.useEffect(() => {
     if (!fontsLoaded) {
       SplashScreen.preventAutoHideAsync();
     } else {
       SplashScreen.hideAsync();
     }
   }, [fontsLoaded]);

   if (!fontsLoaded) {
     return null; // O un componente de carga mientras las fuentes no estén listas
   }

   return (
     <Modal
       animationType="fade" // O "slide"
       transparent={true}
       visible={isVisible}
       onRequestClose={() => {
         if (onCancel) {
           onCancel();
         }
       }}
     >
       <View style={styles.modalOverlay}>
         <View style={styles.modalContainer}>
           {title && ( // Solo renderiza el título si se ha proporcionado
             <Text style={styles.modalTitle}>{title}</Text>
           )}
           <Text style={styles.modalMessage}>{message}</Text>

           <View style={styles.buttonContainer}>
             {showCancelButton && onCancel && (
               <TouchableOpacity
                 style={styles.buttonCancel}
                 onPress={onCancel}
               >
                 <Text style={styles.buttonTextCancel}>{cancelText}</Text>
               </TouchableOpacity>
             )}

             {onConfirm && (
               <TouchableOpacity
                 style={styles.buttonConfirm}
                 onPress={onConfirm}
               >
                 <Text style={styles.buttonTextConfirm}>{confirmText}</Text>
               </TouchableOpacity>
             )}
           </View>
         </View>
       </View>
     </Modal>
   );
 };

 const styles = StyleSheet.create({
   modalOverlay: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
   },
   modalContainer: {
     width: '80%', // Ajusta el ancho según tu diseño
     backgroundColor: '#fff',
     borderRadius: 20, // Bordes redondeados como en la imagen
     padding: 25,
     alignItems: 'center',
     borderColor: '#FF9A16', // Borde naranja como en la imagen
     borderWidth: 2,
     shadowColor: '#000', // Sombra para un efecto 3D
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
   modalTitle: {
     fontSize: 22,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
     marginBottom: 15, // Añade margen inferior al título si está presente
     color: '#333',
     textAlign: 'center',
   },
   modalMessage: {
     fontSize: 16,
     fontFamily: 'WorkSans_400Regular',
     textAlign: 'center',
     marginBottom: 25,
     color: '#555',
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     width: '100%',
   },
   buttonConfirm: {
     backgroundColor: '#FF9A16', // Naranja
     borderRadius: 30, // Botones redondeados
     paddingVertical: 12,
     paddingHorizontal: 25,
     minWidth: 100, // Ancho mínimo para los botones
     alignItems: 'center',
     justifyContent: 'center',
     marginHorizontal: 10, // Espacio entre botones
   },
   buttonTextConfirm: {
     color: '#fff',
     fontSize: 16,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
   },
   buttonCancel: {
     backgroundColor: '#e0e0e0', // Gris claro
     borderRadius: 30,
     paddingVertical: 12,
     paddingHorizontal: 25,
     minWidth: 100,
     alignItems: 'center',
     justifyContent: 'center',
     marginHorizontal: 10,
   },
   buttonTextCancel: {
     color: '#555',
     fontSize: 16,
     fontWeight: 'bold',
     fontFamily: 'WorkSans_700Bold',
   },
 });

 export default CustomAlertModal;