# Original bed for "What Happens If You Cry in Space?" (29.2 s). Soft, tender low pad (D minor -> Bb -> F -> C), low muted
# "drop" thumps when the two Earth tears fall, soft whooshes on the cuts, a slow swell while the water ball grows,
# a warm low hit on "Tears don't fall". No beeps, chimes, plinks or bright tones (all below ~1.5 kHz before the low-pass).
# usage: python3 cry-in-space.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 29.2; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(77)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .6)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([73.42, 146.83, 174.61, 220.0], 0, 5.8, .05, 700) + pad([58.27, 116.54, 146.83, 174.61], 5.5, 11.6, .05, 700)
P += pad([87.31, 130.81, 174.61, 220.0], 11.3, 16.9, .05, 800) + pad([65.41, 130.81, 164.81, 196.0], 16.6, 22.9, .055, 850)
P += pad([73.42, 146.83, 174.61, 220.0], 22.6, D, .055, 750)
add(P, -.25); add(np.roll(P, 1100), .25)
da = env([(0, .3), (5.6, .35), (11.3, .3), (16.6, .35), (22.6, .75), (24.5, .4), (29.2, .3)])
for m, a in [(1, .5), (2, .2), (3, .07)]:
    add(da * a * np.sin(2 * np.pi * 36.71 * m * t + m), 0)
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(4.4, .35, 120, 60, .8, .2); thump(5.3, .3, 115, 58, .8, .25)
thump(22.7, .85, 90, 36, 2.4, -.1); thump(22.71, .6, 85, 38, 2.4, .2)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
for c in (2.3, 5.6, 11.3, 16.6): whoosh(c, .3, .7)
whoosh(28.85, .35, .7)
sw = np.zeros(N); n0, n1 = int(16.8 * SR), int(22.6 * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 150 + 400 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.0; add(sw * .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
