# Mix padrão do @cobaia.dev: voz + trilha remontada em compassos + efeitos da biblioteca.
# uso (dentro do projeto do vídeo): python3 assets/scripts/mix.py [pasta-do-projeto]
# lê:   audio/voz_editada.wav            voz tratada e cortada
#       audio/trilha.json                {"arquivo":"cat-walk-mixkit-371.mp3","bpm":130,"offset":0,
#                                          "secoes":[{"nome":"drop","compassos":[16,17,18,19],"db":0}, ...],
#                                          "tape_stop":[20.31], "silencio":[[a,b,-20]]}   (sem "secoes": a faixa toca do início)
#       mix/sons.json                    lista [nome, tempo, dB, (duração)] exportada da página (window.SFX)
# usa:  assets/audio/musica/* e assets/audio/sfx/*.wav (copiados da biblioteca por biblioteca.cjs)
# grava: mix/mix_final.wav (-14 LUFS, pico -1,2 dBTP) e imprime o nível da música segundo a segundo.
import numpy as np, wave, json, subprocess, os, sys
P = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
SR = 48000; A = os.path.join(P, 'assets', 'audio')
def rd(f, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    return a.reshape(-1, ch).T if ch > 1 else a
def nrm(x, pk=.9): return x / (np.abs(x).max() + 1e-9) * pk

voice = rd(os.path.join(P, 'audio', 'voz_editada.wav'))
TOT = float(json.load(open(os.path.join(P, 'mix', 'total.json')))['total']) if os.path.exists(os.path.join(P, 'mix', 'total.json')) else len(voice) / SR
N = int(TOT * SR); v = np.zeros(N, np.float32); v[:min(N, len(voice))] = voice[:N]; voice = v

# ---------- trilha ----------
cfg = json.load(open(os.path.join(P, 'audio', 'trilha.json')))
# modo montanha-russa: "segmentos" monta a trilha com trechos de várias faixas, cada um no tempo do vídeo:
#   {"faixas":{"A":"x.mp3","B":"y.mp3"},"segmentos":[{"faixa":"A","de":0,"ate":11.5,"src":15.07,"db":0,"fade":.15}, ...]}
if cfg.get('segmentos'):
    fx_ = {k: rd(os.path.join(A, 'musica', v), 2) for k, v in cfg['faixas'].items()}
    mus = np.zeros((2, N), np.float32); marks = []
    for sg in cfg['segmentos']:
        a0, a1 = int(sg['de'] * SR), min(N, int(sg['ate'] * SR)); s0 = int(sg['src'] * SR); src = fx_[sg['faixa']]
        L = min(a1 - a0, src.shape[1] - s0); seg = src[:, s0:s0 + L].copy() * 10 ** (sg.get('db', 0) / 20)
        f = int(sg.get('fade', .1) * SR); f = min(f, L // 2)
        if f: seg[:, :f] *= np.linspace(0, 1, f); seg[:, -f:] *= np.linspace(1, 0, f)
        mus[:, a0:a0 + L] += seg; marks.append((sg['de'], sg['faixa']))
else:
    m = rd(os.path.join(A, 'musica', cfg['arquivo']), 2); BAR = 4 * 60 / cfg.get('bpm', 128); off = cfg.get('offset', 0)
    mus = np.zeros((2, N + int(8 * BAR * SR)), np.float32); pos = 0; marks = []
    def put(seg, db, nome):
        global pos
        xf = int(.012 * SR); seg = seg * 10 ** (db / 20); seg[:, :xf] *= np.linspace(0, 1, xf); seg[:, -xf:] *= np.linspace(1, 0, xf)
        mus[:, pos:pos + seg.shape[1]] += seg; marks.append((round(pos / SR, 2), nome)); pos += seg.shape[1]
    if cfg.get('secoes'):
        for s in cfg['secoes']:
            for b in s['compassos']:
                a0 = int(round((off + b * BAR) * SR)); put(m[:, a0:a0 + int(round(BAR * SR))].copy(), s.get('db', 0), f"{s['nome']} {b}")
    nb = int((m.shape[1] / SR - off) // BAR); b = (cfg['secoes'][-1]['compassos'][-1] + 1) if cfg.get('secoes') else 0
    while pos < N:  # completa até o fim seguindo os compassos seguintes: a música nunca acaba antes do vídeo
        b = b if b < nb else 8; a0 = int(round((off + b * BAR) * SR)); put(m[:, a0:a0 + int(round(BAR * SR))].copy(), 0, f'continua {b}'); b += 1
    mus = mus[:, :N]
for t1 in cfg.get('tape_stop', []):  # tape stop terminando em t1
    a0, a1 = int((t1 - .4) * SR), int(t1 * SR); r = np.cumsum(np.linspace(1, .04, a1 - a0))
    for c in range(2): mus[c, a0:a1] = np.interp(a0 + r, np.arange(N), mus[c]) * np.linspace(1, .15, a1 - a0) ** .5
for a, b, db in cfg.get('silencio', []):  # automação: -20 dB em silêncio dramático, -10 dB em tensão
    g = np.ones(N, np.float32); i0, i1 = int(a * SR), int(b * SR); f = int(.08 * SR)
    g[i0:i1] = 10 ** (db / 20); g[max(0, i0 - f):i0] = np.linspace(1, 10 ** (db / 20), i0 - max(0, i0 - f)); mus *= g

# ---------- níveis e ducking (voz ~17 dB acima da música) ----------
sp = voice[np.abs(voice) > .02]; vr = np.sqrt(np.mean(sp ** 2)) if len(sp) else .1
mr = np.sqrt(np.mean(mus ** 2)) + 1e-9; mus *= vr / mr * 10 ** (-11 / 20)
h = 480; env = np.array([np.sqrt(np.mean(voice[i:i + h] ** 2)) for i in range(0, N, h)]); env = np.clip(env / vr, 0, 1)
sm = np.zeros_like(env); x = 0
for i, e in enumerate(env): c = 1 - np.exp(-.01 / (.02 if e > x else .28)); x += c * (e - x); sm[i] = x
mus *= 1 - .55 * np.repeat(sm, h)[:N]
fi, fo = int(.2 * SR), int(.9 * SR); mus[:, :fi] *= np.linspace(0, 1, fi); mus[:, -fo:] *= np.linspace(1, 0, fo)

# ---------- efeitos ----------
fx = np.zeros(N, np.float32); cache = {}; kn = [0]; faltam = set()
def lib(n):
    if n == 'key': kn[0] = kn[0] % 4 + 1; n = f'key{kn[0]}'
    if n not in cache:
        f = os.path.join(A, 'sfx', n + '.wav')
        if not os.path.exists(f): faltam.add(n); return None
        cache[n] = nrm(rd(f))
    return cache[n]
for e in json.load(open(os.path.join(P, 'mix', 'sons.json'))):
    x = lib(e[0]); i = int(e[1] * SR)
    if x is None or i < 0 or i >= N: continue
    if len(e) > 3 and e[3]: x = x[:int(e[3] * SR)]
    L = min(len(x), N - i); fx[i:i + L] += x[:L] * 10 ** (e[2] / 20)
if faltam: print('ATENÇÃO, sons fora da biblioteca:', sorted(faltam))

# ---------- master ----------
mix = np.stack([voice + fx, voice + fx]) + mus; mix /= max(1, np.abs(mix).max() / .98)
pre = os.path.join(P, 'mix', 'mix_pre.wav')
with wave.open(pre, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype(np.int16).tobytes())
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
af = f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(P, 'mix', 'mix_final.wav')])
g = 10 ** ((-14 - float(j['input_i'])) / 20)
mm = [20 * np.log10(np.sqrt(np.mean((mus[:, i:i + SR] * g) ** 2)) + 1e-9) for i in range(0, N - SR // 2, SR)]
print('música dBFS/s:', ' '.join(f'{i}:{x:.0f}' for i, x in enumerate(mm)))
print('trechos sem música (< -40 dBFS):', [i for i, x in enumerate(mm) if x < -40] or 'nenhum')
print('marcas:', marks[:40])
