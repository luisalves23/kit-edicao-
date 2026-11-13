# Biblioteca do @cobaia.dev

Regra: **antes de criar qualquer tela, peça ou som, procure aqui.** Se existe, use. Se não existe e dá pra reaproveitar, crie no vídeo e, ao terminar o vídeo, traga para cá (arquivo, uma linha neste catálogo e a miniatura em `catalogo.jpg`).

Miniaturas de tudo: `catalogo.jpg`. Para ligar um projeto de vídeo à biblioteca: `node /mnt/project-files/telas/scripts/biblioteca.cjs` dentro da pasta do projeto (copia tudo para `assets/`).

## 1. Kit de identidade (`kit/`)

`kit.css` (visual) + `kit.js` (animação, GSAP) + `liquid-glass.css/js` (vidro oficial). Mudou a identidade da série? Mude aqui, nunca dentro de um vídeo.

| Peça | Chamada | O que faz |
|---|---|---|
| Palco | `KIT.montar({dia, estacoes})` | fundo (gradiente, grade de pontos, 2 blobs, vinheta, grão .03), barra dinâmica K = ln 25, selo DIA NN/30, @cobaia.dev, legenda, estações em `#cam`, timeline pausada |
| Câmera | `KIT.camera(k, ST)` | passagem de 0,36 s com borrão ≤ 5 px, alternando whoosh / swoosh2 / whoosh_up |
| Calendário | `KIT.calendario(k, {est, t, tTrinta, tClaude})` | vinheta "Dia X de 30" logo depois do gancho: 30 quadrados na palavra "trinta", dia atual vermelho, "30 experimentos com [ícone] Claude" |
| Contador | `KIT.contador(k, {em, ate, t, mais, rotulo})` | odômetro gigante em Anton que trava com tremida, impacto e "+" vermelho |
| Carimbo | `KIT.carimbo(k, {em, texto, x, y, t, papel})` | carimbo gasto (2,4 → 1 em 0,13 s, tremida, impacto). `papel:true` = `.ink` sobre fundo claro |
| Selo ✕ | `KIT.seloX(k, {em, x, y, t})` | ✕ vermelho ao lado do elemento, nunca por cima |
| Tela | `KIT.tela(k, {em, nome, id, w, h})` | qualquer tela da seção 2 sem moldura, com `entra()`, `foco()` (zoom inclinado), `cursorPara()`, `clique()`, `P(seletor)` |
| Chamada final | `KIT.cta(k, {est, palavra, t:{...}, dm})` | a do Dia 3: QUER SABER MAIS / SOBRE O [ícone] CLAUDE?, seguir (+ vira ✓), curtir (coração), campo de vidro digitando, cartão da DM, COMENTA PALAVRA |
| Loop | `KIT.loop(k, t)` | rebobina até o frame 0 |
| Texto | `KIT.blurIn`, `KIT.greyIn`, `KIT.typeIn` + `KIT.teclas`, `KIT.pop`, `KIT.persp` | surgimentos aprovados (desfoque, serif acendendo, digitação com som) |
| Gestos | `KIT.press`, `KIT.shake`, `KIT.swap`, `KIT.count`, `KIT.vidro` | clique, tremida, troca, número contando, varredura de luz no vidro |
| Legenda | `KIT.semLegenda(k, a, z)` + `KIT.fechar(k)` | esconde a legenda quando o texto já está grande na tela; `fechar` monta a legenda e registra no HyperFrames |
| Som | `KIT.ev(nome, t, dB)` | registra um efeito em `window.SFX`; o mix lê essa lista |

Exemplo completo e testado: `videos/template/index.html`.

## 2. Telas de apps (`*.html`)

Cada uma em tamanho nativo, com `<style data-tela>` e markup entre `<!--tela-->`. Genéricas: nunca print nem réplica exata de terceiros, e nunca o nome do criador.

| Arquivo (`nome`) | Tamanho | Estados e slots |
|---|---|---|
| `claude-chat` | 1000×700 | `data-state="home|chat"`, `data-theme="light|dark"`; slots `hello`, `ph`, `text`, `thread`, `title` |
| `claude-conectores` | 1000×700 | Configurações > Conectores; botão `.cn-go` "Conectar" |
| `canva-editor` | 1000×640 | slots `templates` (modelos feios `.ug1`…`.ug8`) e `page` |
| `iphone-bloqueio` | 430×932 | `data-state="off|on|notif|tap"`, notificação do WhatsApp |
| `whatsapp-chat` | 430×932 | slots `name`, `sub`, `thread`; balões `.wa-in`, `.wa-out`, `.wa-typing` |
| `ide` | 1000×640 | editor abstrato (sem código legível), `.empty`, cursor `.ide-caret` |
| `site-dia05` | 430×932 | página do site no celular; rolagem `--scroll`; slot `url` |
| `pomar` | 848×477 | sistema de desktop simulado do Dia 6 (Pomar): camadas `.pm-velho` (desktop antigo), boot com folha e barra, desktop com barra do topo (chip de RAM), janelas Ajustes/Terminal/Claude/Gravador, dock de 9 ícones e camada de glitch neon. Fundo `img/pomar-ondas.jpg`. Exemplo animado: videos/fonte/dia06-pomar/index.html |
| `tv-home` | 1280×720 | tela inicial de smart TV genérica (estilo Android/Google TV). `data-state="ads|clean"`: de fábrica com banner e apps "Patrocinado" (`.tv-ad`, `.tv-sp`, `.tv-badge`) ou tela nova escura com cartões de vidro (`.tv-app`, `.on` = foco). Slots `hora`, `ad-title`, `ad-sub`, `ram` (só número medido). (Dia 7, rascunho)
| `posts-padaria` | 540×540 cada | 3 posts de pão de queijo (marca fictícia) |
| `cta-seguir` | 850×700 | versão estática das peças da chamada final (avatar com +, coração, campo). Para animar, use `KIT.cta`, que é o padrão. Exemplo animado sobre esta tela (fogos em canvas, coração estourando, digitação de MCP): videos/fonte/dia05-v3/assets/js/cena.js, bloco CTA |

Já usadas: Gmail e Agenda (Dia 4, em `videos/fonte/dia04-v3/index.html`) ainda não viraram tela da biblioteca. Na próxima vez que aparecerem, extraia para cá.

## 3. 3D (`js/g3d.js`, three.js r160)

`G.clawd({pose})` (idle, nod, type, write, wave), `G.socket`, `G.plug`, `G.benjamim`, `G.appIcon`, `G.laptop` (Dia 6: opções `esp` espessura da base, `tampa`, `moldura` na cor do corpo, `metal`, `rough`, `pad`; botão de ligar e LED em `userData.btn`/`userData.led`. Preto fino moderno: `color 0x18181b, esp .045`; vermelho velho grosso: `color 0x9e2530, esp .13, tampa .07, moldura true`), `G.paoDeQueijo`, `G.plate`, `G.gingham`, `G.aura`. Páginas de exemplo: `clawd-3d.html`, `tomada-br-3d.html`, `app-icons-3d.html`. Atenção ao laranja: ele é a cor do Claude e não pode dominar a cena.
- `js/positivo3d.js`: notebook Positivo vermelho em 3D, escala real, tampa abre por `setOpen(rad)`; trocar a cor e a textura da tela (`scrTex`). (Dia 6)
- `js/win11.js`: tela de Windows 11 travado (genérica), com cursor girando e pop-ups de erro; trocar textos e quantidade de pop-ups. (Dia 6)
- `js/pomar-os.js` (já na biblioteca): sistema "Pomar" com dock e janelas, usado no Dia 6.

## 4. Logos e imagens (`img/`)

Oficiais (simple-icons e @lobehub/icons): Claude (`claude-icon.jpg` é o ícone do app), Anthropic, Claude Code, MCP, OpenAI, Google, Gmail, Agenda, Canva, WhatsApp, Apple. Avatar do perfil: `avatar.jpg`. Fotos do pão de queijo: `pao-*.png`. Papel de parede de ondas do Pomar: `pomar-ondas.jpg` (Dia 6).

## 5. Áudio (`audio/`)

Tudo com licença: Mixkit Free License (música e efeitos) ou sintetizado aqui (`scripts/sintetizar-sfx.py`). Créditos em `audio/CREDITOS.txt`.

### Músicas (`audio/musica/`)

| Arquivo | Faixa | BPM | Usada em |
|---|---|---|---|
| `cat-walk-mixkit-371.mp3` | Cat Walk (Arulo), Mixkit 371 | 130 | Dias 3, 4 e 5 |
| `a-game-mixkit-777.mp3` | A Game (Michael Ramir C.), Mixkit 777 | ~128 | Dias 1 e 6 |
| `eletronica-144bpm-sobe-mixkit-400.mp3` | Mixkit 400 | ~144 | Dia 7 |
| `groove-136bpm-reto-mixkit-135.mp3` | Mixkit 135 | ~136 | Dia 7 |

Regra: a música não repete a de nenhum dos três dias anteriores. Hoje as duas já foram usadas nos últimos três dias, então o próximo vídeo precisa de faixa nova do Mixkit. Ao baixar, salve aqui como `titulo-mixkit-ID.mp3` e acrescente nesta tabela e nos créditos.

### Efeitos (`audio/sfx/`): momento, som e volume

| Momento | Som (arquivo) | dB |
|---|---|---|
| Passagem de câmera | `whoosh`, `swoosh2`, `whoosh_up` (alternar, nunca o mesmo duas vezes seguidas) | −12 |
| Entrada de elemento | `pop`, `pop2` | −10 a −13 |
| Digitação (uma por letra) | `key` (o mix alterna `key1`…`key4`) | −13 a −20 |
| Clique | `click` | −8 |
| Carimbo, impacto, número travando | `impact` + `boom` | −6 / −12 |
| Gancho, drop | `bass_drop` | −8 |
| Brilho, ícone do Claude | `sparkle` | −14 |
| Check, seguir | `coin` (+ `crackle` nos fogos) | −8 / −12 |
| Curtir | `heart` | −8 |
| Mensagem, notificação | `notification`, `ding` | −9 a −14 |
| Contagem, odômetro | `tick` | −13 a −20 |
| Tensão antes do drop | `riser` | −12 |
| Celular vibrando, desbloqueio | `buzz`, `unlock` | −9 a −12 |
| Caneta, papel/slide | `scribble`, `swish` | −12 |
| Silêncio dramático | `grilo` | −14 |
| Esticar, corte | `elastico`, `snip` | −12 |
| Grátis, dinheiro | `caixa` | −9 |
| Foto, print | `shutter` (origem não registrada: conferir antes de usar) | −12 |
| Erro, glitch (sempre em neon ciano e magenta na tela) | `glitch` | −12 |

### Mix padrão (`scripts/mix.py`)

Voz + trilha remontada compasso a compasso (`audio/trilha.json` do vídeo) + efeitos de `mix/sons.json`. Ducking pela voz (até −55 %, ataque 20 ms, release 280 ms), música do primeiro ao último quadro, tape stop e automação de silêncio, master −14 LUFS e pico −1,2 dBTP. O script avisa quando um som não está na biblioteca e quando a música cai abaixo de −40 dBFS.

## 6. Scripts (`scripts/`)

| Script | Para quê |
|---|---|
| `biblioteca.cjs` | liga o projeto à biblioteca (copia tudo para `assets/`) |
| `transcribe.py` | voz gravada: faster-whisper com tempos por palavra |
| `align.py` + `cut.py` | voz de IA (ElevenLabs) ou whisper bloqueado: alinha pelo texto do roteiro e corta com atempo (exemplo do Dia 5; ajuste a contagem de sílabas de siglas) |
| `cut3.py` | corte de silêncios da voz gravada (Dia 3) |
| `gerar-data.py` | `audio/palavras.json` → `data.js` (palavras, blocos de legenda, TOTAL) |
| `exportar-sons.cjs` | `window.SFX` da página → `mix/sons.json` |
| `mix.py` | mix padrão (acima) |
| `encode.sh` | x264 dois passes: HQ 8000k e leve < 25 MB, com o mix |
| `folha.py` | folha de contato de uma pasta de quadros |
| `sintetizar-sfx.py` | regera os efeitos sintetizados |
