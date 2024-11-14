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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
  },
  teamInfo: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    marginVertical: 2,
  },
}); 