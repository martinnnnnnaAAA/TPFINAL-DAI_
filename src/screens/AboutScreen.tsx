import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { showError } from '../utils/errorHandler';

const TEAM_INFO = {
  teamName: "Equipo 1",
  members: [
    "Juan Pérez",
    "María García",
    // Add your team members here
  ]
};

export default function AboutScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedTeam, setScannedTeam] = useState<{ teamName: string, members: string[] } | null>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        showError('Permiso denegado', 'Se necesita acceso a la cámara para escanear códigos QR');
      }
    } catch (error) {
      showError('Error', 'No se pudo solicitar el permiso de la cámara');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const teamData = JSON.parse(data);
      if (teamData.teamName && teamData.members) {
        setScannedTeam(teamData);
      } else {
        showError('Error', 'Código QR inválido');
      }
    } catch (error) {
      showError('Error', 'No se pudo leer el código QR');
    }
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Acerca de</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={JSON.stringify(TEAM_INFO)}
          size={200}
          backgroundColor="white"
        />
      </View>

      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{TEAM_INFO.teamName}</Text>
        {TEAM_INFO.members.map((member, index) => (
          <Text key={index} style={styles.memberName}>{member}</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={() => setScanning(true)}
      >
        <Text style={styles.scanButtonText}>Escanear Otro Equipo</Text>
      </TouchableOpacity>

      <Modal
        visible={scanning}
        animationType="slide"
        onRequestClose={() => setScanning(false)}
      >
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setScanning(false)}
          >
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={!!scannedTeam}
        animationType="slide"
        transparent
        onRequestClose={() => setScannedTeam(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTeamName}>{scannedTeam?.teamName}</Text>
            <Text style={styles.modalSubtitle}>Integrantes:</Text>
            {scannedTeam?.members.map((member, index) => (
              <Text key={index} style={styles.modalMember}>{member}</Text>
            ))}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setScannedTeam(null)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    width: '100%',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
  },
  teamInfo: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: '90%',
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    marginVertical: 5,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTeamName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalMember: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});