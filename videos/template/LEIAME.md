# Modelo de vídeo do @cobaia.dev (HyperFrames)

Ponto de partida de todo vídeo novo. Nunca comece de código novo nem copie o vídeo do dia anterior.

## Passo a passo
1. `cp -r /mnt/project-files/videos/template /mnt/project-files/videos/fonte/diaNN && cd` nela.
2. `node /mnt/project-files/telas/scripts/biblioteca.cjs` → cria `assets/` com kit, telas, imagens, fontes, áudio e scripts.
3. Voz em `audio/`:
   - gravada pelo criador: WAV 48 kHz, `python3 assets/scripts/transcribe.py` (faster-whisper) e corte de silêncios;
   - voz de IA (ElevenLabs) ou whisper bloqueado: `assets/scripts/align.py` + `cut.py` (alinha pelo texto do roteiro).
   Resultado: `audio/voz_editada.wav` e `audio/palavras.json`.
4. `python3 assets/scripts/gerar-data.py` → `data.js`. Atualize `data-duration` do `#root` com o TOTAL impresso.
5. Escreva as estações no `index.html` (o exemplo mostra gancho, calendário, tela com foco, contador, carimbo, chamada final e loop). Peças que existem no kit não se reescrevem.
6. Storyboard estático para aprovação: `npx --yes hyperframes@0.9.23 snapshot --no-end --at 0.8,3.0,...` (um tempo por estação) e folha com `python3 assets/scripts/folha.py`.
7. Só depois da aprovação do roteiro e do storyboard: `npx --yes hyperframes@0.9.23 check --json` (zero erros) e `npx --yes hyperframes@0.9.23 render -q delivery -w 4 -o render/video.mp4`.
8. Áudio: `node assets/scripts/exportar-sons.cjs` → `mix/sons.json`; escreva `audio/trilha.json` (seções em compassos); `python3 assets/scripts/mix.py`.
9. `bash assets/scripts/encode.sh render/video.mp4 mix/mix_final.wav NN` → `entrega/` com HQ e leve.

`assets/` é cópia da biblioteca: não edite lá. Avisos esperados no check: `film_silent` e `audio_none` (o áudio entra no encode) e `container_overflow` do odômetro.
