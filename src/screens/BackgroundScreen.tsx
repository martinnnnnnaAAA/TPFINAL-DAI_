import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useBackground } from '../context/BackgroundContext';
import { BackgroundWrapper } from '../components/BackgroundWrapper';

export default function BackgroundScreen() {
  const { backgroundImage, setBackgroundImage } = useBackground();

  useEffect(() => {
    (async () => {
      // Request media library permissions first
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitas dar permiso para acceder a tu galería de fotos',
          [{ text: 'OK' }]
        );
        return;
      }

      // Then request camera permissions
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitas dar permiso para acceder a la cámara',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const saveImage = async (uri: string) => {
    try {
      await setBackgroundImage(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [16, 9],
      });

      if (!result.cancelled && result.uri) {
        await saveImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert('Error', 'Se necesita permiso para acceder a la galería');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled && result.uri) {
        await saveImage(result.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Fondo de Pantalla</Text>
        
        {backgroundImage && (
          <Image
            source={{ uri: backgroundImage }}
            style={styles.preview}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Seleccionar de Galería</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  preview: {
    width: '80%',
    height: 200,
    marginVertical: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});