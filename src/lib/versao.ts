/**
 * Selo de versao das imagens.
 *
 * O navegador guarda imagem pela URL. Como os caminhos nao mudam entre
 * publicacoes, uma arte trocada continuava aparecendo antiga mesmo com o
 * arquivo novo no servidor — foi o que aconteceu varias vezes hoje.
 * Anexar este selo faz cada versao ter endereco proprio.
 *
 * Derivado do conteudo dos arquivos: so muda quando a imagem muda.
 */
export const V = "v9299de2c";
