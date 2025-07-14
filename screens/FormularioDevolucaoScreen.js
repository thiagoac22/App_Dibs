import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FormularioDevolucaoScreen({ route, navigation }) {
  const produtos = [
    { nome: "Tênis Branco Nike", codigo: "123456789012", preco: 150.00, setor: "Masculino" },
    { nome: "Sapatilha Preta", codigo: "123456789013", preco: 49.00, setor: "Feminino" },
    { nome: "Bota Couro", codigo: "123456789014", preco: 200.00, setor: "Masculino" },
    { nome: "Bolsa Preta Armani", codigo: "123456789015", preco: 300.00, setor: "Feminino" },
    { nome: "Relógio Rolex", codigo: "123456789016", preco: 1500.00, setor: "Masculino" }
  ];

  console.log('route.params:', route.params);
  console.log('produto tipo:', typeof route.params.produto);

  const paramProduto = route.params?.produto;

  // Verifica se recebeu o objeto ou apenas o código
  const produto = typeof paramProduto === 'object'
    ? paramProduto
    : produtos.find(p => p.codigo === String(paramProduto));

  const [motivo, setMotivo] = useState('');

  const handleConfirmar = async () => {
    if (!motivo.trim()) {
      Alert.alert('Atenção', 'Digite o motivo da devolução.');
      return;
    }

    try {
      const response = await fetch('http://192.168.18.73:3000/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: produto?.nome,
          codigo: produto?.codigo,
          preco: produto?.preco,
          setor: produto?.setor,
          motivo: motivo.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.mensagem);
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.erro || 'Erro ao enviar e-mail.');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  console.log("Produto resolvido para exibição:", produto);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={['#f43f5e', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.top}>
            <Image
              source={require('../assets/dibs_logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.card}>
            <InfoItem label="Produto" value={produto?.nome} />
            <InfoItem label="Código" value={produto?.codigo} />
            <InfoItem label="Setor" value={produto?.setor} />
            <InfoItem
              label="Preço"
              value={
                produto?.preco !== undefined && produto?.preco !== null
                  ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
                  : 'Preço indisponível'
              }
            />
          </View>

          <Text style={styles.sectionLabel}>Motivo da Devolução</Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva o motivo da devolução..."
            placeholderTextColor="#94a3b8"
            multiline
            value={motivo}
            onChangeText={setMotivo}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirmar}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#f43f5e', '#ffffff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Confirmar Devolução</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  top: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 160, height: 100, marginVertical: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  infoItem: { marginBottom: 12 },
  infoLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#1e293b', fontWeight: '600' },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 10 },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 130,
    marginBottom: 28,
    color: '#0f172a',
  },
  buttonWrapper: { borderRadius: 12, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 12 },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
