import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  TextInput as RNTextInput
} from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NoAvatar from '../components/NoAvatar.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EditProfileModal from '../components/EditProfileModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.33;
const NUM_COLUMNS = 3;

const KeyboardAwareView = ({ children }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
      {children}
    </View>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const { user, updateUserAvatar, updateUserProfile } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState([]);

  React.useEffect(() => {
    setSelectedMovies(favorites.slice(0, 6));
  }, [favorites]);

  const handleUpdateProfile = async (newBio) => {
    const success = await updateUserProfile({ bio: newBio });
    if (success) {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    }
  };

  const MovieCard = ({ movie }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
        style={styles.card}
      >
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
            </LinearGradient>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => removeFavorite(movie.id)}
            >
              <LinearGradient
                colors={['#6200ee', '#10c44c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.favoriteGradient}
              >
                <MaterialCommunityIcons name="heart" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const AvatarSelector = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Escolha um poster como seu avatar</Text>
          <ScrollView>
            <View style={styles.posterGrid}>
              {selectedMovies.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.posterOption}
                  onPress={async () => {
                    await updateUserAvatar(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
                    setModalVisible(false);
                  }}
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    style={styles.posterOptionImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const UserProfile = () => (
    <View style={styles.profileContainer}>
      <LinearGradient
        colors={['rgba(98, 0, 238, 0.2)', 'rgba(16, 196, 76, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileGradient}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.avatarContainer}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <NoAvatar size={80} iconSize={40} />
              )}
              <LinearGradient
                colors={['#6200ee', '#10c44c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.editAvatarButton}
              >
                <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <View style={styles.statsContainer}>
              <MaterialCommunityIcons name="movie" size={16} color="#10c44c" />
              <Text style={styles.userStats}>{favorites.length} filmes favoritos</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setEditProfileVisible(true)}
            >
              <LinearGradient
                colors={['#6200ee', '#10c44c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.editProfileGradient}
              >
                <MaterialCommunityIcons name="account-edit" size={16} color="#fff" style={styles.editIcon} />
                <Text style={styles.editProfileText}>Editar Perfil</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        {user?.bio && (
          <View style={styles.bioContainer}>
            <MaterialCommunityIcons name="text" size={16} color="#10c44c" />
            <Text style={styles.userBio}>{user.bio}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradientHeader}
      >
        <UserProfile />
      </LinearGradient>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="heart-outline" size={80} color="#666" />
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptyText}>
            Adicione filmes aos favoritos para vê-los aqui
          </Text>
        </View>
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

      <AvatarSelector />
      <EditProfileModal
        isVisible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        onSave={handleUpdateProfile}
        initialBio={user?.bio || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradientHeader: {
    padding: 20,
    paddingTop: 40,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileGradient: {
    borderRadius: 20,
    padding: 2,
    margin: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 18,
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2a2a2a',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userStats: {
    fontSize: 14,
    color: '#10c44c',
    marginLeft: 6,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  editProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editIcon: {
    marginRight: 6,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2a2a2a',
    borderRadius: 18,
    padding: 16,
    marginTop: 2,
  },
  userBio: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    padding: 6,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 2,
    borderRadius: 12,
  },
  imageContainer: {
    aspectRatio: 2/3,
    backgroundColor: '#2a2a2a',
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
    borderRadius: 15,
    overflow: 'hidden',
  },
  favoriteGradient: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  posterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  posterOption: {
    width: '31%',
    aspectRatio: 2/3,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  posterOptionImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  grid: {
    padding: 10,
    paddingBottom: 20,
  },
});

export default FavoritesScreen; 