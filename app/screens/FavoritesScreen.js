import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useFilmes } from '../context/FilmesContext';
import CartaoFilme from '../components/CartaoFilme';

export default function FavoritesScreen() {
  const { favoritos } = useFilmes();

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartaoFilme filme={item} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    padding: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
});