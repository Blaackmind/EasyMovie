import axios from 'axios';

const API_KEY = 'c2f0f1df6a1b4bf17fe86c4fdbb4c97a';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
});

export const getFilmesPopulares = async (pagina = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page: pagina }
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar filmes populares: ' + error.message);
  }
};

export const getSeriesPopulares = async (pagina = 1) => {
  try {
    const response = await api.get('/tv/popular', {
      params: { page: pagina }
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar séries populares: ' + error.message);
  }
};

export const buscarFilmes = async (query, pagina = 1) => {
  try {
    const response = await api.get('/search/multi', {
      params: {
        query: query,
        page: pagina
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar filmes: ' + error.message);
  }
};

export const getDetalhesFilme = async (id, tipo = 'movie') => {
  try {
    const response = await api.get(`/${tipo}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar detalhes: ' + error.message);
  }
};