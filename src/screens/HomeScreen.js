import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getPopularMovies, getTopRatedMovies } from '../services/movieService';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const HomeScreen = ({ navigation }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          color="#fff"
          size={24}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      ),
    });
  }, [navigation]);

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
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => handleFavoritePress(movie)}
            >
              <LinearGradient
                colors={['#6200ee', '#10c44c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.favoriteGradient}
              >
                <MaterialCommunityIcons 
                  name={isFavorite(movie.id) ? "heart" : "heart-outline"} 
                  size={16} 
                  color="#fff" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const MovieSection = ({ title, data }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
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
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>O que vamos assistir hoje?</Text>
        </View>
        
        <MovieSection title="Em Alta" data={popularMovies} />
        <MovieSection title="Mais Bem Avaliados" data={topRatedMovies} />
        <MovieSection title="Seus Favoritos" data={favorites} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieList: {
    paddingVertical: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 15,
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  favoriteGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginRight: 10,
  },
});

export default HomeScreen;