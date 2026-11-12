# Original bed for "Fly Around Every Planet" (34.6 s). Warm low pad, a soft low pulse while each lap clock runs,
# felt-mallet thumps when each jet finishes its lap, low whooshes on the three whip pans, a long swell into the Sun's 202 days.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.  usage: python3 fly-around-planets.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 34.6; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(909)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
import math
lap = lambda d: math.pi * d / 900
R1 = (2.5, 9.6, [4879, 12104, 12756, 6792]); R2 = (11.4, 19.4, [142984, 120536, 51118, 49528])
def fin(r):
    a, b, ds = r; T = [lap(d) for d in ds]; m = max(T); return [a + (b - a) * x / m for x in T]
land1 = sorted(fin(R1)); land2 = sorted(fin(R2)); SUNT = 27.6
# 1. pad (filtered saws)
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .6)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([110.0, 130.81, 164.81], 0, 5.5, .05) + pad([87.31, 130.81, 174.61], 5.2, 10.6, .05)
P += pad([130.81, 164.81, 196.0], 10.3, 21.6, .045, 650) + pad([98.0, 146.83, 196.0, 246.94], 21.3, 28.0, .055, 850)
P += pad([87.31, 130.81, 174.61], 27.6, 31.5, .06) + pad([110.0, 130.81, 164.81], 31.2, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
# 2. sub drone (A, 55 Hz) with slow swell
da = env([(0, .35), (9.6, .45), (10.5, .3), (19.4, .5), (21.6, .3), (27.6, .8), (29.5, .45), (34.6, .35)])
for m, a in [(1, .5), (2, .22), (3, .08)]:
    add(da * a * np.sin(2 * np.pi * 55 * m * t + m), 0)
# 3. soft pulse (muted low pluck) that speeds up while balls are in the air
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
for a, b, f in [(2.5, 9.6, 220.0), (11.4, 19.4, 196.0), (22.6, 27.6, 174.61)]:
    tb = a; k = 0
    while tb < b - .05:
        pluck(tb, f if k % 2 == 0 else f * 0.75, .16, -.3 if k % 2 else .3); per = .42 - .2 * min(1, (tb - a) / (b - a)); tb += per; k += 1
# 4. landing thumps (felt mallet + low body)
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
for i, tl in enumerate(land1): thump(tl, .42 if i < 3 else .6, pan=(-.4, .4, .4, -.4)[i])
for i, tl in enumerate(land2): thump(tl, .42 if i < 3 else .65, pan=(.4, -.4, .4, -.4)[i])
thump(SUNT, .95, 100, 38, 2.4, -.2); thump(SUNT + .01, .75, 95, 40, 2.4, .2)
# 5. whooshes on the whip pans (low-passed noise swell)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(10.5, .5); whoosh(21.6, .55); whoosh(34.05, .45)
# 6. swell into the photo finish
sw = np.zeros(N); n0, n1 = int(23.0 * SR), int(SUNT * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .6)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
