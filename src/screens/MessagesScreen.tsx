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
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timestamp: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  message: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  noMessages: {
    textAlign: 'center',
    marginTop: 40,
    color: '#2c3e50',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});