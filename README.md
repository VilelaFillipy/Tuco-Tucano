# 🦜 Tuco Tucano - Planejador de Viagens

Um aplicativo mobile intuitivo e inteligente para planejamento de viagens. O Tuco Tucano ajuda você a descobrir o clima, encontrar hotéis, restaurantes, parques e pontos turísticos, além de contar com uma Inteligência Artificial integrada para tirar dúvidas e gerar ilustrações exclusivas do seu destino.

## ✨ Funcionalidades

* **Planejamento Rápido:** Escolha o estado brasileiro e a data, e o app retorna um roteiro completo da capital correspondente.
* **Clima em Tempo Real:** Integração com a API OpenWeatherMap para prever a temperatura e condição climática do destino.
* **Sugestões Locais:** Listagem de hotéis, restaurantes, pontos turísticos e parques num raio de 5km (via Geoapify).
* **Geração de Posters por IA:** Criação automática de uma ilustração baseada nos pontos turísticos encontrados no seu roteiro (via Pollinations AI).
* **Tuco IA (Consultor):** Um chat integrado com o Gemini para responder perguntas sobre viagens em linguagem natural.
* **Histórico Offline:** Salvamento automático das consultas no armazenamento interno do dispositivo para acesso sem internet, com opção de gerenciamento e exclusão.

## 🛠️ Tecnologias Utilizadas

* **[React Native](https://reactnative.dev/):** Framework para o desenvolvimento da interface mobile.
* **[Expo](https://expo.dev/):** Plataforma e ecossistema para facilitar a construção e o teste do app.
* **[Axios](https://axios-http.com/):** Cliente HTTP para consumo das APIs externas.
* **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/):** Armazenamento de dados locais (Histórico).
* **APIs Externas:**
  * OpenWeatherMap API (Clima)
  * Geoapify API (Geolocalização e Locais)
  * Google Gemini API (Chat de Inteligência Artificial)
  * Pollinations AI (Geração de Imagens)
