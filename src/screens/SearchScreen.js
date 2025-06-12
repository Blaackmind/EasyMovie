import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { searchMovies } from '../services/movieService';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const MovieCard = ({ movie }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={['rgba(98, 0, 238, 0.2)', 'rgba(16, 196, 76, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            {movie.poster_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImage}>
                <MaterialCommunityIcons name="movie-outline" size={40} color="#fff" />
                <Text style={styles.noImageText}>Sem imagem</Text>
              </View>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.titleGradient}
            >
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(98, 0, 238, 0.2)', 'rgba(16, 196, 76, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.searchGradient}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar filmes..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#6200ee"
            placeholderTextColor="#999"
            theme={{
              colors: {
                text: '#fff',
                primary: '#6200ee',
              }
            }}
          />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="movie-search" size={80} color="#666" />
          <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
          <Text style={styles.emptySubtext}>
            Tente buscar com outras palavras-chave
          </Text>
        </View>
      ) : (
        <View style={styles.initialContainer}>
          <MaterialCommunityIcons name="movie-search" size={80} color="#666" />
          <Text style={styles.initialText}>Busque por seus filmes favoritos</Text>
          <Text style={styles.initialSubtext}>
            Digite o nome do filme que deseja encontrar
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchGradient: {
    margin: 16,
    borderRadius: 20,
    padding: 2,
  },
  searchContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 18,
    padding: 12,
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    margin: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  cardGradient: {
    padding: 2,
    borderRadius: 12,
  },
  imageContainer: {
    aspectRatio: 2/3,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  titleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
  },
  noImageText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  initialSubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SearchScreen;
