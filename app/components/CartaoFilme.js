import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartaoFilme({ item, onPress }) {
  const { colors } = useTheme();
  const imagemUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={{ uri: imagemUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.overlay}>
          <MaterialIcons 
            name="star" 
            size={16} 
            color={colors.primary} 
            style={styles.ratingIcon}
          />
          <Title style={styles.rating}>{item.vote_average?.toFixed(1)}</Title>
        </View>
        
        <View style={styles.titleContainer}>
          <Title numberOfLines={1} style={styles.title}>
            {item.title || item.name}
          </Title>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 2/3,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingIcon: {
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: 'white',
    lineHeight: 16,
  },
  titleContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
  },
});