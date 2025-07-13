import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

// Lista local de produtos
const produtos = [
  { nome: "Tênis Branco Nike", codigo: "123456789012", preco: 150.00, setor: "Masculino" },
  { nome: "Sapatilha Preta", codigo: "123456789013", preco: 49.00, setor: "Feminino" },
  { nome: "Bota Couro", codigo: "123456789014", preco: 200.00, setor: "Masculino" },
  { nome: "Bolsa Preta Armani", codigo: "123456789015", preco: 300.00, setor: "Feminino" },
  { nome: "Relógio Rolex", codigo: "123456789016", preco: 1500.00, setor: "Masculino" }
];

export default function CodigoBarraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  if (!permission) {
    return <View><Text>Verificando permissões...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permissão para usar a câmera foi negada.</Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log('📸 Código lido:', data);

    try {
      // Tenta interpretar como JSON (para QR Codes com objeto completo)
      const produto = JSON.parse(data);
      console.log('📦 Produto lido (JSON):', produto);

      if (typeof produto === 'string') {
        const produtoEncontrado = produtos.find(p => p.codigo === produto.trim());
        if (!produtoEncontrado) {
          Alert.alert('Produto não encontrado', `Nenhum produto com o código: ${produto}`);
          setScanned(false);
          return;
        }
        navigation.navigate('FormularioDevolucao', { produto: produtoEncontrado });
      } else if (typeof produto === 'object' && produto !== null) {
        navigation.navigate('FormularioDevolucao', { produto });
      } else {
        Alert.alert('Erro', 'Dados do produto inválidos.');
        setScanned(false);
      }

    } catch (error) {
      console.log('⚠️ Erro ao interpretar como JSON:', error);

      const codigoLimpo = data.trim();
      const produtoEncontrado = produtos.find(p => p.codigo === codigoLimpo);

      if (!produtoEncontrado) {
        Alert.alert('Produto não encontrado', `Nenhum produto com o código: ${data}`);
        setScanned(false);
        return;
      }

      console.log('✅ Produto encontrado:', produtoEncontrado);
      navigation.navigate('FormularioDevolucao', { produto: produtoEncontrado });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} 
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'code128', 'qr'],
        }}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Escanear novamente" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});
