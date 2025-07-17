import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import QRCodeScannerScreen from './screens/QRCodeScannerScreen';
import FormularioDevolucaoScreen from './screens/FormularioDevolucaoScreen';
import CodigoBarraScreen from './screens/CodigoBarraScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
        <Stack.Screen name="FormularioDevolucao" component={FormularioDevolucaoScreen} />
        <Stack.Screen name="CodigoBarra" component={CodigoBarraScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
