# Gera os efeitos sintetizados da biblioteca (numpy, sem arquivo de terceiros) em audio/sfx/*.wav, 48 kHz mono 16-bit.
# Rodar uma vez; os arquivos ficam na biblioteca. Uso: python3 scripts/sintetizar-sfx.py
import numpy as np, wave, os
SR = 48000; OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio', 'sfx')
rng = np.random.default_rng(5)
def lp1(x, fc):
    fc = np.broadcast_to(np.asarray(fc, np.float32), x.shape); a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y
def nrm(x, pk=.9): return x / (np.abs(x).max() + 1e-9) * pk
def save(n, x):
    with wave.open(os.path.join(OUT, n + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
def key(seed):
    r = np.random.default_rng(seed); n = int(.028 * SR); tt = np.arange(n) / SR; x = r.uniform(-1, 1, n).astype(np.float32); x = x - lp1(x, 1800)
    return nrm(x * np.exp(-tt / .005) * .8 + np.sin(2 * np.pi * (180 + r.uniform(0, 70)) * tt) * np.exp(-tt / .009) * .35)
for i in range(4): save(f'key{i+1}', key(i + 11))                 # 4 variações: o mix alterna para não soar robótico
n = int(.016 * SR); tt = np.arange(n) / SR; save('tick', np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 420))
d = .4; n = int(d * SR); tt = np.arange(n) / SR                    # vibração do celular
x = np.tanh(4 * np.sin(2 * np.pi * 168 * tt)) * (.6 + .4 * np.sin(2 * np.pi * 24 * tt)) + .25 * np.sin(2 * np.pi * 336 * tt)
save('buzz', nrm(lp1((x * np.clip(tt / .01, 0, 1) * np.clip((d - tt) / .03, 0, 1)).astype(np.float32), 1400)))
n = int(.12 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * 1400 * tt) * np.exp(-tt * 140); k = int(.045 * SR)
x[k:] += np.sin(2 * np.pi * 2000 * tt[:n - k]) * np.exp(-tt[:n - k] * 160) * .8; save('unlock', nrm(x))
d = 1.0; n = int(d * SR); tt = np.arange(n) / SR; x = rng.uniform(-1, 1, n).astype(np.float32); x = lp1(x, 5200) - lp1(x, 1400)   # caneta
st = np.clip(np.sin(2 * np.pi * 7.5 * tt + 2 * np.sin(2 * np.pi * 1.3 * tt)), 0, 1) ** .6 * (.7 + .3 * rng.uniform(0, 1, n))
save('scribble', nrm(x * st * np.clip(tt / .02, 0, 1) * np.clip((d - tt) / .05, 0, 1), .7))
n = int(.28 * SR); tt = np.arange(n) / SR; x = rng.uniform(-1, 1, n).astype(np.float32)   # papel/slide passando
save('swish', nrm((lp1(x, 600 + 5000 * np.sin(np.pi * tt / tt[-1])) - lp1(x, 300)) * np.sin(np.pi * tt / tt[-1]) ** 2, .8))
d = 1.2; n = int(d * SR); x = np.zeros(n, np.float32)              # crepitar de fogos (seguir no CTA)
for _ in range(90):
    t0 = int(rng.uniform(0, d - .05) * SR); L = int(rng.uniform(.004, .012) * SR); b = rng.uniform(-1, 1, L).astype(np.float32)
    x[t0:t0 + L] += b * np.exp(-np.arange(L) / (L / 3)) * rng.uniform(.3, 1) * (1 - t0 / n) ** .5
save('crackle', nrm(x - lp1(x, 900), .85))
d = .9; n = int(d * SR); tt = np.arange(n) / SR                    # grilo (silêncio)
ch = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 30 * tt) > 0) * ((tt % .3) < .14)
save('grilo', nrm(ch * np.exp(-((tt % .3) / .1)), .6))
d = .5; n = int(d * SR); tt = np.arange(n) / SR                    # elástico (esticar)
f = 90 + 260 * tt / d; ph = 2 * np.pi * np.cumsum(f) / SR; save('elastico', nrm(np.sin(ph + 3 * np.sin(2 * np.pi * 11 * tt)) * np.sin(np.pi * tt / d), .8))
n = int(.09 * SR); tt = np.arange(n) / SR; x = rng.uniform(-1, 1, n).astype(np.float32)   # tesoura (snip)
save('snip', nrm((x - lp1(x, 3000)) * (np.exp(-tt / .006) + .6 * np.exp(-np.maximum(tt - .05, 0) / .006) * (tt > .05)), .8))
d = .9; n = int(d * SR); tt = np.arange(n) / SR                    # caixa registradora (grátis / dinheiro)
bell = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) * a for f, k, a in ((2093, 4, .6), (2637, 5, .4), (3136, 6, .3)))
x = rng.uniform(-1, 1, n).astype(np.float32); clk = (x - lp1(x, 2500)) * np.exp(-tt / .01) * .8
save('caixa', nrm(bell * (tt > .06) + clk, .85))
print('ok:', sorted(os.listdir(OUT)))
# vidro: tiques de vidro batendo (calendário de Liquid Glass, Dia 6 v2). Três alturas para variar.
for i, f0 in enumerate((2950, 3400, 3900)):
    n = int(.11 * SR); tt = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f0 * r * tt) * np.exp(-tt * k) * a for r, k, a in ((1, 55, .6), (2.76, 90, .35), (5.4, 140, .2), (8.9, 220, .1)))
    nz = rng.uniform(-1, 1, n).astype(np.float32); clk = (nz - lp1(nz, 6000)) * np.exp(-tt / .0025) * .5
    save('vidro%d' % (i + 1), nrm(x + clk, .85))
