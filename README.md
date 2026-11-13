# Kit de edição Cobaia (@cobaia.dev)

Tudo o que é preciso para produzir um vídeo curto do canal em outra conta do Claude: regras, skill, biblioteca de peças, template de projeto e um caso real que viralizou (Dia 6, notebook velho, ~373 mil views no Instagram).

## 1. Ordem de leitura (obrigatória)
1. `constituicao/constituicao-completa.md`: as regras do canal (esqueleto do vídeo, limites de ritmo, identidade, áudio, produção, portões de aprovação). A versão curta é `constituicao-enxuta.md`.
2. `constituicao/como-o-criador-cria-videos.md`: como o criador pesquisa, escreve, edita e se posiciona.
3. `constituicao/receita-edicao-roteiro.md`: receita de roteiro e edição tirada dos números dos Dias 1 a 6.
4. `constituicao/art13-pacote-de-postagem.md`: o que sai junto com o vídeo aprovado (horários, legendas, stories).
5. `skill/SKILL.md` (skill cobaia-dev-videos) e `skill/liquid-glass.md` (estilo de todo card e modal).
6. `telas/LEIAME.md` e `telas/CATALOGO.md`: a biblioteca de peças.
7. `estrategia/analise-dia1-6-e-proximos-temas.md` e `referencias/banco-ganchos-virais.md`.

Ordem de prioridade em caso de conflito: o que o criador disser na conversa, depois a constituição, depois a skill, depois qualquer arquivo solto.

## 2. O que tem em cada pasta e como usar
| Pasta | O que é | Como usar |
|---|---|---|
| `constituicao/` | Regras e método | Ler antes de qualquer roteiro. Atualizar `como-o-criador-cria-videos.md` a cada aprovação. |
| `skill/` | Skill `cobaia-dev-videos` (SKILL.md), regras do Liquid Glass, lições e padrões de vídeos anteriores, código base | Seguir o passo a passo da SKILL.md. Mudanças na skill saem como diff de poucas linhas. |
| `telas/` | Biblioteca viva: telas de apps (HTML), cenas 3D, kit de identidade (`kit/`), fontes, imagens/logos, áudio (`audio/musica`, `audio/sfx`, `audio/CREDITOS.txt`), scripts | Reaproveitar tudo que servir; adaptar palavra, dia e cor, nunca refazer. Só entra peça de vídeo aprovado. |
| `videos/template/` | Projeto HyperFrames de partida | Copiar para um projeto novo (passo 3 abaixo). Nunca partir de código novo. |
| `videos/estilo/` | Referências de estilo visual | Consultar antes do storyboard. |
| `exemplo-dia06/` | Roteiro do vídeo que viralizou | Modelo de formato. Ver seção 5. |
| `estrategia/` | Análise de desempenho dos Dias 1 a 6 e temas seguintes | Escolher tema a partir do que o público pediu. |
| `referencias/` | Banco de ganchos virais com views confirmadas | Todo gancho vem daqui. |

### Caminhos
Os documentos citam `/mnt/project-files/...`. Em outra máquina, trate a raiz deste repositório como `/mnt/project-files/`: `telas/` fica em `<repo>/telas`, `videos/template` em `<repo>/videos/template`. Ajuste o caminho dentro de `telas/scripts/biblioteca.cjs` se necessário.

## 3. Como produzir um vídeo (passo a passo)
1. Escolher o tema pelo que o público mais pediu (analise-dia1-6) e pesquisar canais grandes de fora que viralizaram com o assunto; escolher o gancho no banco de ganchos.
2. Escrever o roteiro com até 165 palavras, um único exemplo do cotidiano, ordem fixa: gancho, vinheta "Dia X de 30" até 5 s, miolo prático, chamada final "segue o Cobaia, curte e comenta [PALAVRA]". Conferir cada frase contra números reais medidos. Passar pelo Humanizer.
3. Aprovação 1: roteiro. Aprovação 2: elementos novos (telas, objetos) mostrados soltos.
4. `cp -r videos/template videos/fonte/diaNN` e, dentro dela, `node telas/scripts/biblioteca.cjs` (cria `assets/` com kit, telas, imagens, fontes, áudio e scripts).
5. Voz: gravada pelo criador (`assets/scripts/transcribe.py` + corte de silêncios) ou ElevenLabs (`align.py` + `cut.py`). Resultado: `audio/voz_editada.wav` e `audio/palavras.json`. A voz nunca é cortada no meio de palavra nem ganha pausas inseridas; ajusta-se o tempo acelerando ou desacelerando trechos inteiros (máximo 5%).
6. `python3 assets/scripts/gerar-data.py` gera `data.js`; ajustar `data-duration` do `#root`. Escrever as estações no `index.html` usando as peças do kit (`KIT.*`, `KIT.tela`).
7. Aprovação 3: storyboard estático (`npx --yes hyperframes@0.9.23 snapshot --no-end --at ...` e `assets/scripts/folha.py`). Nada de render de teste.
8. Depois de aprovado: `npx --yes hyperframes@0.9.23 check --json` (zero erros) e `npx --yes hyperframes@0.9.23 render -q delivery -w 4 -o render/video.mp4`. Mix com `assets/scripts/mix.py .` e encode com `assets/scripts/encode.sh`.
9. Aprovação 4: render. Para correções, renderizar só as cenas alteradas e remontar.
10. Pós-aprovação: dossiê de postagem, página do guia no site, peças novas voltam para `telas/` com uma linha no CATALOGO.

Abra as telas por http (`python3 -m http.server`); WebGL e texturas não carregam via `file://`.

## 4. Regras que mais pesam
- Posicionamento: o criador tem a ideia, decide e conduz; o Claude é a ferramenta. Nunca "apertei um botão e o Claude fez".
- Canal dark: o nome do criador nunca aparece. Laranja só no ícone do Claude. Pouco 3D; sem personagem 3D realista.
- Linguagem segura: sem duplo sentido, sem palavra violenta ("apaga", não "mata"), fala no singular.
- Todo número é real e medido. Cada afirmação vale para o aparelho mostrado.
- 12 cenas, 4 s mínimo cada, 1 tela nova por cena, ~60 s, trilha do começo ao fim, música diferente dos vídeos anteriores.

## 5. Como instruir o Claude com este kit (o método do vídeo viral)
O Dia 6 (notebook velho, ~373 mil views no Instagram, 277 mil de alcance, envios 3,1% e salvos 5,6% do alcance, contra 3 a 5 mil views dos Dias 1 a 5) foi feito assim. O criador conduz, o Claude executa:
1. Conversa de pauta: o criador traz a ideia e o dado (o que o público pediu, `estrategia/`). O Claude pesquisa canais de fora, escolhe o gancho no banco e propõe o plano. Instrução típica: "Leia a constituição, a skill e o banco de ganchos. Proponha o plano do vídeo sobre X, com gancho do banco e um único exemplo do dia a dia."
2. Roteiro em rodadas: o criador comenta, o Claude ajusta, até 165 palavras. Exemplo real do formato final: `exemplo-dia06/roteiro-dia06.md` (25 cenas curtas, uma ideia por cena: gancho com dor e número, vinheta Dia 6 de 30, conflito, virada conduzida pelo criador, prova em lista de números medidos, pergunta de envio, chamada final com a palavra NOTEBOOK).
3. Elementos primeiro: telas e objetos novos mostrados soltos, fiéis a fotos reais, para aprovar antes de montar cena.
4. Storyboard estático (imagens de início, meio e fim de cada bloco), sem render de teste. Instrução típica: "Monte o projeto a partir de videos/template e telas/, gere o storyboard estático e mostre os quadros."
5. Voz: o criador grava (ou ElevenLabs); o Claude alinha e encaixa no tempo acelerando ou desacelerando trechos inteiros, nunca cortando palavra.
6. Render só depois da aprovação, correções só nas cenas alteradas.
7. Postagem: dossiê de horários e legendas, comentário fixado e palavra-chave.

Por que funcionou: a retenção era igual à dos outros vídeos; o que mudou foi o que as pessoas fizeram. Objeto físico que a pessoa tem em casa, dor de dinheiro/lixo, número real que dói e uma frase que dá vontade de mandar a alguém. Números da legenda que não se sustentam geram comentário de "fake": só números medidos. Os dados e a receita estão em `estrategia/analise-dia1-6-e-proximos-temas.md` e `constituicao/receita-edicao-roteiro.md`.

## 6. Tutorial rápido para a outra conta
1. Clonar o repositório e abrir o Claude Code na pasta.
2. Primeiro pedido: "Leia README.md, constituicao/, skill/SKILL.md e telas/LEIAME.md. Resuma as regras e espere meu tema."
3. Dar o tema, a voz (gravada ou texto para ElevenLabs) e as fotos reais do objeto. Aprovar roteiro, elementos, storyboard e render, nesta ordem.

## 7. O que não está aqui
Só ferramentas. Ficam de fora vídeos prontos, renders, voz, fotos, material bruto, comentários e roteiros de outros dias.
