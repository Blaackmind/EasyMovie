import { useFilmes } from '../context/FilmesContext';

// Este hook agora é apenas um wrapper opcional para o contexto
// Pode ser removido se preferir usar o contexto diretamente
export const useMovies = () => {
  const context = useFilmes();
  
  if (!context) {
    throw new Error('useMovies deve ser usado dentro de um FilmesProvider');
  }

  return {
    filmes: context.filmes,
    series: context.series,
    favoritos: context.favoritos,
    carregando: context.carregando,
    error: context.erro,
    pesquisarFilmes: context.buscarConteudo,
    adicionarFavorito: context.adicionarFavorito,
    removerFavorito: context.removerFavorito,
    obterDetalhes: context.obterDetalhes
  };
};