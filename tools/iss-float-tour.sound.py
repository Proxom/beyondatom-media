# Original bed for "How Fast Is This Room Moving?" (iss-float-tour, 27.2 s). Warm low pad that drifts (floating feel), sub drone,
# soft low whooshes on the cuts, a slow swell into the window reveal (18.6 s) and a felt thump on "8 km every second".
# No beeps, chimes or bright tones: all sources sit below ~1.5 kHz before the master low-pass.  usage: python3 iss-float-tour.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 27.2; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(55)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= ((f > lo) & (f < hi)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .8) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad: Dmaj9-ish drifting chords, brighter (still < 1 kHz) at the window
P = pad([146.83, 220.0, 277.18], 0, 7.4, .045) + pad([123.47, 185.0, 293.66], 7.0, 12.4, .045)
P += pad([110.0, 164.81, 246.94, 277.18], 12.0, 18.9, .045) + pad([146.83, 220.0, 293.66, 369.99], 18.4, 25.6, .06, 900)
P += pad([146.83, 220.0, 277.18], 25.2, D, .045)
add(P, -.3); add(np.roll(P, 1100), .3)
# 2. sub drone on D (73.4 Hz) with a swell into the reveal
da = env([(0, .3), (16.4, .35), (18.6, .75), (22.5, .55), (25.2, .35), (27.2, .3)])
for m, a in [(1, .35), (2, .15), (3, .05)]:
    add(da * a * np.sin(2 * np.pi * 73.42 * m * t + m), 0)
# 3. soft low whooshes on the cuts (band-limited noise, 80-900 Hz)
def whoosh(tc, dur, amp, pan):
    n = int(dur * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n); s = bp(nz, 80, 900)
    e = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 2; add(s * e * amp, pan, int(max(0, tc - dur * .6) * SR))
for tc, p in [(3.2, -.4), (7.0, .4), (8.8, -.3), (12.0, .3), (16.4, -.2), (25.2, .2)]:
    whoosh(tc, .9, .05, p)
whoosh(18.6, 2.6, .07, 0)
# 4. felt thump (sine drop, 90->45 Hz) on the 8 km card and the 90-minute card
def thump(t0, amp):
    n = int(.7 * SR); tt = np.arange(n) / SR; f = 45 + 45 * np.exp(-tt / .06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .22); add(lp(s, 400) * amp, 0, int(t0 * SR))
thump(18.8, .35); thump(22.55, .25)
m = np.stack([L, R], 1); m = lp(m.T, 7000).T if False else m
m /= np.max(np.abs(m)) / .5
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
