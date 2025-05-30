import axios from 'axios';
import { API_KEY, BASE_URL } from '../constants/api';

export const getPopularMovies = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR&append_to_response=videos`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};