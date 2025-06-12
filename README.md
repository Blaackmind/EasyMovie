# EasyMovie

Um aplicativo React Native para descobrir e gerenciar seus filmes favoritos.

## Funcionalidades

- Explorar filmes populares e bem avaliados
- Pesquisar filmes
- Ver detalhes dos filmes (sinopse, elenco, avaliações, etc.)
- Salvar filmes favoritos
- Perfil personalizado com avatar e bio
- Recomendações baseadas nos seus filmes favoritos

## Pré-requisitos

- Node.js >= 12
- npm ou yarn
- Expo CLI
- Uma chave de API do TMDB (The Movie Database)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/EasyMovie.git
cd EasyMovie
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure a chave da API:
- Renomeie o arquivo `src/constants/api.js` e adicione sua chave API do TMDB:
```javascript
export const API_KEY = 'SUA_CHAVE_API_AQUI';
```

4. Inicie o projeto:
```bash
expo start
```

## Tecnologias utilizadas

- React Native
- Expo
- React Navigation
- React Native Paper
- AsyncStorage
- Axios
- TMDB API

## Estrutura do projeto

```
src/
  ├── assets/         # Imagens e recursos
  ├── components/     # Componentes reutilizáveis
  ├── constants/      # Constantes e configurações
  ├── context/        # Contextos do React
  ├── screens/        # Telas do aplicativo
  └── services/       # Serviços e chamadas de API
```

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 
Desenvolvido por Amanda Kelory, Felipe Martins e Ana Panullo
