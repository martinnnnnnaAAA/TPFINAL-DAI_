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
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  video: {
    width: '90%',
    height: 300,
    backgroundColor: '#000',
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