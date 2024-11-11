import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useBackground } from '../context/BackgroundContext';

export const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  const { backgroundImage } = useBackground();

  return (
    <View style={styles.container}>
      {backgroundImage ? (
        <ImageBackground 
          source={{ uri: backgroundImage }} 
          style={styles.background}
          resizeMode="cover"
        >
          {children}
        </ImageBackground>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
  },
}); 