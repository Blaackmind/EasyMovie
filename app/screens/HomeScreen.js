import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useFilmes } from '../context/FilmesContext';
import { Searchbar } from 'react-native-paper';
import CartaoFilme from '../components/CartaoFilme';
import LoadingIndicator from '../components/LoadingIndicator';
import globalStyles from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const { filmes, series, resultadosBusca, carregando, buscarConteudo } = useFilmes();
  const [query, setQuery] = useState('');
  const [mostrandoBusca, setMostrandoBusca] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      buscarConteudo(query);
      setMostrandoBusca(true);
    } else {
      setMostrandoBusca(false);
    }
  }, [query]);

  const renderItem = ({ item }) => (
    <CartaoFilme 
      item={item} 
      onPress={() => navigation.navigate('MovieDetails', { id: item.id, tipo: item.media_type || 'filme' })}
    />
  );

  const dadosParaExibir = mostrandoBusca ? resultadosBusca : [...filmes, ...series];

  return (
    <View style={globalStyles.container}>
      <Searchbar
        placeholder="Buscar filmes ou séries..."
        onChangeText={setQuery}
        value={query}
        style={globalStyles.searchBar}
      />
      
      {carregando && <LoadingIndicator />}

      <FlatList
        data={dadosParaExibir}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={globalStyles.listContainer}
      />
    </View>
  );
}