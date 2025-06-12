import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro', 'Falha ao carregar dados do usuário', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (name, email, password) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const userExists = users.some(u => u.email === email);
      if (userExists) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado');
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, 
        createdAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('users', JSON.stringify([...users, newUser]));
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        Alert.alert('Erro', 'Credenciais inválidas');
        return false;
      }

      await AsyncStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login');
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  };

  const updateUserAvatar = async (avatarUrl) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData);
      
      // Atualiza o avatar no array de usuários
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, avatarUrl } : u
      );
      
      // Atualiza o usuário atual
      const updatedUser = { ...user, avatarUrl };
      
      // Salva as alterações
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      return false;
    }
  };

  const updateUserProfile = async ({ bio }) => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData);
      
      // Atualiza a bio no array de usuários
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, bio } : u
      );
      
      // Atualiza o usuário atual
      const updatedUser = { ...user, bio };
      
      // Salva as alterações
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      register,
      login,
      logout,
      updateUserAvatar,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};