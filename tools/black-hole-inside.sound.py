# Original bed for "What's Really Inside a Black Hole?" (black-hole-inside, 37.4 s). Dark low pad in D minor, sub drone that
# swells on "not even light" and sinks on "crushed into one point", soft low whooshes on cuts, felt thumps on the
# real-image reveal, the mass counter and the event horizon. Nothing bright: all sources < ~1 kHz before the low-pass.
# usage: python3 black-hole-inside.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 37.4; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(66)
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
def pad(freqs, t0, t1, amp, fc=600):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .9) * np.minimum(1, (tt[-1] - tt) / .9)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad: Dm -> Bb -> Gm -> A (tension) -> Dm, dark and slow
P = pad([146.83, 174.61, 220.0], 0, 4.2, .05) + pad([116.54, 174.61, 233.08], 3.6, 14.8, .045, 700)
P += pad([98.0, 146.83, 233.08], 14.2, 20.8, .05) + pad([110.0, 164.81, 277.18], 20.2, 28.8, .05, 500)
P += pad([116.54, 146.83, 174.61], 28.2, 34.8, .045) + pad([146.83, 174.61, 220.0], 34.2, D, .05)
add(P, -.3); add(np.roll(P, 1300), .3)
# 2. sub drone on D (36.7 / 73.4 Hz)
da = env([(0, .45), (14.4, .45), (17.6, .8), (20.4, .5), (22.4, .55), (28.4, .9), (31.0, .5), (34.4, .45), (37.4, .45)])
for m, a in [(1, .30), (2, .22), (3, .05)]:
    add(da * a * np.sin(2 * np.pi * 36.71 * m * t + m), 0)
# 3. soft low whooshes on cuts (band-limited noise 70-800 Hz)
def whoosh(tc, dur, amp, pan):
    n = int(dur * SR); tt = np.arange(n) / SR; s = bp(rng.standard_normal(n), 70, 800)
    e = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 2; add(s * e * amp, pan, int(max(0, tc - dur * .6) * SR))
for tc, p in [(3.7, -.3), (8.0, .3), (14.4, -.2), (20.4, .2), (28.4, -.3), (34.4, .3)]:
    whoosh(tc, 1.0, .05, p)
whoosh(22.6, 5.6, .045, 0)   # long slow suck-in during the push into the shadow
# 4. felt thumps (sine drop 90->40 Hz)
def thump(t0, amp):
    n = int(.8 * SR); tt = np.arange(n) / SR; f = 40 + 50 * np.exp(-tt / .06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .25); add(lp(s, 400) * amp, 0, int(t0 * SR))
thump(3.9, .35); thump(12.9, .35); thump(17.6, .3); thump(31.3, .3)
m = np.stack([L, R], 1); m /= np.max(np.abs(m)) / .5
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
