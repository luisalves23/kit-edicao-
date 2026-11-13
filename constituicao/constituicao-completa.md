CONSTITUIÇÃO DO COBAIA

Art. 1. Quem manda
O que o criador disser na thread vence esta constituição. Esta constituição vence a skill cobaia-dev-videos, os arquivos soltos e o costume de vídeos anteriores. Em conflito, vale a ordem acima, sem perguntar.

Art. 2. Autorização e perguntas
Não executar nada que o criador não pediu. Pedido novo começa com perguntas e um plano completo. Só criar ou entregar pronto com "executa" ou "me dá pronto". Perguntas sempre em múltipla escolha, uma por vez, usando as respostas anteriores. Nunca perguntar sobre escolha criativa que a pesquisa decide. Vídeo sem aprovação do storyboard só quando o criador avisar antes que vai estar ausente e quer receber pronto.

Art. 3. Conteúdo
Antes de cada roteiro, pesquisar canais grandes de fora (EUA e Europa) sobre o tema e replicar o que comprovadamente viraliza (gancho, estrutura, edição), citando as referências no plano. Gancho sempre do banco de virais com prova de alcance. Se a estrutura lembrar a de um dia anterior, escolher outro. Não repetir exemplos nem apps de vídeos anteriores. O banco de ganchos é atualizado 1x por semana pelo criador no Gemini e no ChatGPT, com prompt pronto para colar em texto. Cada vídeo tem uma checagem curta. Todo roteiro e todo plano de roteiro passa pela skill Humanizer antes de ir para o criador.

Art. 4. Esqueleto fixo do vídeo
Cerca de 60 s, prático, com simulação de telas e o tema no dia a dia da pessoa. A ordem é sempre esta: (1) gancho; (2) vinheta "Dia X de 30" logo em seguida, até os 5 s; (3) miolo prático; (4) chamada final "segue o Cobaia, curte e comenta [PALAVRA]". A chamada final tem sempre o mesmo visual e o mesmo áudio de seguir e curtir, igual em todas as redes. Só a palavra muda. Vídeo sem ela não sai.
Cenas: 12, seguindo o padrão do vídeo que viralizou (decisão do criador em 12/11/2026).

Art. 5. Identidade
Todo card e modal, no vídeo e no site, usa o Liquid Glass de skill/liquid-glass.md. Laranja é reservado ao ícone do Claude. Canal dark: o nome do criador nunca aparece em vídeo, site ou conteúdo público, a menos que ele peça. Personagens em estilo simples, fofo e arredondado, com animação natural; nada hiper-realista.

Art. 6. Biblioteca viva (telas/)
Antes do storyboard, ler o cardápio da biblioteca (telas/LEIAME.md) e reaproveitar tudo o que servir: telas, mockups, ícones, fontes, 3D, Clawd, calendário, vinheta, chamada final, animações e áudios. Peça repetida é adaptada (palavra, dia, cor), nunca refeita. Criar do zero só o que não existir. O storyboard indica, cena por cena, o que veio da biblioteca e o que é novo. Toda peça nova reaproveitável entra em telas/ só depois que o vídeo for aprovado pelo criador, com uma linha no cardápio dizendo o que é e o que dá para trocar. Vídeo não aprovado não manda nada para a biblioteca, e peça que o criador reprovou sai dela.

Art. 7. Áudio
Efeitos e músicas vêm da biblioteca, e todo vídeo pode baixar músicas e efeitos novos de licença livre quando precisar: eles entram em telas/audio/ com crédito em telas/audio/CREDITOS.txt, que diz onde achar (Mixkit direto por assets.mixkit.co/music/<ID>/<ID>.mp3, medido com scripts/medir-musica.py) e como criar efeitos próprios (scripts/sintetizar-sfx2.py). Nada é sintetizado solto dentro de um vídeo. A trilha acompanha a emoção como uma montanha-russa (trechos de faixas diferentes, montados por cena em audio/trilha.json), com muitos efeitos visuais e sonoros. Fugir dos efeitos que todo vídeo feito com IA usa (whoosh, pop, ding, confete): buscar sons e efeitos que causem o mesmo impacto sem ser óbvios. A música não repete a de nenhum dos três vídeos anteriores. Todo roteiro sai pronto para os dois caminhos de voz (gravada pelo criador e IA/ElevenLabs), e o criador escolhe por vídeo.

Art. 8. Produção
Partir sempre do template e da skill cobaia-dev-videos, nunca de código novo nem do pipeline antigo. Projeto em HyperFrames, com checagem e render pelos comandos dele. Quatro portões, cada um com aprovação do criador: roteiro, elementos (personagens, cenário, objetos e telas, aprovados soltos antes de qualquer cena), storyboard estático (imagens) e render. Nunca renderizar amostras ou testes de animação: aprovação é por frames estáticos. Ajustes de cada vídeo juntados numa lista única antes de refazer.
§0. Antes do storyboard, aprovar com o criador todos os elementos do vídeo, um por um: personagens, cenários, objetos e telas, em imagens estáticas. Cena só é montada com elementos aprovados.
§1. Antes de o criador gravar ou gerar o áudio, contar as palavras do roteiro (alvo 190 a 215 para cerca de 58 s) e conferir gancho, vinheta logo após o gancho, chamada final com a palavra e música diferente. Nada disso vai ao criador sem passar.
§2. Em ajuste de vídeo já aprovado, renderizar só as cenas alteradas e remontar, nunca o vídeo inteiro.
§3. A conferência do render usa de 6 a 8 quadros-chave por cena mudada, não o vídeo todo.
§4. Ao gerar os quadros do storyboard, mostrar no chat da própria thread (sem aba ou painel separado) uma barra de progresso em caracteres com o total de quadros, os concluídos e a estimativa em minutos do que falta, atualizada a cada 1% concluído (ou a cada quadro, o que vier antes). Ex.: [████████░░░░░░░░] 16/46 quadros · faltam ~6 min
§5. Ao renderizar um vídeo, mostrar a mesma barra de progresso no chat da thread, atualizada a cada 1% durante todo o render, com o percentual pronto e uma estimativa realista em minutos do que falta (calculada pelo ritmo real do render, não chutada).
§6. Toda correção de vídeo pedida pelo criador também mostra a barra de progresso no chat, atualizada a cada 1% (nunca só por etapa; etapa longa é medida por dentro, por quadro ou por segundo de áudio), com estimativa realista em minutos até a entrega. Barra que fica parada é falha.
§7. Na voz, nunca cortar nem inserir silêncio no meio de uma frase: para alongar, desacelerar o trecho inteiro (do início ao fim das palavras); para encurtar, acelerar. Cortes só em pausa real entre frases, conferida no áudio.

Art. 9. Checagem interna
Antes de mostrar o storyboard e antes de entregar o vídeo, conferir sem mostrar ao criador: gancho do banco; vinheta logo após o gancho; duração ~60 s (checada pela contagem de palavras antes do storyboard e de novo no render); chamada final padrão com seguir, curtir e a palavra; peças do cardápio usadas e as novas devolvidas; Liquid Glass; laranja só no Claude; sem o nome do criador; música diferente dos 3 anteriores; site atualizado. Se um item falhar, não entregar, corrigir e avisar o criador qual falhou. Conferir também se o vídeo tem 12 cenas.

Art. 10. Entrega e economia
Sempre que um vídeo for criado ou editado, atualizar junto o site https://cobaia-dev.vercel.app (repo cobaia-site, publica sozinho pela Vercel): página da palavra-chave e calendário. /30-dias é o link da bio. Quem comenta recebe o link à mão, enviado pelo criador. A automação ficou de lado, e o plano está no documento "Plano: link do guia por comentário". PDF ou ebook só quando o criador pedir. Textos de postagem do dia (legendas das 3 redes, comentário fixado e DM) saem num único pedido. Vídeo final na qualidade das redes salvo em C:\Users\usuário\cobaia\diaXX\ até o fim dos 30 dias. Postagem de um vídeo por dia às 12h (Dia 4 em 09/11/2026). Modelo por complexidade, também para subagentes: Haiku (claude-haiku-5-5) para coisas simples (resumos, legendas, hashtags, comentários, DMs, textos de postagem, organização de arquivos, passo a passo, recorte de áudio e reajuste de tempos), Sonnet (claude-sonnet-5-5) para nível intermediário (pesquisa, páginas do site, ajustes pontuais), Opus (claude-opus-5-5) só para roteiro, edição/render e estratégia. Uma tarefa por thread, encerrada ao terminar. Não duplicar arquivos em várias pastas. Toda resposta ao criador termina com "Pendente:" listando o que espera ação dele em qualquer thread.
§1. Só estimar custo ou tempo quando o criador pedir.
§2. Proposta de atualização da skill sai só como edições (diff) de poucas linhas. Conteúdo grande fica em arquivo na pasta skill/, nunca colado inteiro na mensagem.
§3. Status e checklist não se repetem em mensagem separada.
§4. Thread com mais de 60 mensagens: abrir uma nova só para o ajuste, com o contexto num arquivo curto.

Art. 11. Emendas
Uma vez por semana, junto com a atualização do banco de ganchos, as lições dos vídeos da semana e a limpeza da biblioteca (juntar repetidos, marcar o que ninguém usa) viram uma proposta única de emenda. Só entra o que o criador aprovar.
