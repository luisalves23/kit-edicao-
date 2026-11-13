# Lições do Dia 4 para incluir na skill cobaia-dev-videos (atualizar quando a cota voltar)

- Vídeo com no máximo 60 s; pelo menos 3 elementos novos de viralização por vídeo; vigiar a cota de tokens.
- Voz: editar por trechos explícitos. Limiar de energia relativo ao ruído (-32 dB quando o fundo está em ~-40 dB).
  O fim de cada frase vem do envelope de energia, não do fim da palavra do Whisper: sílabas finais fracas
  ("grá-tis", "impor-tam", "ou-tro") somem com limiar -26 e a fala fica ininteligível.
- Não comprimir pausas de vírgula em listas ("Mais, conectores, conta do Google" virou "conector desconta").
- Conferir sempre por nova transcrição com prompt neutro (prompt contendo a frase faz o Whisper pular a frase).
- Aceleração até ~1,18x em gravação limpa; se não couber, cortar frase de enchimento ("A resposta é") em vez de acelerar mais.
- Regravação parcial: manter a voz aprovada até o ponto de troca e anexar a parte nova, cada parte em -16 LUFS.
- Desenho: nada que lembre forma fálica (nada de dedo solitário com unha). Mão = mão aberta, cinco dedos, sem unhas.
- Final em loop: a última estação repete a primeira, primeiro e último quadro iguais.
- Quando a thread atinge 24 anexos, mandar os arquivos como link por caminho.
- o criador ausente pedindo o vídeo pronto: pode pular a aprovação de storyboard.
- Se o criador pedir, desligar o PC dele ao terminar a edição.

# Lições do Dia 5 (mesma atualização pendente da skill)

- Pedido do criador: glitch sempre em NEON (cópias deslocadas e barras em ciano #00F0FF e magenta #FF2BD6, com brilho),
  nunca nas mesmas cores das letras (vermelho e off-white), senão o glitch se confunde com a fonte e parece texto riscado.
- A classe .tile é do calendário (128x96): não usar "tile" em outros elementos.
- Retomada do dia anterior só entra onde o criador fala dela no áudio (Dia 5: "Os conectores de ontem?" e "essa tomada aqui").
- Conferência da voz no mix final: se a transcrição longa cortar uma sílaba, conferir numa janela curta antes de mexer no mix.
