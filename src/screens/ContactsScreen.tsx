import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import { showError } from '../utils/errorHandler';

interface Contact {
  id: string | undefined;
  name: string;
  phoneNumbers?: Array<{
    id: string;
    number: string;
    isPrimary?: boolean;
  }>;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data.filter(contact => contact.id) as Contact[]);
        }
      } else {
        showError(
          'Permiso denegado',
          'Necesitamos permiso para acceder a tus contactos'
        );
      }
    })();
  }, []);

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        {item.phoneNumbers?.map((phone, index) => (
          <View key={phone.id || index} style={styles.phoneContainer}>
            <Text style={styles.phone}>{phone.number}</Text>
            {phone.isPrimary && (
              <Ionicons name="star" size={20} color="#FFD700" style={styles.icon} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contactos</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item, index) => item.id || index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },
  contactItem: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  icon: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
}); 