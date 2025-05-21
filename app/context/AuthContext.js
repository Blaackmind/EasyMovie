import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, usuario: action.payload, estaAutenticado: true };
    case 'LOGOUT':
      return { ...state, usuario: null, estaAutenticado: false };
    case 'LOAD_USER':
      return { ...state, usuario: action.payload, estaAutenticado: !!action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    usuario: null,
    estaAutenticado: false,
  });

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo) {
        dispatch({ type: 'LOAD_USER', payload: JSON.parse(usuarioSalvo) });
      }
    };
    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    // Simulação de login - em uma aplicação real, isso seria uma chamada à API
    const usuario = { email, nome: email.split('@')[0] };
    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    dispatch({ type: 'LOGIN', payload: usuario });
  };

  const registrar = async (email, senha, nome) => {
    // Simulação de registro
    const usuario = { email, nome };
    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    dispatch({ type: 'LOGIN', payload: usuario });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('usuario');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);