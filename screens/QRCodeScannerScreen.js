import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function QRCodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  if (!permission) {
    return <View><Text>Verificando permissões...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permissão para usar a câmera foi negada.</Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const produto = JSON.parse(data);
      console.log('Produto lido do QR:', produto);
      navigation.navigate('FormularioDevolucao', { produto });
    } catch (error) {
      Alert.alert('QR Code inválido', 'Formato não reconhecido.');
      setScanned(false);
    }
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
