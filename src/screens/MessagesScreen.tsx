import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundWrapper } from '../components/BackgroundWrapper';

interface ErrorMessage {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

const ERROR_HISTORY_KEY = 'error_history';
const MAX_MESSAGES = 10;

export const getErrorHistory = async (): Promise<ErrorMessage[]> => {
  try {
    const history = await AsyncStorage.getItem(ERROR_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    return [];
  }
};

export const addErrorToHistory = async (title: string, message: string) => {
  try {
    const history = await getErrorHistory();
    const newError: ErrorMessage = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHistory = [newError, ...history].slice(0, MAX_MESSAGES);
    await AsyncStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error saving to history:', error);
    return [];
  }
};

export default function MessagesScreen() {
  const [errorHistory, setErrorHistory] = useState<ErrorMessage[]>([]);

  useEffect(() => {
    loadErrorHistory();
  }, []);

  const loadErrorHistory = async () => {
    const history = await getErrorHistory();
    setErrorHistory(history);
  };

  const renderErrorMessage = ({ item }: { item: ErrorMessage }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Historial de Mensajes</Text>
        {errorHistory.length > 0 ? (
          <FlatList
            data={errorHistory}
            renderItem={renderErrorMessage}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text style={styles.noMessages}>No hay mensajes para mostrar</Text>
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
  messageContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
  },
  noMessages: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
});