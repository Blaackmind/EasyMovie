import React, { useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Image
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FavoritesContext } from '../context/FavoritesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.33;
const NUM_COLUMNS = 3;

const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  const MovieCard = ({ movie }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
        style={styles.card}
      >
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
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => removeFavorite(movie.id)}
          >
            <MaterialCommunityIcons name="heart" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="heart-outline" size={80} color="#666" />
      <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
      <Text style={styles.emptyText}>
        Adicione filmes aos favoritos para vê-los aqui
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seus Favoritos</Text>
        <Text style={styles.headerCount}>{favorites.length} filmes</Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.grid}
          numColumns={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerCount: {
    fontSize: 16,
    color: '#666',
  },
  grid: {
    padding: 10,
    paddingBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    padding: 5,
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
    position: 'relative',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
