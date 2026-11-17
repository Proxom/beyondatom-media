# Original bed for "How Many Launches to Land Starship on the Moon?" (starship-launches, 36.5 s). Low rumble for the twin liftoff,
# a warm pad (Dm -> Bb -> F -> C), a soft low pulse that speeds up with the tanker count, felt thumps on each docking, low whooshes on
# cuts, a sub swell for the lander and the payoff. Nothing bright: sources < ~1.2 kHz before the low-pass.
# usage: python3 starship-launches.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 36.5; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(13)
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
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. liftoff rumble (0-6 s, already loud at frame 0) + quieter rumble when the lander leaves (29.5-31.6)
rum = lp(rng.standard_normal(N), 160, 3) * env([(0, .55), (5.4, .45), (6.1, 0), (29.9, 0), (30.4, .35), (32.0, .3), (32.4, 0), (D, 0)])
add(rum * 3.0, -.2); add(np.roll(rum, 900) * 3.0, .2)
# 2. pad progression
P = pad([146.83, 220.0, 293.66], 0, 6.3, .04, 450) + pad([116.54, 233.08, 293.66], 5.8, 10.3, .045, 550)
P += pad([87.31, 174.61, 220.0, 261.63], 9.8, 21.5, .045, 650) + pad([130.81, 196.0, 261.63], 21.0, 28.6, .045, 600)
P += pad([87.31, 174.61, 220.0, 261.63], 28.1, 32.5, .045, 700) + pad([146.83, 220.0, 293.66], 32.0, D, .05, 600)
add(P, -.3); add(np.roll(P, 1100), .3)
# 3. pulse: soft low plucks, speeding up with the tanker count (10-21 s) then steady
tb = 0.5; i = 0
while tb < 34.5:
    f = [73.42, 73.42, 110.0, 73.42][i % 4]; n = int(.35 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .11) * .07
    add(lp(s, 500), 0, int(tb * SR)); i += 1
    tb += 0.3 if tb < 10 else (0.3 - 0.12 * min(1, (tb - 10) / 10) if tb < 21.2 else 0.3)
# 4. felt thumps on each docking + the counter steps
TK = [12.6]
for g in [2.0, 1.4, 1.0, .75, .6, .5, .45, .42, .4, .4]: TK.append(TK[-1] + g)
def thump(t0, amp):
    n = int(.7 * SR); tt = np.arange(n) / SR; f = 40 + 50 * np.exp(-tt / .06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .22); add(lp(s, 400) * amp, 0, int(t0 * SR))
for t0 in [6.15, 10.4] + TK + [21.3, 24.2, 29.6, 32.3]: thump(t0, .26)
# 5. low whooshes into cuts
def whoosh(tc, dur, amp, pan):
    n = int(dur * SR); tt = np.arange(n) / SR; s = bp(rng.standard_normal(n), 70, 900)
    e = (np.clip(tt / dur, 0, 1) ** 2) * np.exp(-np.clip(tt - dur * .85, 0, None) / .08); add(s * e * amp, pan, int(max(0, tc - dur * .85) * SR))
for tc, p in [(6.0, -.3), (10.0, .3), (21.2, -.2), (28.4, .2), (32.2, -.3)]: whoosh(tc, 1.2, .07, p)
# 6. sub swell for the reveal and payoff
da = env([(0, .15), (21.0, .15), (24.0, .45), (28.1, .3), (32.2, .55), (35.5, .4), (D, .15)])
for m, a in [(1, .2), (2, .12)]: add(da * a * np.sin(2 * np.pi * 36.71 * m * t + m), 0)
m = np.stack([L, R], 1); m /= np.max(np.abs(m)) / .5
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
