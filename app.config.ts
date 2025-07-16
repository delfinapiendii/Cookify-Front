import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "cookify",
  slug: "Cookify",
  version: "1.0.0",
  scheme: "cookify",
  orientation: "portrait",
  // MODIFICACIÓN AQUI:
  icon: "./assets/images/burguer.png", // <--- Asegúrate de que el nombre del archivo sea correcto (por ejemplo, burguer.png)
  userInterfaceStyle: "automatic",
  android: {
    package: "com.delfipiendi.cookify",
    adaptiveIcon: {
      // MODIFICACIÓN AQUI:
      foregroundImage: "./assets/images/burguer.png", // <--- También usa tu imagen para el foreground del ícono adaptativo
      backgroundColor: "#ffffff",
    },
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
  },
  ios: {
    supportsTablet: true,
    // MODIFICACIÓN AQUI (Opcional, si quieres la misma imagen que la general):
    icon: "./assets/images/burguer.png", // <--- Usa tu imagen para iOS también
  },
  extra: {
    eas: {
      projectId: "dcc3240b-cf67-46e2-b1b2-3e8e26056490",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png", // Mantén tu splash screen actual
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-font",
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
});