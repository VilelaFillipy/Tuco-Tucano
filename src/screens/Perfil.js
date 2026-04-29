import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
      <Text style={styles.subtitulo}>Informacoes do utilizador.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', margin: 15, borderRadius: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 16, color: '#666', marginTop: 10 }
});