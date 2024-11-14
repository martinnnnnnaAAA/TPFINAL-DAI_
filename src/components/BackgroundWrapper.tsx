import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useBackground } from '../context/BackgroundContext';

export const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  const { backgroundImage } = useBackground();

  if (!backgroundImage) {
    return children;
  }

  return (
    <ImageBackground 
      source={{ uri: backgroundImage }} 
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
}); 