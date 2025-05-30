import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { Card, Text, Button, Title, Paragraph } from 'react-native-paper';
import { getPopularMovies, getTopRatedMovies } from '../services/movieService';
import { FavoritesContext } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.33;

const HomeScreen = ({ navigation }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies()
        ]);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const handleFavoritePress = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
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

  const MovieSection = ({ title, data }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieList}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <MovieSection title="Populares da semana" data={popularMovies} />
      <MovieSection title="Melhores filmes IMDB" data={topRatedMovies} />
      <MovieSection title="Seus Favoritos" data={favorites} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  movieList: {
    paddingVertical: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 10,
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
});

export default HomeScreen;