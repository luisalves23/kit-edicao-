# Gera data.js do vídeo a partir de audio/palavras.json ([{w,s,e}], do whisper ou do align.py).
# W = [palavra, início, fim]; CH = blocos de legenda (até 3 palavras, quebra na pontuação ou pausa > 0,25 s);
# HIDE vazio (as faixas sem legenda ficam no index.html com KIT.semLegenda); TOTAL = fim da fala + cauda.
# uso (na pasta do projeto): python3 assets/scripts/gerar-data.py [total_em_segundos]
import json, os, sys
P = os.getcwd(); d = json.load(open(os.path.join(P, 'audio', 'palavras.json')))
W = [[x['w'], round(x['s'], 3), round(x['e'], 3)] for x in d]
CH, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append(i); gap = W[i + 1][1] - e if i + 1 < len(W) else 9
    if len(cur) >= 3 or w[-1] in '.,?!:' or gap > .25: CH.append(cur); cur = []
if cur: CH.append(cur)
M = []  # nenhum bloco curto demais: palavra curta sozinha se junta ao anterior
for c in CH:
    if M and len(c) == 1 and len(W[c[0]][0]) <= 4 and len(M[-1]) < 4: M[-1] += c
    else: M.append(c)
TOTAL = float(sys.argv[1]) if len(sys.argv) > 1 else round(W[-1][2] + .7, 2)
with open(os.path.join(P, 'data.js'), 'w') as f:
    f.write('window.W=' + json.dumps(W, ensure_ascii=False) + ';\n')
    f.write('window.CH=' + json.dumps(M) + ';\nwindow.HIDE=[];\n' + f'window.TOTAL={TOTAL};\n')
os.makedirs(os.path.join(P, 'mix'), exist_ok=True); json.dump({'total': TOTAL}, open(os.path.join(P, 'mix', 'total.json'), 'w'))
print(len(W), 'palavras,', len(M), 'blocos, TOTAL', TOTAL, '-> data.js (atualize data-duration do #root para', TOTAL, ')')
for i, (w, s, e) in enumerate(W): print(i, w, s, end=' | ')
