import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getFilmesPopulares, 
  getSeriesPopulares, 
  buscarFilmes, 
  getDetalhesFilme 
} from '../services/tmdb';

const FilmesContext = createContext();

const initialState = {
  filmes: [],
  series: [],
  favoritos: [],
  resultadosBusca: [],
  carregando: false,
  erro: null,
  pagina: 1,
  totalPaginas: 1
};

const filmesReducer = (state, action) => {
  switch (action.type) {
    case 'CARREGAR_FILMES_INICIADO':
      return { ...state, carregando: true, erro: null };
    case 'CARREGAR_FILMES_SUCESSO':
      return { 
        ...state, 
        filmes: action.payload.results,
        pagina: action.payload.page,
        totalPaginas: action.payload.total_pages,
        carregando: false 
      };
    case 'CARREGAR_SERIES_SUCESSO':
      return { 
        ...state, 
        series: action.payload.results,
        carregando: false 
      };
    case 'BUSCAR_FILMES_SUCESSO':
      return { 
        ...state, 
        resultadosBusca: action.payload.results,
        pagina: action.payload.page,
        totalPaginas: action.payload.total_pages,
        carregando: false 
      };
    case 'CARREGAR_MAIS_FILMES':
      return {
        ...state,
        filmes: [...state.filmes, ...action.payload.results],
        pagina: action.payload.page,
        carregando: false
      };
    case 'ADICIONAR_FAVORITO':
      return { ...state, favoritos: [...state.favoritos, action.payload] };
    case 'REMOVER_FAVORITO':
      return { ...state, favoritos: state.favoritos.filter(item => item.id !== action.payload) };
    case 'CARREGAR_FAVORITOS':
      return { ...state, favoritos: action.payload };
    case 'ERRO':
      return { ...state, carregando: false, erro: action.payload };
    default:
      return state;
  }
};

export const FilmesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filmesReducer, initialState);

  useEffect(() => {
    carregarFavoritos();
    carregarConteudoInicial();
  }, []);

  const carregarConteudoInicial = async () => {
    try {
      dispatch({ type: 'CARREGAR_FILMES_INICIADO' });
      const filmes = await getFilmesPopulares(state.pagina);
      const series = await getSeriesPopulares();
      dispatch({ type: 'CARREGAR_FILMES_SUCESSO', payload: filmes });
      dispatch({ type: 'CARREGAR_SERIES_SUCESSO', payload: series });
    } catch (erro) {
      dispatch({ type: 'ERRO', payload: erro.message });
    }
  };

  const buscarConteudo = async (query, pagina = 1) => {
    try {
      dispatch({ type: 'CARREGAR_FILMES_INICIADO' });
      const resultados = await buscarFilmes(query, pagina);
      
      if (pagina === 1) {
        dispatch({ type: 'BUSCAR_FILMES_SUCESSO', payload: resultados });
      } else {
        dispatch({ type: 'CARREGAR_MAIS_FILMES', payload: resultados });
      }
    } catch (erro) {
      dispatch({ type: 'ERRO', payload: erro.message });
    }
  };

  const carregarMaisFilmes = async () => {
    if (state.pagina < state.totalPaginas && !state.carregando) {
      await buscarConteudo('', state.pagina + 1);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const favoritosSalvos = await AsyncStorage.getItem('favoritos');
      if (favoritosSalvos) {
        dispatch({ type: 'CARREGAR_FAVORITOS', payload: JSON.parse(favoritosSalvos) });
      }
    } catch (erro) {
      console.error('Erro ao carregar favoritos:', erro);
    }
  };

  const adicionarFavorito = async (item) => {
    try {
      const novosFavoritos = [...state.favoritos, item];
      await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
      dispatch({ type: 'ADICIONAR_FAVORITO', payload: item });
    } catch (erro) {
      console.error('Erro ao adicionar favorito:', erro);
    }
  };

  const removerFavorito = async (id) => {
    try {
      const novosFavoritos = state.favoritos.filter(item => item.id !== id);
      await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
      dispatch({ type: 'REMOVER_FAVORITO', payload: id });
    } catch (erro) {
      console.error('Erro ao remover favorito:', erro);
    }
  };

  const obterDetalhes = async (id, tipo = 'movie') => {
    try {
      dispatch({ type: 'CARREGAR_FILMES_INICIADO' });
      const detalhes = await getDetalhesFilme(id, tipo);
      return detalhes;
    } catch (erro) {
      dispatch({ type: 'ERRO', payload: erro.message });
      return null;
    }
  };

  return (
    <FilmesContext.Provider
      value={{
        ...state,
        buscarConteudo,
        carregarMaisFilmes,
        adicionarFavorito,
        removerFavorito,
        obterDetalhes,
      }}
    >
      {children}
    </FilmesContext.Provider>
  );
};

export const useFilmes = () => {
  const context = useContext(FilmesContext);
  if (!context) {
    throw new Error('useFilmes deve ser usado dentro de um FilmesProvider');
  }
  return context;
};