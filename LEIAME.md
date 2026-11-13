# Kit de edição Cobaia

Como usar em outra conta do Claude:
1. Ler constituicao/ (constituicao-completa.md, como-o-criador-cria-videos.md, receita-edicao-roteiro.md, art13-pacote-de-postagem.md).
2. Ler skill/SKILL.md (skill cobaia-dev-videos) e skill/liquid-glass.md.
3. Ler telas/LEIAME.md e telas/CATALOGO.md (biblioteca de telas, fontes, imagens, áudios com audio/CREDITOS.txt).
4. Copiar videos/template para um projeto novo e usar HyperFrames (checagem e render pelos comandos dele).
5. Vídeo das 12h ("roda programa do Windows?", programas nativos do Debian): dia07/roteiro-dia07-final.md e dia07/texto-elevenlabs-dia07-poucas-tags.txt. Gravações reais da tela do notebook precisam ser enviadas à parte.

Não incluído: videos/fonte (1,4 GB de material bruto).

## Recriar o Dia 6
videos/dia06/: roteiro (plano-roteiro-v3.md), contexto, quadros do storyboard (v3-frames), textos e vídeo final leve (referência). videos/dia06/fonte-dia06-v2/ é o projeto HyperFrames (index.html, data.js, áudio, imagens); o assets/ dele se regenera com `node telas/scripts/biblioteca.cjs`. Fluxo: aprovar storyboard estático antes de renderizar.
