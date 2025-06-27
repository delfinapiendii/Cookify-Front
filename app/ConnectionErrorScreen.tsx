// components/ConnectionErrorScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router'; // Assuming you are using Expo Router
import { useFonts, WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';

interface ConnectionErrorScreenProps {
  onGoBack?: () => void; // Optional prop if you want to override default goBack
}

const ConnectionErrorScreen: React.FC<ConnectionErrorScreenProps> = ({ onGoBack }) => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Or a loading spinner for fonts
  }

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback if there's no screen to go back to (e.g., if this is the first screen)
      // You might want to navigate to a home screen instead
      console.log('Cannot go back, no previous screen in stack.');
      // router.push('/'); // Example: navigate to home if using Expo Router
    }
  };

  return (
    <View style={connectionErrorStyles.container}>
       <Image
        source={require('../assets/images/salad.png')}
        style={connectionErrorStyles.backgroundImage}
        resizeMode="cover"
      />
      <TouchableOpacity style={connectionErrorStyles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={connectionErrorStyles.content}>
        <Text style={connectionErrorStyles.oopsText}>Oops!</Text>
        <Text style={connectionErrorStyles.messageText}>
          Lamentablemente no te podemos conectar a nuestro sitio en este momento.
        </Text>
        <Text style={connectionErrorStyles.messageText}>
          Puede que sea un problema de servidor. Intentelo mas tarde.
        </Text>
       
      </View>
    </View>
  );
};

const connectionErrorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light gray background
    alignItems: 'center',
    paddingTop: 60, // Adjust for status bar
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as needed
    left: 20,
    zIndex: 10,
    padding: 10, // Make touchable area larger
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -50, // Pull content up slightly to accommodate back button
  },
  oopsText: {
    fontSize: 25,
    fontFamily: 'WorkSans_700Bold',
    color: '#333',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 18,
    fontFamily: 'WorkSans_400Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 220,
    zIndex: 0,
    left:10,
  },
});

export default ConnectionErrorScreen;