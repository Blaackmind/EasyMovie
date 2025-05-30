import React, { createContext, useState } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import colors from '../constants/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>
      <PaperProvider theme={currentTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};