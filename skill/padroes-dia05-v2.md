# Padrões do Dia 5 v2 (MCP do Canva), 09/11/2026

Pedido do criador: vídeo refeito do zero com o áudio novo, telas em perspectiva 3D, mockups de UI (Canva, Claude), música contínua do começo ao fim (no vídeo anterior metade ficou sem música) e trilha que acompanha a narrativa, gastando o mínimo de tokens. Fonte completa em `videos/fonte/dia05-v2/`.

## Telas
- Toda tela simulada (Claude, editor de design, WhatsApp, Configurações) entra girada (rotateY 25–40°, escala 0,8) e assenta inclinada (rotateY ±6–8°, rotateX 4–8°). A cada detalhe falado, a tela inteira corre e inclina até o ponto: keyframes de 0,4 s com `eio` (função `kf()` do `scene.js`).
- Mockups em HTML, genéricos: editor de design (barra em gradiente, trilho de ícones, grade de modelos, fonte e amostra de cor), chat do Claude (fundo #262624, bolha do usuário à direita, campo "Responder..."), Configurações > Conectores com busca e botão "Conectar" que vira "Conectado ✓" verde. Nunca print nem réplica exata de interface de terceiros.
- Pedido digitado na bolha em sincronia com a fala, palavras-chave em vermelho, legenda escondida nesse trecho.
- `.glass` com `.a` precisa de `.a.glass{position:absolute}`; pílulas com `width:max-content`.

## Trilha dinâmica
Música do primeiro ao último quadro. A faixa é remontada compasso a compasso (130 BPM: 1,846 s), na grade da saída, crossfade de 12 ms:
- Gancho e vinheta: trecho cheio. Problema do dia a dia: breakdown sem bumbo, depois o build.
- Virada ("isso mudou"): compasso de pausa + tape stop, drop junto da palavra-chave.
- Demonstração: build na digitação, cheio quando o resultado aparece; um compasso de pausa nas perguntas de tensão.
- Passo a passo: build. Prova: breakdown + riser até o drop. CTA: cheio até o fim.
- Ganho por trecho (breakdown +4,5 dB, build +2,5 dB). Conferir a música segundo a segundo: nada abaixo de ~−40 dB.
- Pulso visual só nos compassos com bumbo. Efeitos vêm de `window.SFX` da página (`dump.js`).

## Voz sem Whisper
O download do modelo foi bloqueado na rede. `scripts/align.py` alinha pelo texto do roteiro: divide em frases pela pontuação, casa frases com trechos de fala por programação dinâmica (duração esperada por sílaba) e distribui as palavras por sílaba. Bom para voz limpa (ElevenLabs). `cut.py` com atempo 1,18 para ~63 s.
