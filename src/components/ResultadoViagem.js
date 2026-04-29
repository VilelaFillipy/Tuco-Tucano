import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResultadoViagem({ dados, voltar }) {
  if (!dados) return null;

  const renderizarCategoria = (titulo, icone, termoFiltro) => {
    if (!dados.locais) return null;
    
    const filtrados = dados.locais.filter(local => 
      local.properties.categories && local.properties.categories.includes(termoFiltro)
    );

    if (filtrados.length === 0) return null;

    return (
      <View style={styles.blocoCategoria}>
        <View style={styles.cabecalhoCategoria}>
          <Ionicons name={icone} size={22} color="#2E8B57" />
          <Text style={styles.tituloCategoria}>{titulo}</Text>
        </View>
        {filtrados.slice(0, 3).map((item, index) => (
          <Text key={index} style={styles.textoItem}>
            • {item.properties.name || 'Local sem nome cadastrado'}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="airplane" size={30} color="#2E8B57" />
        <Text style={styles.titulo}>Roteiro para {dados.capital}</Text>
      </View>
      
      <Text style={styles.dataBadge}>Data: {dados.dataViagem}</Text>

      <View style={styles.cardClima}>
        <Ionicons name="partly-sunny" size={40} color="#FFF" />
        <View style={styles.climaInfo}>
          <Text style={styles.temperatura}>{Math.round(dados.clima?.main?.temp)}°C</Text>
          <Text style={styles.condicao}>{dados.clima?.weather[0]?.description}</Text>
        </View>
      </View>

      <Text style={styles.subtituloPrincipal}>Recomendações</Text>
      
      <View style={styles.cardLocais}>
        {renderizarCategoria('Hotéis e Acomodações', 'bed', 'accommodation.hotel')}
        {renderizarCategoria('Restaurantes', 'restaurant', 'catering.restaurant')}
        {renderizarCategoria('Parques e Lazer', 'leaf', 'leisure.park')}
        {renderizarCategoria('Pontos Turísticos', 'camera', 'tourism.sights')}
      </View>

      <Image 
        source={{ uri: dados.imagemCapa }} 
        style={styles.imagemIA} 
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
        <Text style={styles.textoBotao}>Nova Busca</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  dataBadge: { alignSelf: 'center', backgroundColor: '#E8F5E9', color: '#2E8B57', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, fontWeight: 'bold', marginBottom: 20 },
  cardClima: { backgroundColor: '#2E8B57', flexDirection: 'row', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 3 },
  climaInfo: { marginLeft: 20 },
  temperatura: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  condicao: { fontSize: 16, color: '#E8F5E9', textTransform: 'capitalize' },
  subtituloPrincipal: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  cardLocais: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 15, marginBottom: 20 },
  blocoCategoria: { marginBottom: 15 },
  cabecalhoCategoria: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 5 },
  tituloCategoria: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57', marginLeft: 8 },
  textoItem: { fontSize: 15, color: '#555', marginBottom: 4, paddingLeft: 10 },
  imagemIA: { width: '100%', height: 200, borderRadius: 15, marginBottom: 20, backgroundColor: '#E0E0E0' },
  botaoVoltar: { backgroundColor: '#333', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  textoBotao: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});