import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function IaConsultor() {
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const [mensagens, setMensagens] = useState([
    { id: 1, remetente: 'ia', texto: 'Olá Viajante! Sou o Tuco. Para onde vamos hoje?' }
  ]);

  const enviarMensagem = async () => {
    if (input.trim() === '') return;

    const novaMsg = { id: Date.now(), remetente: 'usuario', texto: input };
    setMensagens(mensagensAtuais => [...mensagensAtuais, novaMsg]);
    setInput('');
    setCarregando(true);

    const MINHA_CHAVE_GEMINI = process.env.EXPO_PUBLIC_GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${MINHA_CHAVE_GEMINI}`;

    try {
      const payload = {
        contents: [{ parts: [{ text: `Você é o Tuco, um assistente de viagens amigável. Responda em português brasileiro de forma concisa: ${input}` }] }]
      };

      const resposta = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const textoIA = resposta.data.candidates[0].content.parts[0].text;

      setMensagens(mensagensAtuais => [...mensagensAtuais, { id: Date.now() + 1, remetente: 'ia', texto: textoIA }]);
    } catch (error) {
      console.log("Erro da API Gemini:", error.response ? error.response.data : error.message);
      setMensagens(mensagensAtuais => [...mensagensAtuais, { id: Date.now() + 1, remetente: 'ia', texto: 'Ops, tive um probleminha de conexão. Tente novamente!' }]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#2E8B57" />
        <Text style={styles.tituloHeader}>Tuco IA</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={{padding: 20}}>
        {Array.isArray(mensagens) && mensagens.map(msg => (
          <View key={msg.id} style={[styles.balao, msg.remetente === 'usuario' ? styles.balaoUsuario : styles.balaoIA]}>
            <Text style={[styles.textoMsg, msg.remetente === 'usuario' && {color: '#FFF'}]}>{msg.texto}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Pergunte ao Tuco..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
          {carregando ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={20} color="#FFF" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', margin: 15, borderRadius: 30, overflow: 'hidden' },
  header: { flexDirection: 'row', padding: 20, backgroundColor: '#F9F9F9', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tituloHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  chatArea: { flex: 1 },
  balao: { maxWidth: '85%', padding: 15, borderRadius: 20, marginBottom: 12 },
  balaoIA: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  balaoUsuario: { backgroundColor: '#2E8B57', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  textoMsg: { fontSize: 15, color: '#333', lineHeight: 20 },
  inputArea: { flexDirection: 'row', padding: 15, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
  input: { flex: 1, backgroundColor: '#F5F5F5', height: 45, borderRadius: 20, paddingHorizontal: 15 },
  botaoEnviar: { backgroundColor: '#2E8B57', width: 45, height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});