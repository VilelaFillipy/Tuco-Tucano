import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ResultadoViagem from '../components/ResultadoViagem';

export default function Historico() {
  const [lista, setLista] = useState([]);
  const [viagemSelecionada, setViagemSelecionada] = useState(null);

  const carregarHistorico = async () => {
    try {
      const historicoSalvo = await AsyncStorage.getItem('@tuco_historico');
      if (historicoSalvo) {
        setLista(JSON.parse(historicoSalvo));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const confirmarExclusao = (id) => {
    Alert.alert(
      "Excluir",
      "Deseja remover esta consulta do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deletarItem(id), style: "destructive" }
      ]
    );
  };

  const deletarItem = async (id) => {
    try {
      const novaLista = lista.filter(item => item.id !== id);
      setLista(novaLista);
      await AsyncStorage.setItem('@tuco_historico', JSON.stringify(novaLista));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  };

  if (viagemSelecionada) {
    return (
      <View style={styles.containerResultado}>
        <ResultadoViagem dados={viagemSelecionada} voltar={() => {setViagemSelecionada(null); carregarHistorico();}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {lista.length > 0 ? (
          lista.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <TouchableOpacity style={styles.card} onPress={() => setViagemSelecionada(item)}>
                <View style={styles.iconeView}>
                  <Ionicons name="airplane" size={22} color="#FFF" />
                </View>
                <View style={styles.dadosView}>
                  <Text style={styles.capital}>{item.capital}</Text>
                  <Text style={styles.data}>{item.dataViagem}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoDeletar} onPress={() => confirmarExclusao(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.vazio}>
            <Ionicons name="folder-open-outline" size={60} color="#CCC" />
            <Text style={styles.textoVazio}>Histórico vazio</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', margin: 15, borderRadius: 30, padding: 20 },
  containerResultado: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, margin: 15, borderRadius: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  scroll: { paddingBottom: 20 },
  cardWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  card: { flex: 1, flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 2 },
  iconeView: { backgroundColor: '#2E8B57', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  dadosView: { marginLeft: 15 },
  capital: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  data: { fontSize: 13, color: '#999', marginTop: 2 },
  botaoDeletar: { padding: 15 },
  vazio: { alignItems: 'center', marginTop: 100 },
  textoVazio: { color: '#CCC', fontSize: 18, marginTop: 15 }
});