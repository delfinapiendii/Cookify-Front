// components/LogoHeader.tsx
import React from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/Styles'; // ajustá el path si es necesario

const LogoHeader: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/images/logoWhite.png')} // Asegúrate de que la ruta sea correcta
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default LogoHeader;
