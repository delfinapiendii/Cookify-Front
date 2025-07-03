import { router, Stack } from 'expo-router';
import { useFonts, WorkSans_400Regular, WorkSans_700Bold} from '@expo-google-fonts/work-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Network from 'expo-network';


SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [isConnected, setIsConnected] = useState(true);

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_700Bold,
  });

  useEffect(() => {
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected && networkState.isInternetReachable);
    };

    checkConnection();

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      router.push('/ConnectionErrorScreen');
    }
  }, [isConnected]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}
