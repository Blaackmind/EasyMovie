import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const storageKey = user ? `favorites_${user.id}` : null;
  
  useEffect(() => {
    const loadFavorites = async () => {
      if (!storageKey) {
        setFavorites([]);
        return;
      }
      try {
        const storedFavorites = await AsyncStorage.getItem(storageKey);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]); 
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites([]); 
      }
    };

    loadFavorites();
  }, [user, storageKey]);

  const saveFavorites = async (newFavorites) => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addFavorite = (movie) => {

    if (favorites.some(fav => fav.id === movie.id)) {
      return; 
    }
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFavorite = (movieId) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};