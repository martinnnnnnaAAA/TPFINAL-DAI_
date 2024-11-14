import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_IMAGE_KEY = 'background_image';

interface BackgroundContextType {
  backgroundImage: string | null;
  setBackgroundImage: (uri: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  backgroundImage: null,
  setBackgroundImage: () => {},
});

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    loadSavedImage();
  }, []);

  const loadSavedImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(BACKGROUND_IMAGE_KEY);
      if (savedImage) {
        setBackgroundImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  };

  const saveBackgroundImage = async (uri: string | null) => {
    try {
      console.log('Context saving background:', uri);
      if (uri) {
        await AsyncStorage.setItem(BACKGROUND_IMAGE_KEY, uri);
      } else {
        await AsyncStorage.removeItem(BACKGROUND_IMAGE_KEY);
      }
      setBackgroundImage(uri);
      console.log('Context saved background successfully');
    } catch (error) {
      console.error('Error saving background image:', error);
    }
  };

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage: saveBackgroundImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext); 