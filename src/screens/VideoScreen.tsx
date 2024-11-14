import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from '../utils/errorHandler';
import { BackgroundWrapper } from '../components/BackgroundWrapper';

const VIDEO_URL_KEY = 'video_url';

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const isYoutubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function VideoScreen() {
  const [videoUrl, setVideoUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

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

  const onError = (error: string) => {
    showError('Error de Video', 'No se pudo reproducir el video: ' + error);
  };

  const renderVideo = () => {
    if (!savedUrl) return null;

    if (isYoutubeUrl(savedUrl)) {
      const videoId = getYoutubeVideoId(savedUrl);
      if (!videoId) {
        return (
          <Text style={styles.placeholder}>
            URL de YouTube inválida
          </Text>
        );
      }
      return (
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={300}
            width={400}
            videoId={videoId}
            play={false}
          />
        </View>
      );
    }

    // For non-YouTube videos (direct video files)
    if (savedUrl.match(/\.(mpmov|avi|wmv|m4v|3gp|mkv)$/i)) {
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: savedUrl }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={false}
            onPlaybackStatusUpdate={status => setStatus(status)}
            onError={error => onError(error)}
          />
        </View>
      );
    }

    return (
      <Text style={styles.placeholder}>
        URL inválida. Debe ser un video de YouTube o un archivo de video válido.
      </Text>
    );
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
        
        <Button title="Guardar URL" onPress={handleUrlSubmit} />

        {savedUrl ? renderVideo() : (
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
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 15,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    borderRadius: 15,
    overflow: 'hidden',
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 40,
    color: '#2c3e50',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 24,
  },
});