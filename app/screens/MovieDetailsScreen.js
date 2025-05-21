import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Image, StyleSheet, Share, ActivityIndicator } from 'react-native';
import { Title, Paragraph, Button, Chip, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useFilmes } from '../context/FilmesContext';
import globalStyles from '../styles/globalStyles';

export default function MovieDetailsScreen({ route }) {
  const { id, tipo } = route.params;
  const { colors } = useTheme();
  const { obterDetalhes, favoritos, adicionarFavorito, removerFavorito } = useFilmes();
  
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState(null);

  const ehFavorito = favoritos.some(item => item.id === id);

  const carregarDetalhes = useCallback(async () => {
    try {
      setCarregando(true);
      setError(null);
      const dados = await obterDetalhes(id, tipo);
      setDetalhes(dados);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Não foi possível carregar os detalhes do filme.');
    } finally {
      setCarregando(false);
    }
  }, [id, tipo, obterDetalhes]);

  useEffect(() => {
    carregarDetalhes();
  }, [carregarDetalhes]);

  const toggleFavorito = useCallback(() => {
    if (!detalhes) return;
    
    if (ehFavorito) {
      removerFavorito(id);
    } else {
      adicionarFavorito({
        id: detalhes.id,
        title: detalhes.title || detalhes.name,
        poster_path: detalhes.poster_path,
        media_type: tipo,
      });
    }
  }, [detalhes, ehFavorito, id, tipo, adicionarFavorito, removerFavorito]);

  const compartilhar = useCallback(async () => {
    if (!detalhes) return;
    
    try {
      await Share.share({
        message: `Confira ${detalhes.title || detalhes.name} no EasyMovie!`,
        url: `https://www.themoviedb.org/${tipo}/${id}`,
        title: detalhes.title || detalhes.name,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error.message);
    }
  }, [detalhes, id, tipo]);

  if (carregando) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !detalhes) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Paragraph style={{ color: colors.error, textAlign: 'center' }}>
          {error || 'Nenhum detalhe disponível.'}
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={carregarDetalhes}
          style={{ marginTop: 16 }}
        >
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${detalhes.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
        accessibilityLabel={`Poster de ${detalhes.title || detalhes.name}`}
      />
      
      <View style={styles.content}>
        <Title style={[styles.title, { color: colors.text }]}>
          {detalhes.title || detalhes.name}
        </Title>
        
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={24} color={colors.primary} />
            <Paragraph style={[styles.rating, { color: colors.text }]}>
              {detalhes.vote_average?.toFixed(1)}/10
            </Paragraph>
          </View>

          {detalhes.runtime && (
            <Paragraph style={{ color: colors.text }}>
              {Math.floor(detalhes.runtime / 60)}h {detalhes.runtime % 60}min
            </Paragraph>
          )}
        </View>
        
        <View style={styles.chipContainer}>
          {detalhes.genres?.map(genre => (
            <Chip 
              key={genre.id} 
              style={[styles.chip, { borderColor: colors.primary }]}
              textStyle={{ color: colors.text }}
            >
              {genre.name}
            </Chip>
          ))}
        </View>
        
        <Paragraph style={[styles.overview, { color: colors.text }]}>
          {detalhes.overview || 'Sinopse não disponível.'}
        </Paragraph>
        
        <View style={styles.buttonRow}>
          <Button 
            mode="contained" 
            onPress={toggleFavorito}
            icon={ehFavorito ? "heart" : "heart-outline"}
            style={[styles.button, { 
              backgroundColor: ehFavorito ? colors.primary : 'transparent',
              borderColor: colors.primary,
              borderWidth: ehFavorito ? 0 : 1
            }]}
            labelStyle={{ color: ehFavorito ? '#fff' : colors.primary }}
          >
            {ehFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={compartilhar}
            icon="share-variant"
            style={[styles.button, { borderColor: colors.primary }]}
            labelStyle={{ color: colors.primary }}
          >
            Compartilhar
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  paddingBottom: 20,
  },
  poster: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 8,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flex: 1,
  },
});