import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ResultadoViagem from '../components/ResultadoViagem';

export default function Dashboard() {
  const [proximaViagem, setProximaViagem] = useState(null);
  const [viagemSelecionada, setViagemSelecionada] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const historicoSalvo = await AsyncStorage.getItem('@tuco_historico');
        if (historicoSalvo) {
          const historicoAjustado = JSON.parse(historicoSalvo);
          if (historicoAjustado.length > 0) {
            setProximaViagem(historicoAjustado[0]);
          }
        }
      } catch (e) { console.log(e); }
    };
    carregarDados();
  }, []);

  if (viagemSelecionada) {
    return (
      <View style={styles.containerResultado}>
        <ResultadoViagem dados={viagemSelecionada} voltar={() => setViagemSelecionada(null)} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.saudacao}>Olá Viajante!</Text>
        <Text style={styles.nomeUsuario}>Vamos explorar o mundo?</Text>
      </View>

      <View style={styles.sessaoAcoes}>
        <View style={[styles.cardAcao, {backgroundColor: '#E8F5E9'}]}>
          <Ionicons name="map" size={24} color="#2E8B57" />
          <Text style={styles.textoAcao}>Roteiros</Text>
        </View>
        <View style={[styles.cardAcao, {backgroundColor: '#FFF3E0'}]}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FF9800" />
          <Text style={styles.textoAcao}>Dicas IA</Text>
        </View>
        <View style={[styles.cardAcao, {backgroundColor: '#E3F2FD'}]}>
          <Ionicons name="images" size={24} color="#2196F3" />
          <Text style={styles.textoAcao}>Galeria</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Último Planejamento</Text>

      {proximaViagem ? (
        <TouchableOpacity style={styles.cardPrincipal} onPress={() => setViagemSelecionada(proximaViagem)}>
          <ImageBackground source={{ uri: proximaViagem.imagemCapa }} style={styles.imgBg} imageStyle={{ borderRadius: 25 }}>
            <View style={styles.overlay}>
              <View style={styles.badgeClima}>
                <Ionicons name="thermometer" size={16} color="#FFF" />
                <Text style={styles.tempTexto}>{Math.round(proximaViagem.clima?.main?.temp)}°C</Text>
              </View>
              <View>
                <Text style={styles.destinoNome}>{proximaViagem.capital}</Text>
                <Text style={styles.destinoData}>{proximaViagem.dataViagem}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ) : (
        <View style={styles.cardVazio}>
          <Ionicons name="airplane-outline" size={50} color="#DDD" />
          <Text style={styles.vazioTexto}>Crie seu primeiro roteiro!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  containerResultado: { flex: 1, backgroundColor: '#FFF', padding: 20, margin: 15, borderRadius: 30 },
  header: { marginBottom: 25 },
  saudacao: { fontSize: 28, fontWeight: 'bold', color: '#333333ff' },
  nomeUsuario: { fontSize: 18, fontWeight: 'bold', color: '#807a7aff' },
  sessaoAcoes: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  cardAcao: { width: '30%', padding: 15, borderRadius: 20, alignItems: 'center' },
  textoAcao: { fontSize: 12, fontWeight: 'bold', color: '#444', marginTop: 8 },
  secaoTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  cardPrincipal: { height: 220, borderRadius: 25, elevation: 5 },
  imgBg: { flex: 1, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 25, height: '100%', justifyContent: 'space-between' },
  badgeClima: { flexDirection: 'row', alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, alignItems: 'center' },
  tempTexto: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  destinoNome: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  destinoData: { color: '#EEE', fontSize: 14 },
  cardVazio: { height: 200, backgroundColor: '#F9F9F9', borderRadius: 25, borderStyle: 'dashed', borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  vazioTexto: { color: '#AAA', marginTop: 10 }
});