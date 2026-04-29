import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultadoViagem from '../components/ResultadoViagem';

const capitaisBrasil = {
  'Acre': 'Rio Branco', 'Alagoas': 'Maceió', 'Amapá': 'Macapá', 'Amazonas': 'Manaus',
  'Bahia': 'Salvador', 'Ceará': 'Fortaleza', 'Distrito Federal': 'Brasília',
  'Espírito Santo': 'Vitória', 'Goiás': 'Goiânia', 'Maranhão': 'São Luís',
  'Mato Grosso': 'Cuiabá', 'Mato Grosso do Sul': 'Campo Grande', 'Minas Gerais': 'Belo Horizonte',
  'Pará': 'Belém', 'Paraíba': 'João Pessoa', 'Paraná': 'Curitiba', 'Pernambuco': 'Recife',
  'Piauí': 'Teresina', 'Rio de Janeiro': 'Rio de Janeiro', 'Rio Grande do Norte': 'Natal',
  'Rio Grande do Sul': 'Porto Alegre', 'Rondônia': 'Porto Velho', 'Roraima': 'Boa Vista',
  'Santa Catarina': 'Florianópolis', 'São Paulo': 'São Paulo', 'Sergipe': 'Aracaju', 'Tocantins': 'Palmas'
};

export default function Planejar() {
  const [destino, setDestino] = useState('São Paulo');
  const [data, setData] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  
  const [carregando, setCarregando] = useState(false);
  const [resultadoAPI, setResultadoAPI] = useState(null);

  const mudarData = (evento, dataEscolhida) => {
    setMostrarCalendario(Platform.OS === 'ios');
    if (dataEscolhida) {
      setDataSelecionada(dataEscolhida);
      const dia = String(dataEscolhida.getDate()).padStart(2, '0');
      const mes = String(dataEscolhida.getMonth() + 1).padStart(2, '0');
      const ano = dataEscolhida.getFullYear();
      setData(`${dia}/${mes}/${ano}`);
    }
  };

  const salvarNoHistorico = async (novaBusca) => {
    try {
      const historicoSalvo = await AsyncStorage.getItem('@tuco_historico');
      const historicoAjustado = historicoSalvo ? JSON.parse(historicoSalvo) : [];

      const historicoSemDuplicados = historicoAjustado.filter(item => item.id !== novaBusca.id);
      historicoSemDuplicados.unshift(novaBusca);

      await AsyncStorage.setItem('@tuco_historico', JSON.stringify(historicoSemDuplicados));
    } catch (e) {
      console.log(e);
    }
  };

  const buscarViagem = async () => {
    if (destino === '' || data === '') {
      Alert.alert('Aviso', 'Preencha todos os campos!');
      return;
    }

    setCarregando(true);
    const capital = capitaisBrasil[destino];

    const CHAVE_OPENWEATHER = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
    const CHAVE_GEOAPIFY = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

    const urlClima = `https://api.openweathermap.org/data/2.5/weather?q=${capital},BR&units=metric&lang=pt_br&appid=${CHAVE_OPENWEATHER}`;

    try {
      const respostaClima = await axios.get(urlClima);
      const lat = respostaClima.data.coord.lat;
      const lon = respostaClima.data.coord.lon;

      const urlLocais = `https://api.geoapify.com/v2/places?categories=catering.restaurant,leisure.park,tourism.sights&filter=circle:${lon},${lat},5000&limit=15&apiKey=${CHAVE_GEOAPIFY}`;
      const respostaLocais = await axios.get(urlLocais);
      const locaisArray = respostaLocais.data.features || [];

      const nomesParaPrompt = locaisArray
        .slice(0, 4)
        .map(f => f.properties?.name || '')
        .filter(name => name.length > 0)
        .join(', ');

      const promptVisual = `Vibrant travel poster illustration of ${capital}, Brazil. Featuring architectural elements and scenery inspired by local landmarks: ${nomesParaPrompt}. Cinematic lighting, ultra detailed digital painting style, sunny day, clear sky.`;
      
      const encodedPrompt = encodeURIComponent(promptVisual);
      const seedAleatorio = Math.floor(Math.random() * 10000);
      const urlImagemIA = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&nologo=true&seed=${seedAleatorio}`;

      const dadosFinais = {
        id: Date.now().toString(),
        capital: capital,
        dataViagem: data,
        clima: respostaClima.data,
        locais: locaisArray,
        imagemCapa: urlImagemIA 
      };

      setResultadoAPI(dadosFinais);
      await salvarNoHistorico(dadosFinais);

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao buscar os dados da viagem. Verifique se as chaves estão corretas.');
    } finally {
      setCarregando(false);
    }
  };

  if (resultadoAPI) {
    return (
      <View style={styles.container}>
        <ResultadoViagem dados={resultadoAPI} voltar={() => setResultadoAPI(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Para onde vamos?</Text>
      
      <Text style={styles.label}>Destino (Estado)</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={destino} onValueChange={(itemValue) => setDestino(itemValue)} style={styles.picker}>
          {Object.keys(capitaisBrasil).map((estado, index) => (
            <Picker.Item key={index} label={estado} value={estado} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data da viagem</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.inputData} placeholder="Ex: 15/10/2026" value={data} onChangeText={setData} keyboardType="numeric" maxLength={10} />
        <TouchableOpacity style={styles.botaoCalendario} onPress={() => setMostrarCalendario(true)}>
          <Ionicons name="calendar-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {mostrarCalendario && (
        <DateTimePicker value={dataSelecionada} mode="date" display="default" onChange={mudarData} />
      )}

      <TouchableOpacity style={styles.botao} onPress={buscarViagem} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotao}>Buscar Roteiro</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', margin: 15, borderRadius: 20, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, color: '#666', marginBottom: 5, marginLeft: 5 },
  pickerContainer: { backgroundColor: '#F5F5F5', borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  inputData: { flex: 1, backgroundColor: '#F5F5F5', height: 50, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  botaoCalendario: { backgroundColor: '#2E8B57', height: 50, width: 50, borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' },
  botao: { backgroundColor: '#2E8B57', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});