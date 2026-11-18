# Original bed for "What If Earth Stopped Orbiting?" (31.5 s). Dark low pad (A minor -> F -> D minor -> E), a low heartbeat
# pulse that speeds up as Earth falls faster, soft low whooshes as Venus's (14.98 s) and Mercury's (20.74 s) orbits pass,
# a rumble and swell that build into the impact (23.5 s), a deep boom, then a warm pad under the answer and a low whoosh on the loop cut.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 earth-falls-sun.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 31.5; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(64)
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
IMP = 23.5
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .7) * np.minimum(1, (tt[-1] - tt) / .5)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([110.0, 130.81, 164.81], 0, 7.5, .05) + pad([87.31, 130.81, 174.61], 7.1, 14.0, .05)
P += pad([73.42, 110.0, 146.83, 174.61], 13.6, 19.6, .05, 800) + pad([82.41, 123.47, 164.81, 207.65], 19.2, IMP, .06, 950)
P += pad([110.0, 130.81, 164.81, 220.0], IMP + .3, 31.1, .05, 650) + pad([110.0, 130.81, 164.81], 30.9, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
# low drone that swells toward impact
da = env([(0, .3), (12, .35), (20, .6), (23.3, 1.0), (23.6, .2), (31.5, .3)])
for m, a in [(1, .5), (2, .2), (3, .07)]:
    add(da * a * np.sin(2 * np.pi * 55.0 * m * t + m), 0)
# heartbeat pulse, faster as the fall speeds up (period from 0.9 s to 0.25 s)
def beat(t0, amp, pan):
    n = int(.4 * SR); tt = np.arange(n) / SR; f = 48 + 40 * np.exp(-tt / .03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .09) * (1 - np.exp(-tt / .004)); add(s * amp, pan, int(t0 * SR))
tb = 0.3
while tb < IMP - .1:
    beat(tb, .35, -.1); beat(tb + .16, .2, .1)
    tb += .9 - .65 * min(1, max(0, (tb - 8) / 15)) ** 1.5
def whoosh(tc, amp, dur=1.0, fc=600):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), fc); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.5, int((tc - dur / 2) * SR)); add(np.roll(nz, 700) * e * amp * 2.5, .5, int((tc - dur / 2) * SR))
whoosh(14.98, .4, 1.2); whoosh(20.74, .5, 1.1); whoosh(31.05, .4); whoosh(0.0, .25, .5)
# rumble build (filtered noise opening from 120 to 700 Hz)
sw = np.zeros(N); n0, n1 = int(15.5 * SR), int(IMP * SR); rr = rng.standard_normal(n1 - n0)
for i in range(6):
    a, b = i * (n1 - n0) // 6, (i + 1) * (n1 - n0) // 6; sw[n0 + a:n0 + b] = lp(rr, 120 + 580 * (i + .5) / 6)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2.2 * 2.4; add(sw * .6)
# impact boom
def thump(t0, amp, f0=80, f1=32, dur=3.0, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .12)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 300) * 3 * np.exp(-tt / .25)
    add(s * amp, pan, int(t0 * SR))
thump(IMP, 1.0, pan=.1); thump(IMP + .015, .7, 75, 30, 2.8, -.2)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
