# Original bed for "Drop a Ball on Every Planet" (27.8 s). Warm low pad (A minor -> F -> C -> G), a soft pulse that
# tightens while the balls fall, low felt-mallet thumps on every landing, low whooshes on the two whip pans,
# a held swell into the Mercury/Mars photo finish. No beeps, chimes or bright tones: everything sits below ~1.5 kHz
# before the master low-pass.  usage: python3 planet-ball-drop.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 27.8; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(808)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
# landing times (scene: T1 = 0.9, T2 = 10.6, t = sqrt(200/g))
T1, T2 = 0.9, 10.6
land1 = [T1 + np.sqrt(200 / g) for g in (23.1, 9.8, 9.0, 8.7)]
land2 = [T2 + np.sqrt(200 / g) for g in (11.0, 8.9)]
tie = T2 + np.sqrt(200 / 3.7)
# 1. pad (filtered saws)
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .6)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([110.0, 130.81, 164.81], 0, 5.9, .05) + pad([87.31, 130.81, 174.61], 5.5, 10.2, .05)
P += pad([130.81, 164.81, 196.0], 9.8, 18.2, .045, 650) + pad([98.0, 146.83, 196.0, 246.94], 17.9, 25.4, .055, 850)
P += pad([110.0, 130.81, 164.81], 25.0, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
# 2. sub drone (A, 55 Hz) with slow swell
da = env([(0, .35), (5.6, .4), (9.4, .3), (14.0, .45), (17.95, .7), (19.0, .4), (27.8, .35)])
for m, a in [(1, .5), (2, .22), (3, .08)]:
    add(da * a * np.sin(2 * np.pi * 55 * m * t + m), 0)
# 3. soft pulse (muted low pluck) that speeds up while balls are in the air
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
for a, b, f in [(T1, land1[-1], 220.0), (T2, tie, 196.0)]:
    tb = a; k = 0
    while tb < b - .05:
        pluck(tb, f if k % 2 == 0 else f * 0.75, .16, -.3 if k % 2 else .3); per = .42 - .2 * min(1, (tb - a) / (b - a)); tb += per; k += 1
# 4. landing thumps (felt mallet + low body)
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
for i, tl in enumerate(land1): thump(tl, .55 if i == 0 else .4, pan=(-.6, -.2, .2, .6)[i])
for i, tl in enumerate(land2): thump(tl, .45, pan=(-.6, -.2)[i])
thump(tie, .9, 100, 40, 2.0, .35); thump(tie + .01, .7, 95, 42, 2.0, .6)
# 5. whooshes on the whip pans (low-passed noise swell)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(9.7, .5); whoosh(27.15, .45)
# 6. swell into the photo finish
sw = np.zeros(N); n0, n1 = int(15.4 * SR), int(tie * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .6)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
