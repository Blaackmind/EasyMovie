import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { searchMovies } from '../services/movieService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.33;
const NUM_COLUMNS = 3;

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchMovies(query);
    setResults(data);
    setLoading(false);
  };

  const MovieCard = ({ movie }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <View style={styles.image}>
            {movie.poster_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar filmes..."
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
        iconColor="#fff"
        inputStyle={{ color: '#fff' }}
        placeholderTextColor="#666"
        theme={{ colors: { surface: '#2a2a2a' } }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.grid}
          numColumns={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {query.trim() ? "Nenhum resultado encontrado" : "Faça uma busca para ver os resultados"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    elevation: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 2/3,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  noImageText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;
