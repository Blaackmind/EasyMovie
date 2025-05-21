import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './app/context/AuthContext';
import { FilmesProvider } from './app/context/FilmesContext';
import AppNavigator from './app/navigation/AppNavigator';
import theme from './app/styles/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <FilmesProvider>
          <AppNavigator />
        </FilmesProvider>
      </AuthProvider>
    </PaperProvider>
  );
}