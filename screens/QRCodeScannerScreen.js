import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRCodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Carregando o status da permissão
    return <View><Text>Verificando permissões...</Text></View>;
  }

  if (!permission.granted) {
    // Permissão negada ou ainda não solicitada
    return (
      <View style={styles.container}>
        <Text>Permissão para usar a câmera foi negada.</Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('QR Code lido', `Tipo: ${type}\nDados: ${data}`);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Escanear novamente" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
