import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StatusBar
} from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import { getMovieDetails } from '../services/movieService';
import { FavoritesContext } from '../context/FavoritesContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.6;

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const data = await getMovieDetails(movieId);
      setMovie(data);
      setLoading(false);
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTintColor: '#fff',
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          color="#fff"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      ),
    });
  }, [navigation]);

  const isFavorite = favorites.some(fav => fav.id === movieId);

  const handleFavoritePress = () => {
    if (isFavorite) {
      removeFavorite(movieId);
    } else {
      addFavorite(movie);
    }
  };

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.posterContainer}>
        <ImageBackground 
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} 
          style={styles.posterBackground}
          blurRadius={1}
        >
          <LinearGradient
            colors={['transparent', '#1a1a1a']}
            style={styles.gradient}
          />
        </ImageBackground>
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} 
          style={styles.poster}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>⭐ {movie.vote_average.toFixed(1)}</Text>
            <Text style={styles.metaLabel}>Avaliação</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{new Date(movie.release_date).getFullYear()}</Text>
            <Text style={styles.metaLabel}>Ano</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{movie.runtime}</Text>
            <Text style={styles.metaLabel}>Minutos</Text>
          </View>
        </View>

        <Button 
          icon={isFavorite ? "heart" : "heart-outline"} 
          mode="contained" 
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
          contentStyle={styles.favoriteButtonContent}
          labelStyle={styles.favoriteButtonLabel}
        >
          {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </Button>

        <View style={styles.genres}>
          {movie.genres.map(genre => (
            <View key={genre.id} style={styles.genreContainer}>
              <Text style={styles.genre}>{genre.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>
      </View>
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
  posterContainer: {
    height: POSTER_HEIGHT,
    width: width,
  },
  posterBackground: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: POSTER_HEIGHT / 2,
  },
  poster: {
    width: width * 0.6,
    height: POSTER_HEIGHT * 0.8,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    borderRadius: 16,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  favoriteButton: {
    marginVertical: 25,
    backgroundColor: '#6200ee',
    borderRadius: 25,
  },
  favoriteButtonContent: {
    height: 50,
  },
  favoriteButtonLabel: {
    fontSize: 16,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  genreContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genre: {
    color: '#fff',
    fontSize: 14,
  },
  overviewContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  overview: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    marginLeft: 10,
  },
});

export default MovieDetailScreen;
