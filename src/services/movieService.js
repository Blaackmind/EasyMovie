import axios from 'axios';

const API_KEY = 'c2f0f1df6a1b4bf17fe86c4fdbb4c97a'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

export const getPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw error;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await api.get('/movie/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes mais bem avaliados:', error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    throw error;
  }
}; 