import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { FilmesProvider } from './context/FilmesContext';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFilmes } from './context/FilmesContext';
import CartaoFilme from './components/CartaoFilme';
import SearchBar from './components/SearchBar';
import LoadingIndicator from './components/LoadingIndicator';

function ErrorScreen({ error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Erro: {error.message}</Text>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FilmesProvider>
        {/* Sua navegação principal aqui */}
      </FilmesProvider>
    </AuthProvider>
  );
}

export  function HomeScreen() {
  const navigation = useNavigation();
  const { filmes, carregando, error, pesquisarFilmes } = useFilmes();

  const verDetalhes = (filme) => {
    navigation.navigate('MovieDetails', { id: filme.id });
  };

  const verFavoritos = () => {
    navigation.navigate('Favorites');
  };

  if (carregando) return <LoadingIndicator />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>EasyMovie</Text>
        <MaterialIcons 
          name="favorite" 
          size={28} 
          color="#FF3A44" 
          onPress={verFavoritos}
          style={styles.favoriteIcon}
        />
      </View>

      <SearchBar onSearch={pesquisarFilmes} />

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartaoFilme 
            filme={item} 
            onPress={() => verDetalhes(item)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.listColumnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  favoriteIcon: {
    padding: 8,
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1E',
  },
  errorText: {
    color: '#FF3A44',
    fontSize: 18,
  },
});