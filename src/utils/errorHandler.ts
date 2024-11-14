import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export const showError = async (title: string, message: string) => {

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn('Haptics not supported');
  }

  Alert.alert(title, message);
}; 