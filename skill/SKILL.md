---
name: "cobaia-dev-videos"
description: "Roteiros, cenas e vídeos curtos do @cobaia.dev (série 30 dias, 30 experimentos com Claude) com a identidade visual, animações, áudio e processo aprovados pelo criador."
---

# @cobaia.dev: vídeos curtos

Esta skill guarda tudo que o criador aprovou nos vídeos do @cobaia.dev: identidade, animações, áudio, roteiro, chamada final e o processo técnico. Leia inteira antes de produzir qualquer roteiro, cena ou vídeo do canal.

Prioridade: o que o criador pedir na conversa vence o que está aqui. Logo em seguida, registre a mudança nesta skill (seção 13).

Meta permanente: **cada vídeo precisa superar o anterior**, sem quebrar nenhuma regra desta skill.

## 0. Biblioteca primeiro (regra que vale para todas as seções)

Tudo o que se repete entre os vídeos mora na biblioteca `/mnt/project-files/telas/`: kit de identidade dos 30 dias, telas de apps, 3D, logos, fontes, músicas, efeitos e scripts. Índice em `telas/CATALOGO.md`, miniaturas em `telas/catalogo.jpg`.

1. **Antes de criar qualquer tela, peça ou som, procure no catálogo.** Se existe, use a peça da biblioteca. Não reescreva nem copie o CSS dela para dentro do vídeo.
2. **Todo vídeo parte do modelo** `videos/template/` (HyperFrames, já ligado ao kit). Nunca de código novo e nunca copiando o vídeo do dia anterior.
3. **O storyboard indica, cena por cena, a peça da biblioteca usada** ou "nova".
4. **Peça nova e reaproveitável volta para a biblioteca no fim do vídeo:** arquivo, uma linha no CATALOGO.md e a miniatura no catalogo.jpg.
5. **Mudou a identidade da série?** Mude no kit (`telas/kit/`), nunca dentro de um vídeo.

## 1. O canal

- Perfil **@cobaia.dev**, lema "testo antes de você". Redes: Instagram Reels, TikTok e YouTube Shorts.
- **Propósito: ensinar o Claude.** Palavras do criador: "na maior parte das vezes eu quero ensinar Claude para as pessoas". Cada vídeo explica um recurso (skills, conectores, MCP, Cowork, Claude Desktop, projetos, memória...) ou um conceito que parece difícil (tokens, janela de contexto, alucinação), de forma dinâmica e lúdica, com um exemplo da vida real. De vez em quando entra uma demonstração impressionante. Ferramentas de fora só aparecem quando ajudam a explicar o Claude.
- **O o criador também aprende com os vídeos.** A pessoa sai sabendo o que é, como funciona por dentro e como usar.
- **Exemplo da vida real (a régua do criador):** o pão de queijo. Duas clientes querem o último pão de queijo; se as duas "compram" ao mesmo tempo, o estoque fica em −1, e por isso o banco de dados precisa de controle. Todo conceito ganha uma analogia assim: do dia a dia, visual, brasileira e fácil de lembrar.
- Série atual: **"30 dias, 30 experimentos com Claude"**. Ensina sem cara de aula: nada de "curso chato" nem "30 aulas". O plano dos 30 dias fica no Doc da série "30 dias de Claude".
- Formato: o Claude faz o vídeo inteiro (motion, legendas, música e efeitos). Toda tela do Claude é **simulada**, nunca gravação de tela.
- **Voz: dois caminhos, o criador escolhe por vídeo.** Todo roteiro sai pronto para os dois: o texto para ele gravar e o texto para a IA de voz (ElevenLabs). Pergunte qual vai usar quando o roteiro for aprovado.
- Mascote: rato de laboratório branco **de brinquedo**, com cara de impresso em 3D (4 cores de filamento), estilo miniatura de desenho animado antigo. O avatar do perfil é esse rato.
- Nunca revelar que algum cenário foi gerado por IA.
- Inspiração de ritmo: canal Sanji Chien (cortes ~3,7 s, ~190 palavras/min, zero silêncio vazio). Inspiração, nunca cópia.

## 2. Regras invioláveis

1. **Nada sobrepõe nada.** Palavras do criador: "Não coloque elementos para sobrescrever elementos." Nenhum elemento fica em cima de outro, do cabeçalho ou da legenda, nem confete ou partículas sobre texto. Única exceção: uma transição breve.
2. **Nunca inventar exemplos.** Mostre o que existe de verdade: o arquivo real, o print real, a música realmente usada. Se precisar de um exemplo, baixe o real.
3. **Só música e efeitos gratuitos com licença**, da biblioteca (`telas/audio/`) ou baixados novos quando o vídeo pedir. Onde achar: Mixkit direto por `https://assets.mixkit.co/music/<ID>/<ID>.mp3` (as páginas do mixkit.co não abrem daqui; meça BPM e volume com `scripts/medir-musica.py`) e efeitos próprios em `scripts/sintetizar-sfx2.py`. Pixabay bloqueia download automático. Nunca uma trilha "padrão de IA". Todo arquivo novo entra em `telas/audio/CREDITOS.txt` com id, URL e o mapa de seções.
4. Sem marcas registradas em prompts de imagem (ex.: LEGO vira "blocos de montar"), sem Star Wars e sem plágio.
5. **Ícone do Claude:**
   - Aparece só quando "Claude" é falado (ou "ele", referindo-se ao Claude). No resto do tempo fica oculto ou num canto, sem cobrir nada.
   - Use o ícone oficial do app (`img/claude-icon.jpg`), nunca um genérico. Para outras ferramentas, a logo oficial delas (`img/`).
   - Em "foi o Claude", ele entra forte. No carimbo "ESCRITO PELO CLAUDE", ele **tomba**.
6. **Só os elementos que estão sendo falados naquele momento.** Muita informação no frame faz a pessoa rolar a tela.
7. **Nenhuma tela parada.** Cenas ligadas por transições de câmera com rastro, da esquerda para a direita. Nunca mais de ~1 s sem movimento relevante, e nenhuma tela quase igual por mais de ~2,5 s (no Dia 5 o chat ficou 4 a 5 s parado).
8. **Respeitar a área útil** das plataformas (seção 4).
9. **Aprovação antes de renderizar:** roteiro aprovado e storyboard estático (imagens) aprovado. Nunca amostra animada nem teste de animação. **Sem aprovação, não renderiza.** A única exceção é quando o criador avisa antes que vai estar ausente e quer receber pronto.
10. **Estratégia é segredo da casa.** Palavras do criador: "A gente usa, mas a gente não revela." Nunca explique na fala, na tela ou nas legendas do post as táticas do canal: a barra dinâmica, a curva de retenção, a fórmula dos ganchos e loops, a chuva de dopamina.
11. **Nada de código ou arquivo interno legível na tela.** Código, o texto da skill, o changelog e prompts grandes aparecem só como representação abstrata (retângulos em forma de palavra, blocos coloridos, rolagem rápida). Números reais podem aparecer.
12. **Canal dark.** Nunca mostrar o nome, a profissão ou qualquer dado do criador: nada de nome na saudação da tela simulada, foto dele ou e-mail real. Saudações sem nome e avatares com letra genérica. Vale até ele pedir o contrário.
13. **Vídeo em loop.** O último frame emenda no primeiro (`KIT.loop`).
14. **Laranja é do Claude.** O laranja (`--or`) só aparece no ícone do Claude e no brilho dele. Nenhuma cena pode ser dominada por laranja, roxo, amarelo ou azul: o vídeo é preto, off-white e vermelho, e cores de terceiros ficam dentro das telas simuladas.

## 3. Identidade visual

Está toda no kit (`telas/kit/kit.css` e `kit.js`). Esta seção descreve o que o kit faz. Para mudar, mude o kit.

| Token | Cor | Uso |
|---|---|---|
| `--bk` | `#0C0C0C` | fundo |
| `--ow` | `#F2EEE6` | off-white, texto |
| `--rd` | `#FF2D2D` | vermelho da marca, destaque |
| `--or` | `#D97757` | laranja do Claude, só no ícone e no brilho dele |
| `--gr` | `#22C55E` | só em "grátis" e dinheiro |

- **Fundo de todo frame** (`KIT.montar`): gradiente radial escuro, grade de pontos rolando devagar, 2 blobs desfocados (vermelho .20, off-white .07), vinheta e grão muito leve (.03; chiado forte parece vídeo sem definição).
- **Tipografia** (`fonts.css`, OFL), variando entre cenas porque o criador não quer tipografia engessada: Anton (impacto, selo, carimbos), Inter 500 a 900 (textos, legendas, cartões), JetBrains Mono (UI, arquivos, handle, contadores), Instrument Serif itálico (emoção e pergunta: "foi o", "amanhã..."), Permanent Marker (anotação à mão), Press Start 2P (jogo). Palavra-chave em vermelho, o resto em off-white.
- **Liquid Glass** em todo cartão, modal, caixa, player, campo e bolha (`kit/liquid-glass.css/js`, aprovado em 09/11/2026, referência: a barra do topo do site):
  - Miolo só desfocado (3,5 px; 6 px em barras baixas). O fundo não aumenta.
  - Borda fina (22% do menor lado, 6 a 22 px) funcionando como lupa: o conteúdo de trás aparece espelhado e nítido. Lente gerada no tamanho e raio de cada cartão.
  - Reflexo em diagonal, brilho fino em cima e embaixo, varredura de luz ao entrar (`KIT.vidro`, animada pela timeline).
  - Preenchimento quase transparente, nunca cinza fosco. Sempre com conteúdo atrás e com movimento, senão a lente não aparece.
  - Nunca `backdrop-filter` no pai do vidro.
  - Telas claras grandes (chat, editor) também ganham vidro em volta ou por cima de uma peça falada; no Dia 5 elas entraram sem vidro nenhum.
- **Componentes do kit:** ícone de app (`.appic`), carimbo gasto (`KIT.carimbo`; `papel:true` sobre fundo claro), selo ✕ ao lado (`KIT.seloX`), contador gigante (`KIT.contador`), selo de grátis (`.gratis`), tela sem moldura (`KIT.tela`), cursor branco.
- **Glitch** sempre em neon (cópias deslocadas e barras ciano `#00F0FF` e magenta `#FF2BD6`, com brilho), nunca nas cores das letras, senão parece texto riscado.
- **Desenho:** nada que lembre forma fálica (nada de dedo solitário com unha). Mão é mão aberta, cinco dedos, sem unhas.

## 4. Layout: 1080×1920, 30 fps

| Zona | Coordenadas |
|---|---|
| Topo da plataforma | y < 200: nada importante |
| Cabeçalho próprio | barra, selo e handle (abaixo) |
| **Conteúdo** | x 90–940, y 340–1400 |
| **Legenda** | top 1452, largura 850 |
| UI da plataforma | y > ~1560 e x > 940: nada importante |

- **Barra de progresso:** x 90–940, top 212, 12 px, cantos 6, trilho `rgba(242,238,230,.13)`, vermelho com glow. **Barra dinâmica:** `largura = 850 · (1 − e^(−K·u)) / (1 − e^(−K))`, `u = t/T`, `K = ln 25`, presa entre 0 e 850. Enche rápido no começo e quase para no fim, porque aí a pessoa já está presa.
- **Selo** "DIA NN/30": Anton 40 px numa pílula vermelha (left 90, top 246), com pop quando "dia N" é falado. **Handle** "@cobaia.dev": Mono 700 30 px `#bdbdbd` (right 140, top 253).
- O conteúdo nasce abaixo do cabeçalho (y ≥ 340).

**Legendas** (`KIT.fechar`, dados em `data.js`):
- Inter 800 46 px, centradas, **sutis**. Palavra ativa com sublinhado vermelho; as outras com opacidade .8 e sombra escura. Blocos curtos sincronizados palavra a palavra.
- **Escondidas quando o texto falado já está grande na tela** (`KIT.semLegenda`): gancho tipográfico, digitação, título falado ("jeito lento", "sem código nenhum"), pergunta e palavra da chamada final. No Dia 5 a legenda repetiu vários desses textos.
- **Sem piscadas:** cada faixa escondida termina no início do bloco seguinte, e nenhum bloco fica menos de ~0,3 s na tela fora da fala real (`gerar-data.py` junta os curtos).
- O destaque do vídeo são as palavras que surgem e os motions, não a legenda.

## 5. Movimento e transições

- **Estações:** cada bloco do roteiro é uma estação de 1080 px num "mundo" horizontal. A câmera passa em **0,36 s** (`KIT.camera`), com borrão horizontal de no máximo 5 px.
- **Várias etapas numa estação:** faixa rígida que desliza para a esquerda; elementos persistentes ficam fixos abaixo.
- **Sincronia:** cada palavra-chave dispara um evento visual no tempo dela (`k.T(i)`), com 0,05 a 0,15 s de antecipação.
- **Desfoque sempre rápido e sutil:** até ~5 px e até 0,15 s. Texto nunca fica borrado parado.
- **Número exagerado:** contador gigante rolando do zero que trava com tremida e "+" vermelho quando a fala diz "mais de" (`KIT.contador`).
- **Dinheiro ou grátis:** selo verde, estouro de "$" e som `caixa`.
- **Surgimento de texto:** nada de palavra solta com pop. Varie por cena: saindo do desfoque (`KIT.blurIn`), serif acendendo de cinza (`KIT.greyIn`), número rolando atrás de máscara. Título pousado fica parado.
- **Entradas:** back-out com overshoot para pops, cúbica para deslizes, escala 0.5→1 com leve `rotateY(-40→0)`.
- **Pulso no beat** só nos compassos com bumbo; desligado em silêncios dramáticos.
- **Tremor** em impactos (8 a 40 px, decaindo). **Flash** branco curto (≤ 0,5, 0,12 a 0,25 s) só em impactos grandes.
- **Partículas** com sementes fixas, sempre atrás do conteúdo (canvas `#fx` antes da câmera). Perto de texto, escala pequena e origem no próprio objeto.
- **X de "errado":** selo redondo vermelho ao lado do elemento (`KIT.seloX`), nunca riscado por cima.
- **Telas simuladas** (`KIT.tela` com as telas da biblioteca):
  - Só o conteúdo da tela, cantos levemente arredondados e sombra, **sem moldura** de monitor ou celular falso. Parece gravação de tela editada.
  - Entram giradas (rotateY 25 a 40°, escala .8) e assentam inclinadas (±6 a 8°).
  - **Zoom inclinado no ponto falado:** a cada clique ou detalhe, a tela inteira corre e inclina até o ponto (`foco()`, ~0,4 s). **Raramente a tela inteira**, só quando o assunto é geral. Anime a escala do contêiner, nunca amplie bitmap pequeno.
  - **Zoom na ênfase (pedido do criador em 11/11):** onde a fala dá ênfase ou mostra algo, a câmera dá zoom nesse ponto, e os frames de aprovação já mostram esse zoom. Em demonstração de sistema ou app (vários apps abrindo, teste de velocidade, player), o zoom é **leve** (1,15 a 1,35x) e **acompanha o mouse**.
  - **Antes e depois lado a lado:** em comparação de velocidade, tela dividida com o jeito antigo travando (carregando, erro, fechando) e o novo abrindo na hora, cada lado com seu cronômetro.
  - **Cursor branco** guiando tudo o que é falado: vai até o item e clica com leve encolhida.
  - Pedido digitado no ritmo da fala, palavras-chave em vermelho, legenda escondida nesse trecho.
  - Mockups genéricos, nunca print nem réplica exata de terceiros.
  - **Cliques em sequência** (ex.: "Cancelar inscrição"): botão vermelho com texto branco; o cursor clica num, desce, clica no próximo; cada linha clicada vira "✓ Cancelada" e some; o zoom acompanha cada clique.
- **Gancho desde o frame 0**, sem fade do preto.
- **Retomada do dia anterior** só entra onde o criador fala dela no áudio.
- Pode acelerar a voz se ajudar no ritmo (seção 9).
- **Reação real do criador:** quando ele manda um vídeo da própria reação, ele entra curto (até ~3 s), em vertical 1080×1920, podendo acelerar até 1,15x. Antes de usar, confira quadro a quadro e borre o que for sensível (nome de Wi-Fi, IPs, nomes, e-mails).

## 6. Cenas aprovadas (referência de nível)

As peças prontas estão no catálogo da biblioteca. As cenas abaixo são o nível que cada vídeo precisa superar. Reaproveite a ideia com elemento novo; nunca repita o exemplo ou o app de um vídeo anterior.

1. **Gancho tipográfico:** Anton gigante palavra a palavra, última palavra em vermelho (Dia 1: "NINGUÉM / EDITOU / ESSE VÍDEO.").
2. **"foi o CLAUDE":** "foi o" em serif, "CLAUDE" em Anton vermelho, ícone entrando forte com confete e flash.
3. **Calendário de 30 dias** (`KIT.calendario`): todos os 30 quadrados já visíveis na palavra "trinta", dia atual vermelho.
4. **Corte de silêncios tátil** (Dia 1): mão estica a onda, zonas de silêncio aparecem, cortes caem girando, contador "1:06 → 0:43".
5. **Checklist que acumula** com check vermelho que se desenha e negrito só na palavra-chave.
   Outras do Dia 1: player de áudio de vidro com carimbo "SILÊNCIO" e "cri... cri..."; busca + cartão da música real com carimbo "LIBERADA"; cadeado de vidro abrindo; cores como ícones de app e cartão "GUIA DO PERFIL"; template genérico com ✕ e o vídeo real batendo com "o meu!" em Marker; teaser "amanhã..." em serif.
6. **Texto escrito pelo Claude:** documento de vidro com retângulos em forma de palavras e realce correndo, depois carimbo "ESCRITO PELO CLAUDE" com o ícone tombando.
7. **Dia 2:** Claude Code simulado digitando e o jogo próprio ("Cobaia: A Fuga") abrindo ao lado, com gameplay real.
8. **Dia 3 (skill é a receita da vó):** chapéu de chef caindo, panela, cartão "FEIJÃO DA VÓ", órbita de assuntos do Claude, livro de receitas, rebobinar VHS com contador de linhas, "R$ 0/mês".
9. **Dia 4 (Gmail e Agenda):** contador 0 → 19.000+ com o Gmail inclinado, calendário de mesa virando de 2002 a 2026, e-mail importante empurrado por e-mails novos, relógio neon com cronômetro.
10. **Dia 5 (MCP):** tomada padrão em 3D (Canva instala a tomada, Claude pluga), notificação do chefe no celular, três posts reais da padaria.

## 7. Chamada final e material de quem comenta

**A chamada final é sempre a do Dia 3** (`KIT.cta`). O o criador não gostou das versões diferentes do Dia 4 v3 e do Dia 5: não invente outro formato.
- Fala: "Quer saber mais sobre o Claude? Segue o cobaia, curte e comenta PALAVRA que eu te mando [o material]."
- Animação: "QUER SABER MAIS / SOBRE O [ícone] CLAUDE?" em Anton; avatar 330 px centralizado com "+" que vira ✓ e fogos; coração branco que fica vermelho; só o campo de comentário em vidro digitando a palavra; cartão da mensagem com o material; no fim, "COMENTA / PALAVRA" gigante. Só o elemento que está sendo falado. Nunca print ou réplica da tela do TikTok.
- Cada dia tem uma palavra-chave diferente (lista no Doc). Sem palavra-chave, pergunta aberta, nunca sim/não.
- **Entrega do material:** cada palavra-chave tem uma página no site (`cobaia-dev.vercel.app/<palavra>`). **O o criador manda o link à mão** para quem comenta. Não existe automação de DM (o plano dela está salvo no documento "Plano: link do guia por comentário").
- **PDF só quando o criador pedir.** Palavras dele: "esse pdf deve ser solicitado, enquanto não for solicitado não produza, pois posso pedir alterações nos vídeos". O roteiro pode prometer o material; a página do site leva o guia.
- Pedido extra de engajamento só quando o criador pedir (custa segundos).

## 8. Roteiro e textos do post

- **Gancho:** sempre do banco de ganchos virais (`referencias/banco-ganchos-virais.md`, atualizado 1x por semana), com prova de alcance citada no plano. **Se a estrutura lembrar a de um dia anterior, escolha outro do banco.** Antes de cada roteiro, pesquise canais relevantes de fora (EUA e Europa) sobre o tema, veja os vídeos com maior alcance e replique o que comprovadamente funciona (gancho, estrutura, edição). Nada inventado do zero; tudo respaldado em referência viral real, citada no plano. Formato, ângulo, gancho e edição não se perguntam ao criador: quem decide é a pesquisa.
- **Estrutura:** gancho nos 2 primeiros segundos; **logo depois do gancho, a vinheta "Dia N dos trinta experimentos com Claude"** (até uns 5 s); depois o tema, com um "trinta" só no vídeo inteiro. A vinheta nunca vai para o final.
- **Ingredientes, sem ordem fixa no resto:** o conceito com substância (o que é, como funciona por dentro, quando usar, exemplo concreto) explicado com analogia da vida real; a tela do Claude simulada mostrando na prática; "você não precisa fazer isso: o Claude ajuda a fazer o seu"; teaser do próximo dia quando couber; chamada final (seção 7).
- **Vida real, não conceito:** "eu não falo sobre o tema, eu falo sobre a vida das pessoas com o tema". Mostre o Claude resolvendo uma cena da rotina, com o resultado legível na tela (como o Dia 2). No máximo uma metáfora; sem aula de segurança fora do tema. Confira na documentação o que o recurso faz antes de prometer. Por ora tudo é simulado.
- **Vida real primeiro** funciona bem: começar pela analogia e só depois revelar que é sobre o Claude (Dia 3 v3: "O melhor chef do mundo perde pro feijão da sua vó. O Claude é igualzinho: entende de tudo, menos do seu jeito."). O conceito precisa de substância: o Dia 3 v2 foi vetado porque "não mandou nada demais sobre o tema".
- **~60 segundos, bem prático.** 170 a 195 palavras dão uns 52 a 60 s depois dos cortes e da aceleração. Acima disso, corte. Se não couber, corte frase de enchimento em vez de acelerar mais.
- **Não repetir exemplos nem apps de vídeos anteriores** (Gmail e Agenda já foram no Dia 4; Canva no Dia 5).
- **Sem fórmula:** nada de "o truque" ou "o segredo" em todo vídeo. Loop aberto, mito e quebra só quando cabem.
- **Sem palavra repetida** na mesma frase nem na seguinte (fora o tema e "Claude"). Rode uma checagem de repetição antes de entregar. Vetados: "Todo mundo tá falando de skill no Claude. E tá todo mundo complicando." e "Dia três de trinta. Trinta dias, trinta experimentos". Evite abrir de novo com negação (Dia 1 "Ninguém...", Dia 2 "Eu não...").
- **Senioridade:** nunca "eu não escrevi", "eu não fiz" ou "eu não sei", que fazem o criador parecer leigo. Use "você não precisa fazer isso: o próprio Claude faz (ou ajuda)". Quando ele entrega um arquivo ou prompt grande, ele diz que fez, e que a pessoa não precisa de um desse tamanho porque o Claude ajuda a montar o dela.
- **Valor do perfil:** o criador deixa simples o que outros vendem em curso pago ou explicam em vídeo longo. Isso aparece pela clareza, sem virar bordão. Se citar curso pago, confira antes que ele existe.
- **Teaser do dia seguinte** grave e curioso, sobre o tema real do próximo dia do plano, de preferência algo que atinge a própria pessoa (Dia 3 v3: "Amanhã: você pode passar a chave do seu e-mail pro Claude. A pergunta é: deveria?"). Ele trava a ordem do plano: se o criador quiser trocar o próximo tema, ajuste antes de ele gravar.
- **Motion junto com o roteiro:** cada frase tem um evento visual forte, com transição e som.
- **Humanizer sempre:** todo roteiro e todo plano de roteiro passam pela skill `humanizer` antes de ir para o criador.
- **Um roteiro por vez**, do próximo dia. Quando o dia depende de um teste, o texto final só sai com o resultado na mão.
- **Entrega do roteiro:** texto para o criador gravar e texto para a IA de voz (sem tags, ou com tags animadas como [excited], [curious], [laughs]; nada de tom baixo astral), mais "Como gravar", "Onde estão os gatilhos" e "O que vai aparecer na tela" (Fala | Na tela | Peça da biblioteca | Transição e som).
- **Textos de postagem do dia num único pedido:** legendas das 3 redes e comentário fixado.
  - **Instagram:** 1ª linha é um segundo gancho com emoji; 3 a 5 linhas que ensinam; "comenta PALAVRA"; 5 hashtags (1 grande, 2 médias, 2 de nicho).
  - **TikTok:** gancho com a palavra que as pessoas buscam, 1 ou 2 linhas, "comenta PALAVRA", uma pergunta e 3 a 5 hashtags.
  - **YouTube Shorts:** título de busca com até 60 caracteres, 2 linhas, "Inscreva-se: amanhã sai o Dia N+1" com o motivo, 2 ou 3 hashtags.
  - **Comentário fixado:** pergunta aberta no Instagram e no TikTok; no YouTube, pedido de inscrição com motivo.
  - Hashtags: grandes #inteligenciaartificial #ia #tecnologia; médias #claudeai #produtividade #automacao #dicasdetecnologia; nicho #claude #anthropic #skills #claudecode #semprogramar.
  - Nunca explicam as táticas do vídeo.
- Roteiros e decisões ficam no Doc da série.

## 9. Áudio

**Voz gravada pelo criador:**
1. WAV 48 kHz. Transcrição com faster-whisper (`telas/scripts/transcribe.py`: modelo small, cpu int8, `language="pt"`, tempos por palavra, `initial_prompt` com os termos do canal). Se o download do modelo for bloqueado na rede, use o alinhamento pelo texto (abaixo).
2. Corte de silêncios (`cut3.py`): limiar relativo ao ruído (−32 dB quando o fundo está em ~−40 dB), janelas de 10 ms, junta falas com intervalo < 0,12 s, margens de 0,05 s antes e 0,09 s depois, fades de 8 ms. **O fim de cada frase vem do envelope de energia**, não do fim da palavra do whisper: sílabas finais fracas ("grá-tis", "impor-tam") somem com limiar alto. Não comprima pausas de vírgula em listas.
3. Tratamento: `highpass=f=80, afftdn=nf=-30, equalizer 250 Hz −2 dB, equalizer 4 kHz +2 dB, acompressor thr −20 dB ratio 3, atempo (até ~1,18 em gravação limpa), loudnorm I=-16`.
4. **"Corrigindo":** quando o criador erra, ele fala "corrigindo" e repete. Corte do início da tentativa errada até o fim de "corrigindo". Se gravar a mesma frase duas vezes, fique com a que bate com o roteiro.
5. Corrija a transcrição pelo roteiro antes das legendas (ex.: "chefe" → "chef", "Tropic" → "Anthropic", "a risca" → "à risca"). Pausas dramáticas ficam definidas à mão onde o roteiro pedir, e os tempos das palavras são recalculados depois do corte e da aceleração.
6. Confira por nova transcrição com prompt neutro (um prompt com a frase faz o whisper pular a frase). Se a transcrição longa cortar uma sílaba, confira numa janela curta antes de mexer no mix.
7. Regravação parcial: mantenha a voz aprovada até o ponto de troca e anexe a parte nova, cada parte em −16 LUFS. Se houver risco de diferença de timbre, peça para regravar inteiro.

**Voz de IA (ElevenLabs) ou whisper bloqueado:** `align.py` alinha pelo texto do roteiro (frases pela pontuação, programação dinâmica por duração esperada de sílaba, palavras distribuídas por sílaba; ajuste a contagem de siglas como MCP) e `cut.py` corta com atempo. Bom para voz limpa.

Resultado dos dois caminhos: `audio/voz_editada.wav` e `audio/palavras.json`, e depois `gerar-data.py` → `data.js`.

**Música** (biblioteca `telas/audio/musica/`):
- Animada, instrumental, sem voz, ~120 a 130 BPM (EDM, tech house, electro pop). **Música do primeiro ao último quadro** (no Dia 5 v1 metade ficou sem música).
- **Não repita a faixa de nenhum dos três dias anteriores.** Dias 3, 4 e 5 usaram "Cat Walk": o próximo vídeo precisa de faixa nova do Mixkit, que entra na biblioteca e nos créditos.
- **Trilha que acompanha a narrativa**, remontada compasso a compasso (`audio/trilha.json`, crossfade de 12 ms): drop no gancho; breakdown no problema do dia a dia e build depois; compasso de pausa + tape stop antes da virada e drop na palavra-chave; build na digitação e cheio no resultado; breakdown + riser até o drop na prova; cheio na chamada final. Ganho por trecho (breakdown +4,5 dB, build +2,5 dB).
- Volume base −11 dB, ducking pela voz (até −55%, ataque 20 ms, release 280 ms), −20 dB em silêncio dramático, −10 dB em tensão. A voz fica ~17 dB acima. Nada abaixo de ~−40 dBFS (o `mix.py` avisa).

**Trilha montanha-russa:** trechos de faixas diferentes montados por cena em `audio/trilha.json` (`faixas` + `segmentos`, no `mix.py`): groove no gancho, escuro e sem batida no problema, vazio antes da virada, drop na revelação, respiro na emoção, drop de novo na chamada final.

**Efeitos que fogem do óbvio:** nada do whoosh, pop, ding e confete que todo vídeo com IA usa. Prefira sub_drop, reverse_swell, glass_chime, bloom, tape_whirl, tick_wood, power_down; e no visual, vinheta que respira na tensão, luz vazada na revelação, separação RGB na falha, linha de varredura, anel de onda e soco de zoom no drop.

**Efeitos ("chuva de dopamina"):** todos sincronizados com palavras ou eventos e **só da biblioteca** (`telas/audio/sfx/`; a tabela momento, som e volume está no CATALOGO.md). As passagens de câmera alternam três sons diferentes. Som novo entra na biblioteca com crédito, e nunca é sintetizado solto dentro de um vídeo.

**Master:** `loudnorm I=-14 LUFS, TP=-1.2` (`mix.py`).

## 10. Pipeline de produção

1. Roteiro aprovado; o criador escolhe a voz e grava (ou gera na IA de voz).
2. `cp -r /mnt/project-files/videos/template /mnt/project-files/videos/fonte/diaNN` e, dentro dela, `node /mnt/project-files/telas/scripts/biblioteca.cjs`. O LEIAME do modelo tem o passo a passo.
3. Voz (seção 9) → `audio/voz_editada.wav`, `audio/palavras.json`, `gerar-data.py` → `data.js`, e o `data-duration` do `#root` igual ao TOTAL.
4. Monte as estações no `index.html` só com o miolo do dia, usando o kit e as telas. Tudo é função do tempo: sem CSS transition, sem `Date`, sem `Math.random` sem semente.
5. **Storyboard estático:** `npx --yes hyperframes@0.9.23 snapshot --no-end --at <um tempo por estação>` e folha de contato (`folha.py`), com a peça da biblioteca de cada cena. Mande para aprovação. Não renderize sem aprovação (seção 2, regra 9).
6. **Checagem:** `npx --yes hyperframes@0.9.23 check --json` com zero erros. Avisos esperados: `film_silent` e `audio_none` (o áudio entra no encode), `container_overflow` do odômetro.
7. **Render só pelo HyperFrames:** `npx --yes hyperframes@0.9.23 render -q delivery -w 4 -o render/video.mp4`. Nada de script próprio tirando print quadro a quadro (foi o que aconteceu no Dia 5). Para conferir correções, use `snapshot` nos tempos alterados; o arquivo final sai de um render completo, porque trechos re-renderizados isolados podem sair com bordas meio pixel deslocadas.
8. **Mix:** `node assets/scripts/exportar-sons.cjs` → `mix/sons.json`; escreva `audio/trilha.json`; `python3 assets/scripts/mix.py`.
9. **Encode:** `bash assets/scripts/encode.sh render/video.mp4 mix/mix_final.wav NN` (x264 dois passes, yuv420p, high@4.2, `-g 60`, bt709, faststart). HQ: 8000k, maxrate 12000k, AAC 256k. Leve (< 25 MB): `192000 ÷ duração − 160` kbps, maxrate 1,5×, AAC 160k.
10. **Entrega em `videos/diaNN/postar/`:** `cobaia-diaNN-final.mp4` (HQ), `cobaia-diaNN-final-leve.mp4`, `capa-diaNN.jpg` e `textos-postagem-diaNN.txt` (legendas das 3 redes e comentário fixado). Versões de trabalho ficam em `videos/diaNN/`, fora da `postar/`. Evite duplicar arquivos em várias pastas.
    - **Cópia no PC (até o fim dos 30 dias):** a versão HQ vai para `C:\Users\usuário\cobaia\diaNN\` (salve em `/mnt/project-files/` e use `device_commit_files`). Sem ferramenta de transferência, avise o criador para baixar da Biblioteca.
11. **Capa 1080×1920:** fundo da marca; "DIA NN" em Anton vermelho 132 px com "/30" apagado (top 286); 3 a 5 palavras em Anton off-white com a palavra-chave em vermelho, 2 linhas centradas (top 466, cada linha cabendo em 980 px); um frame do vídeo num cartão de vidro 900×740 (top 858), nunca com código; "@cobaia.dev" em Mono (top 1730). Tudo o que importa entre y 240 e 1680 (recorte 3:4 da grade). Texto da capa: o gancho do vídeo encurtado (Dia 1 "NINGUÉM EDITOU ESSE VÍDEO", Dia 2 "UMA FRASE VIROU UM JOGO", Dia 3 "SKILL É A RECEITA DA VÓ").
12. **Site (obrigatório):** sempre que um vídeo for criado ou editado, atualize a página da palavra-chave e o calendário em cobaia-dev.vercel.app (repo `cobaia-site`; a Vercel publica a cada push na `main`): capa reduzida em `assets/img/capa-diaNN.jpg`, entrada em `DIAS` no `src/build.py`, miolo em `src/dias/<palavra>.html` com o guia prometido, `python3 src/build.py` e `node src/og.js`. Todo card e modal do site usa o Liquid Glass.
13. **PDF da palavra-chave, só quando o criador pedir:** páginas 1080×1920, 6 a 8 páginas (Playwright `page.pdf` com `printBackground`), fundo da marca, títulos em Anton, texto em Inter, pedidos ao Claude em bolhas vermelhas, passo a passo real conferido na ajuda do Claude (plano, nome da opção, botão), imagens só de frames do vídeo (nunca código), última página com a colinha e o convite pra marcar o @cobaia.dev, brilhos com `radial-gradient` (sem `filter: blur`).
14. Ajustes de cada vídeo juntos numa lista única antes de refazer. Uma tarefa por thread.

## 11. QA antes de entregar

- **Biblioteca:** cada cena usa a peça da biblioteca quando ela existe? A chamada final é a padrão (`KIT.cta`)? A música não repete a de nenhum dos três dias anteriores? Todos os sons vieram da biblioteca (o `mix.py` avisa os que faltam)? Peças novas reaproveitáveis voltaram para a biblioteca?
- **HyperFrames:** `check` sem erros e render feito pelo `hyperframes render`.
- Folha de contato a cada 0,5 s, mais frames em cada transição e evento. Confira:
  - Nada sobreposto (cabeçalho, legenda, partículas, cartões) e conteúdo dentro de x 90–940, y 340–1400.
  - Ícone do Claude só nos momentos certos; laranja e cores de terceiros sem dominar a cena.
  - Eventos no tempo da palavra; nenhuma tela parada nem quadro quase vazio.
  - Legenda escondida onde o texto já está grande na tela, sem piscadas e sem bloco com menos de ~9 frames fora da fala real.
  - Liquid Glass nos cartões e caixas; barra de progresso com a curva dinâmica; cartões com dados reais.
  - Nenhum código, texto da skill ou prompt legível; nenhuma estratégia revelada; nenhum dado do criador.
- Roteiro: nenhuma palavra repetida na mesma frase, um "trinta" só, vinheta logo depois do gancho, gancho do banco com referência citada, Humanizer aplicado.
- Áudio: −14 LUFS, pico ≤ −1,2 dBTP, música do começo ao fim, efeitos audíveis, música abaixo da voz.
- MP4 decodificado inteiro sem erro, duração, 30 fps, 1080×1920; leve abaixo de 25 MB.
- Pasta `postar/` completa, site atualizado e cópia no PC.

## 12. Código e fontes

- **Biblioteca:** `/mnt/project-files/telas/` (LEIAME.md, CATALOGO.md, catalogo.jpg). Kit em `telas/kit/`, Liquid Glass em `telas/kit/liquid-glass.*` (documentação em `skill/liquid-glass.md`), áudio em `telas/audio/`, scripts em `telas/scripts/`.
- **Modelo:** `/mnt/project-files/videos/template/` (HyperFrames 0.9.23, exemplo testado com gancho, calendário, tela com foco, contador, carimbo, chamada final e loop). O modelo antigo, anterior ao HyperFrames, ficou em `videos/template-antigo/` só como histórico.
- **Fontes dos vídeos já feitos:** `videos/fonte/diaNN/` (consulta, nunca ponto de partida).
- HyperFrames: comandos `check`, `snapshot`, `render`, `docs <tópico>`; o GSAP é local (`assets/js/gsap.min.js`) porque a CDN é bloqueada.

## 13. Registro de mudanças (obrigatório)

Sempre que o criador pedir uma alteração ou melhoria (vídeo, roteiro, cena, áudio, processo ou regra):
1. **Atualize a regra** na seção certa desta skill, substituindo a regra antiga que conflite. Se for identidade visual ou peça reaproveitável, atualize também a biblioteca.
2. **Acrescente uma linha em `skill/changelog-antigo-cobaia-dev-videos.md`** na pasta do projeto: data, o pedido do criador resumido fielmente e o que mudou. Nunca apague entradas antigas. Aqui fica só a última mudança.
3. **Entregue a skill atualizada** pela ferramenta de propor skill (`cobaia-dev-videos`).

Última mudança: **2026-11-11, músicas e efeitos novos.** O o criador pediu para baixar músicas e efeitos novos sempre que precisar, registrar onde achá-los, trilha que acompanha a emoção como montanha-russa e efeitos menos óbvios que os que todo mundo usa, além de barra de progresso no chat também durante o render. Mudou: regra 3 da seção 2 e seção 9 (fontes, trilha por segmentos, efeitos novos).

Mudança anterior à última: **2026-11-11, zoom na ênfase e reação real.** Mudou: seção 5 (zoom na ênfase, comparação lado a lado e reação real).

Mudança anterior: **2026-11-10, revisão da skill e biblioteca única.** O o criador pediu uma análise da skill e "faça as melhorias e correções", com tudo o que puder ser reaproveitado vindo sempre da biblioteca. Mudou: regra "biblioteca primeiro" (seção 0); kit de identidade, áudio e scripts na biblioteca; modelo HyperFrames novo com render só pelo HyperFrames; decisões do criador (render só com aprovação, salvo aviso de ausência; vinheta logo depois do gancho; gancho do banco sem repetir estrutura; link do site enviado à mão, sem automação e sem agência; voz gravada ou de IA, escolhida por vídeo); lições pendentes dos Dias 4 e 5 incorporadas; QA com as checagens de biblioteca, música e chamada final.