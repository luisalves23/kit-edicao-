# Biblioteca do @cobaia.dev

Tudo o que se repete entre os vídeos mora aqui: kit de identidade dos 30 dias, telas de apps, 3D, logos, fontes, áudio e scripts.
O índice completo, com o que cada peça faz, está em **CATALOGO.md**; as miniaturas, em **catalogo.jpg**.

## Como usar num vídeo
1. Copie `videos/template/` para `videos/fonte/diaNN/`.
2. Dentro da pasta: `node /mnt/project-files/telas/scripts/biblioteca.cjs` (copia a biblioteca para `assets/`; rode de novo se a biblioteca mudar).
3. Escreva só o miolo das estações no `index.html`, chamando as peças do kit (`KIT.*`) e as telas (`KIT.tela`).

## Pastas
| Pasta | Conteúdo |
|---|---|
| `kit/` | identidade dos 30 dias: `kit.css`, `kit.js`, Liquid Glass (`liquid-glass.css/js`) |
| `*.html` | telas de apps em tamanho nativo (`<style data-tela>` + markup entre `<!--tela-->`; `[data-slot]` para trocar texto) |
| `*-3d.html`, `js/g3d.js` | cenas 3D (three.js r160) |
| `img/` | logos oficiais, ícone do Claude, avatar do perfil, fotos |
| `fonts/`, `fonts.css` | fontes locais (OFL) |
| `audio/` | músicas, efeitos e créditos |
| `scripts/` | ligação com a biblioteca, voz, legendas, mix, encode, folha de contato |
| `dev/` | páginas de teste e o gerador das fotos do pão |

Abra as telas por http (`python3 -m http.server`), porque WebGL e texturas não carregam via `file://`.

## Regra de manutenção
Peça nova que dá pra reaproveitar volta para cá no fim do vídeo: arquivo, uma linha no CATALOGO.md e a miniatura no catalogo.jpg. Nada de copiar CSS do kit para dentro do vídeo: se o padrão mudou, mude no kit.
