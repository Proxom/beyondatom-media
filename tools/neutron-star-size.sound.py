# Original bed for "How Big Is a Neutron Star?" (neutron-star-size, 29.0 s). Adapted from escape-four-worlds.sound.py: low pad, soft pulse during the shrink, thump on the 20 km arrival and the mountain landing. Warm low pad (D minor -> Bb -> F -> C), a soft low pulse while
# the balls fly that tightens toward Pluto's landing, felt-mallet thumps on each landing (Earth 1.38, Mars 3.74,
# Moon 8.69, Pluto 22.77 s), a slow swell into the Pluto landing, a low whoosh on the loop cut and the wind-up.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 throw-four-worlds.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 29.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(311)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
LAND = [8.6, 9.9, 22.85, 12.3]   # Earth size, Moon size, mountain lands; 20 km arrival
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .6)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([146.83, 174.61, 220.0], 0, 6.6, .05) + pad([116.54, 146.83, 174.61], 6.2, 12.6, .05)
P += pad([130.81, 164.81, 196.0, 261.63], 12.2, 20.6, .055, 850) + pad([130.81, 174.61, 220.0], 20.2, 26.2, .045, 650)
P += pad([146.83, 174.61, 220.0], 25.8, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
da = env([(0, .35), (6, .4), (12.2, .7), (13.5, .4), (22.8, .55), (24, .35), (29, .35)])
for m, a in [(1, .5), (2, .22), (3, .08)]:
    add(da * a * np.sin(2 * np.pi * 73.42 * m * t + m), 0)
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
tb, k = 6.0, 0
while tb < 12.0 - .05:
    pluck(tb, 293.66 if k % 2 == 0 else 220.0, .14, -.3 if k % 2 else .3)
    per = .5 - .3 * min(1, max(0, (tb - 6.0) / 6.3)); tb += per; k += 1
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(8.6, .3, pan=-.3); thump(9.9, .3, pan=.3); thump(12.0, .9, 110, 38, 2.0, 0); thump(12.012, .5, 95, 42, 1.8, -.2)
thump(22.85, .8, 90, 40, 1.8, .3); thump(20.25, .35, 120, 60, .6, -.3)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(28.45, .45); whoosh(6.4, .35, 1.2); whoosh(20.1, .35, .8); whoosh(25.7, .3, .8)
sw = np.zeros(N); n0, n1 = int(7.0 * SR), int(12.0 * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .55)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
