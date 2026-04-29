import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Dashboard from './src/screens/Dashboard';
import Historico from './src/screens/Historico';
import Planejar from './src/screens/Planejar';
import IaConsultor from './src/screens/IaConsultor';
import Perfil from './src/screens/Perfil';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('dashboard');

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'dashboard': return <Dashboard />;
      case 'historico': return <Historico />;
      case 'planejar': return <Planejar />;
      case 'ia': return <IaConsultor />;
      case 'perfil': return <Perfil />;
      default: return <Dashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <View style={styles.headerSimulado}>
        <Text style={styles.textoLogo}>Tuco Tucano</Text>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>

      <View style={styles.conteudo}>
        {renderizarTela()}
      </View>

      <View style={styles.menuInferior}>
        <TouchableOpacity style={styles.botaoMenu} onPress={() => setTelaAtual('dashboard')}>
          <Ionicons name="home-outline" size={24} color={telaAtual === 'dashboard' ? '#2E8B57' : '#888'} />
          <Text style={[styles.textoMenu, telaAtual === 'dashboard' && styles.textoMenuAtivo]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoMenu} onPress={() => setTelaAtual('historico')}>
          <Ionicons name="time-outline" size={24} color={telaAtual === 'historico' ? '#2E8B57' : '#888'} />
          <Text style={[styles.textoMenu, telaAtual === 'historico' && styles.textoMenuAtivo]}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCentro} onPress={() => setTelaAtual('planejar')}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoMenu} onPress={() => setTelaAtual('ia')}>
          <Ionicons name="sparkles-outline" size={24} color={telaAtual === 'ia' ? '#2E8B57' : '#888'} />
          <Text style={[styles.textoMenu, telaAtual === 'ia' && styles.textoMenuAtivo]}>Tuco IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoMenu} onPress={() => setTelaAtual('perfil')}>
          <Ionicons name="person-outline" size={24} color={telaAtual === 'perfil' ? '#2E8B57' : '#888'} />
          <Text style={[styles.textoMenu, telaAtual === 'perfil' && styles.textoMenuAtivo]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  headerSimulado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  textoLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  conteudo: {
    flex: 1,
  },
  menuInferior: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 75,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  botaoMenu: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textoMenu: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  textoMenuAtivo: {
    color: '#2E8B57',
    fontWeight: 'bold',
  },
  botaoCentro: {
    backgroundColor: '#2E8B57',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    elevation: 8,
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});