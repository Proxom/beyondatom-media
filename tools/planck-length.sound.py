# Original bed for "How Small Can Things Get?" (planck-length, 37.0 s). Warm low pad that climbs a step at every zoom stop,
# low-passed whooshes on each dive with a soft sub thump on arrival, a long rising roar for the 20-zoom dive into the void
# (17.8-23.6 s), a deep boom on arrival at the Planck length, then a suspended, quiet pad. No beeps or bright tones;
# everything below ~1.1 kHz before the master low-pass.  usage: python3 planck-length.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 37.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(1616)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .7) * np.minimum(1, (tt[-1] - tt) / .7)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad: Am -> F -> C -> G (one step per stop) ... void: drone only ... Planck: suspended Asus2
P = pad([110.0, 130.81, 164.81], 0, 6.3, .05) + pad([87.31, 110.0, 130.81], 5.9, 10.7, .05, 650)
P += pad([130.81, 164.81, 196.0], 10.3, 14.4, .05, 700) + pad([98.0, 123.47, 146.83], 14.0, 18.6, .055, 750)
P += pad([110.0, 123.47, 164.81], 23.4, D, .045, 600)
add(P, -.25); add(np.roll(P, 1100), .25)
# 2. sub drone A (55 Hz) that swells in the void
da = env([(0, .3), (14, .35), (17.8, .4), (23.4, .9), (23.8, .45), (35, .35), (37, .3)])
for m, a in [(1, .45), (2, .3), (3, .08)]:
    add(da * a * np.sin(2 * np.pi * 55.0 * m * t + m), 0)
# 3. whooshes on the dives (low-passed noise, band opens with the speed)
def whoosh(t0, t1, amp, f0=250, f1=900):
    n0, n1 = int(t0 * SR), int(t1 * SR); n = n1 - n0; tt = np.linspace(0, 1, n)
    e = np.sin(np.pi * tt) ** 1.5; lo = lp(rng.standard_normal(n), f0) * 4; hi = lp(rng.standard_normal(n), f1) * 1.8
    s = (lo + hi * tt) * e * amp; add(s, -.2, n0); add(np.roll(s, 700), .2, n0)
for a, b in [(2.0, 5.9), (6.9, 8.5), (9.6, 10.4), (11.8, 12.5), (13.4, 14.1)]:
    whoosh(a - .1, b + .15, .45 if b - a > 1 else .35)
# 4. the void dive: long roar that builds and opens up, cut by the arrival boom
ra = env([(0, 0), (17.6, 0), (19.0, .35), (22.8, 1.0), (23.55, 1.1), (23.8, .05), (25, 0), (37, 0)])
mixb = env([(0, 0), (17.6, 0), (23.5, 1), (23.8, 0), (37, 0)])
for pan in (-.2, .2):
    add((lp(rng.standard_normal(N), 260) * 5 + lp(rng.standard_normal(N), 1000) * 2.2 * mixb) * ra * .55, pan)
mod = 1 + .3 * np.sin(2 * np.pi * 3.0 * t * env([(0, 1), (17.8, 1), (23.6, 3.5), (37, 3.5)]) )
add(lp(rng.standard_normal(N), 120) * 6 * ra * mod * .4, 0)
# 5. impacts: hook, every stop arrival (soft), Planck arrival (big), loop
def boom(t0, amp, f0=80, f1=32, dur=2.0, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 240) * 3 * np.exp(-tt / .1)
    add(s * amp, pan, int(t0 * SR))
boom(0.0, .55)
for tb in (5.9, 8.5, 10.4, 12.5, 14.1):
    boom(tb - .05, .32, 70, 40, 1.2)
boom(23.6, 1.0, 90, 28, 3.0); boom(36.6, .35, 70, 40, 1.0)
# 6. Planck shimmer replacement: slow low "breathing" noise, no highs
br = env([(0, 0), (23.8, 0), (25, .25), (35, .25), (37, .1)]) * (1 + .5 * np.sin(2 * np.pi * .35 * t))
add(lp(rng.standard_normal(N), 500) * 2.2 * br * .5, -.35); add(lp(rng.standard_normal(N), 500) * 2.2 * br * .5, .35)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
