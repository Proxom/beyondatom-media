# Original bed for "What If You Grew 1 cm Every Second?" (grow-1cm, 32.5 s). Warm pad that climbs (C -> F -> Am -> G -> F -> C) as the
# person grows, a slow rising filter sweep, sub swell when we reach space, soft low whooshes and felt thumps on each milestone
# (1 min 4.0 s, 1 h 7.0 s, 1 day 10.0 s, Everest 17.3 s, ISS 20.3 s, 80 years 26.4 s). Nothing bright: sources < ~1.2 kHz before the low-pass.
# usage: python3 grow-1cm.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 32.5; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(71)
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
def pad(freqs, t0, t1, amp, fc=650):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .8) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad progression, opening up (higher cutoff) as we grow
P = pad([130.81, 196.0, 261.63], 0, 5.6, .045, 500) + pad([174.61, 220.0, 261.63], 5.0, 11.9, .045, 600)
P += pad([110.0, 220.0, 261.63, 329.63], 11.3, 17.8, .045, 650) + pad([98.0, 196.0, 246.94, 293.66], 17.2, 24.0, .045, 750)
P += pad([87.31, 174.61, 220.0, 261.63], 23.4, 29.6, .045, 800) + pad([130.81, 196.0, 261.63], 29.0, D, .045, 600)
add(P, -.3); add(np.roll(P, 1100), .3)
# 2. pulse: soft low plucks on C, eighth notes at 100 bpm, from 3 s to 29.6 s (gives the "growing" momentum)
beat = 60 / 100 / 2
for i, tb in enumerate(np.arange(3.0, 29.6, beat)):
    f = [65.41, 65.41, 98.0, 65.41][i % 4]; n = int(.35 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (.06 + .03 * (tb / 30))
    add(lp(s, 500), 0, int(tb * SR))
# 3. sub swell into space
da = env([(0, .25), (17.0, .25), (20.3, .6), (26.4, .75), (29.6, .4), (D, .25)])
for m, a in [(1, .22), (2, .14)]:
    add(da * a * np.sin(2 * np.pi * 32.70 * m * t + m), 0)
# 4. soft low whooshes into milestones (band-limited noise 70-900 Hz)
def whoosh(tc, dur, amp, pan):
    n = int(dur * SR); tt = np.arange(n) / SR; s = bp(rng.standard_normal(n), 70, 900)
    e = (np.clip(tt / dur, 0, 1) ** 2) * np.exp(-np.clip(tt - dur * .85, 0, None) / .08); add(s * e * amp, pan, int(max(0, tc - dur * .85) * SR))
for tc, p in [(4.0, -.3), (7.0, .3), (10.0, -.2), (17.3, .2), (20.3, -.3), (26.4, .3)]:
    whoosh(tc, 1.4, .06, p)
# 5. felt thumps (sine drop 90->40 Hz) on milestones
def thump(t0, amp):
    n = int(.8 * SR); tt = np.arange(n) / SR; f = 40 + 50 * np.exp(-tt / .06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .25); add(lp(s, 400) * amp, 0, int(t0 * SR))
for t0 in (4.0, 7.0, 10.0, 17.3, 20.3, 26.4): thump(t0, .3)
m = np.stack([L, R], 1); m /= np.max(np.abs(m)) / .5
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
