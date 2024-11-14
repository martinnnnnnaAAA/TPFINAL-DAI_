import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from '../utils/errorHandler';
import { BackgroundWrapper } from '../components/BackgroundWrapper';

const VIDEO_URL_KEY = 'video_url';

export default function VideoScreen() {
  const [videoUrl, setVideoUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');

  useEffect(() => {
    loadSavedUrl();
  }, []);

  const loadSavedUrl = async () => {
    try {
      const url = await AsyncStorage.getItem(VIDEO_URL_KEY);
      if (url) {
        setVideoUrl(url);
        setSavedUrl(url);
      }
    } catch (error) {
      showError('Error', 'No se pudo cargar la URL guardada');
    }
  };

  const handleUrlSubmit = async () => {
    try {
      if (videoUrl) {
        await AsyncStorage.setItem(VIDEO_URL_KEY, videoUrl);
        setSavedUrl(videoUrl);
      }
    } catch (error) {
      showError('Error', 'No se pudo guardar la URL');
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Video Favorito</Text>
        
        <TextInput
          style={styles.input}
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder="Ingresa la URL del video"
          onSubmitEditing={handleUrlSubmit}
          autoCapitalize="none"
        />

        {savedUrl ? (
          <Video
            source={{ uri: savedUrl }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
        ) : (
          <Text style={styles.placeholder}>
            Ingresa una URL de video para reproducir
          </Text>
        )}
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
  },
  input: {
    margin: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  video: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
});