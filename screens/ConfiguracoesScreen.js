import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfiguracoesScreen({ navigation }) {
  const [emailCentral, setEmailCentral] = useState('');

  // Carrega o e-mail salvo localmente quando a tela abre
  useEffect(() => {
    const carregarEmail = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem('emailCentral');
        if (emailSalvo) setEmailCentral(emailSalvo);
      } catch (e) {
        Alert.alert('Erro', 'Falha ao carregar o e-mail salvo');
      }
    };
    carregarEmail();
  }, []);

  // Função que salva localmente e envia para o backend
  const salvarEmail = async () => {
    if (!emailCentral || !emailCentral.includes('@')) {
      Alert.alert('Erro', 'Informe um e-mail válido');
      return;
    }

    try {
      // 1. Salvar localmente
      await AsyncStorage.setItem('emailCentral', emailCentral);

      // 2. Enviar para o backend (troque pelo IP/URL correto do seu servidor)
      const response = await fetch('http://192.168.18.73:3000/config/email-central', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novoEmail: emailCentral }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o e-mail no servidor');
      }

      const data = await response.json();

      Alert.alert(
        'Sucesso',
        data.mensagem || 'E-mail da central atualizado!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Inicio'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar o e-mail.');
    }
  };

  const voltarParaHome = () => {
    navigation.navigate('Inicio');
  };

  return (
    <ImageBackground
      source={require('../assets/page_1.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>⚙️ Configurações</Text>

        <Text style={styles.label}>E-mail da Central</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@central.com"
          placeholderTextColor="#ccc"
          value={emailCentral}
          onChangeText={setEmailCentral}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={salvarEmail}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={voltarParaHome}>
          <Text style={styles.buttonText}>🔙 Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    margin: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
