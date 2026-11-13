# Série 2 de efeitos sintetizados (Dia 6): sons menos batidos que o whoosh/pop de sempre.
# numpy puro, sem arquivo de terceiros. Uso: python3 scripts/sintetizar-sfx2.py  -> audio/sfx/*.wav (48 kHz mono)
import numpy as np, wave, os
SR = 48000; OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio', 'sfx')
rng = np.random.default_rng(62)
def t(d): return np.arange(int(d * SR)) / SR
def lp(x, a):  # passa-baixa de 1 polo (a perto de 1 = mais escuro)
    y = np.zeros_like(x); s = 0.
    for i, v in enumerate(x): s = a * s + (1 - a) * v; y[i] = s
    return y
def sweep(f0, f1, d, curve=1.):
    tt = t(d); f = f0 + (f1 - f0) * (tt / d) ** curve; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def env(d, a=.005, r=None):
    n = int(d * SR); e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-t(d) / r)
    return e
def save(n, x):
    x = x / (np.abs(x).max() + 1e-9) * .9; fo = int(.004 * SR); x[-fo:] *= np.linspace(1, 0, fo)
    with wave.open(os.path.join(OUT, n + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
# sub_drop: grave que despenca, para viradas (sem o "boom" de trailer)
save('sub_drop', sweep(70, 28, .9, .6) * env(.9, .002, .35) + .3 * rng.standard_normal(int(.9 * SR)) * env(.9, .001, .01))
# power_down: tela antiga desligando (tom que cai e some), para o Windows fechando
d = .7; x = sweep(520, 35, d, .5); x = np.sign(x) * np.abs(x) ** .5; save('power_down', lp(x, .92) * (1 - t(d) / d) ** 1.5)
# reverse_swell: ruído reverso que cresce e corta seco, antes de uma revelação
d = 1.1; n = lp(rng.standard_normal(int(d * SR)), .85) * np.exp(-t(d) / .3); save('reverse_swell', n[::-1] * np.linspace(.2, 1, len(n)))
# glass_chime: dois toques de vidro inarmônicos, para o seguir ✓
x = np.zeros(int(.9 * SR))
for k, f in enumerate([1318, 1975]):
    o = int(k * .09 * SR); tt = np.arange(len(x) - o) / SR
    x[o:] += sum(a * np.sin(2 * np.pi * f * m * tt) for a, m in [(1, 1), (.4, 2.76), (.2, 5.4)]) * np.exp(-tt / .25)
save('glass_chime', x)
# bloom: brilho macio que sobe, para o coração ficando vermelho
d = .45; save('bloom', (sweep(320, 980, d, .7) * .7 + .3 * sweep(640, 1960, d, .7)) * np.sin(np.pi * t(d) / d) ** 1.5)
# air_send: ar subindo filtrado, para o envio do comentário
d = .45; nz = rng.standard_normal(int(d * SR)); a = np.linspace(.97, .55, len(nz)); y = np.zeros_like(nz); s = 0.
for i, v in enumerate(nz): s = a[i] * s + (1 - a[i]) * v; y[i] = s
save('air_send', (nz - y) * .3 * np.sin(np.pi * t(d) / d) + y * np.sin(np.pi * t(d) / d))
# tick_wood: tique seco de madeira, para contadores e checagens
d = .06; tt = t(d); save('tick_wood', (np.sin(2 * np.pi * 1800 * tt) + .5 * np.sin(2 * np.pi * 3100 * tt)) * np.exp(-tt / .008))
# data_chirp: três chilreios de dados rápidos, para linhas de diagnóstico
x = np.zeros(int(.3 * SR))
for k in range(3):
    o = int(k * .08 * SR); c = sweep(1200 + 400 * k, 2600 + 400 * k, .05) * env(.05, .002, .02); x[o:o + len(c)] += c
save('data_chirp', x)
# thud_dark: baque abafado, para tensão e falha
d = .5; tt = t(d); save('thud_dark', lp(np.sin(2 * np.pi * 55 * tt) * np.exp(-tt / .12) + .4 * rng.standard_normal(len(tt)) * np.exp(-tt / .02), .7))
# shimmer_up: arpejo de senos subindo, para o sistema novo aparecendo
x = np.zeros(int(1.0 * SR))
for k, f in enumerate([523, 659, 784, 1046, 1318, 1568]):
    o = int(k * .07 * SR); tt = np.arange(len(x) - o) / SR; x[o:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt / .35) * (1 - .08 * k)
save('shimmer_up', x)
# tape_whirl: rotação de fita acelerando, para transições de câmera
d = .5; x = sweep(80, 900, d, 2.) * .6 + .4 * lp(rng.standard_normal(int(d * SR)), .6); save('tape_whirl', x * np.sin(np.pi * t(d) / d))
print('ok')
