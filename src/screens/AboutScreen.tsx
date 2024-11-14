import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';

interface TeamInfo {
  teamName: string;
  members: string[];
}

const TEAM_INFO = {
  teamName: "Equipo 1",
  members: [
    "Juan Pérez",
    "María García",
    // Add your team members here
  ]
};

export default function AboutScreen() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Acerca de</Text>
        
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{TEAM_INFO.teamName}</Text>
          {TEAM_INFO.members.map((member, index) => (
            <Text key={index} style={styles.memberName}>{member}</Text>
          ))}
        </View>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamInfo: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  teamName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  memberName: {
    fontSize: 18,
    marginVertical: 5,
    color: '#34495e',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(236, 240, 241, 0.5)',
    borderRadius: 10,
    width: '100%',
    textAlign: 'center',
  },
}); 