# Original bed for "How Fast Do Bones Age in Space?" (bone-loss-space, 35.3 s). Adapted from neutron-star-size.sound.py: low pad, soft felt thumps on every year/month tick, whooshes on scene changes. Warm low pad (D minor -> Bb -> F -> C), a soft low pulse while
# the balls fly that tightens toward Pluto's landing, felt-mallet thumps on each landing (Earth 1.38, Mars 3.74,
# Moon 8.69, Pluto 22.77 s), a slow swell into the Pluto landing, a low whoosh on the loop cut and the wind-up.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 throw-four-worlds.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 35.3; N = int(SR * D); t = np.arange(N) / SR
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
P = pad([146.83, 174.61, 220.0], 0, 7.6, .05) + pad([116.54, 146.83, 174.61], 7.2, 17.2, .05)
P += pad([130.81, 164.81, 196.0, 261.63], 16.8, 21.2, .055, 850) + pad([110.0, 130.81, 164.81], 20.8, 28.1, .045, 600)
P += pad([130.81, 174.61, 220.0], 27.7, 33.8, .05, 800) + pad([146.83, 174.61, 220.0], 33.4, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
da = env([(0, .35), (7, .4), (17, .5), (21, .6), (24, .4), (35.3, .35)])
for m, a in [(1, .5), (2, .22), (3, .08)]:
    add(da * a * np.sin(2 * np.pi * 73.42 * m * t + m), 0)
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
tb, k = 21.2, 0
while tb < 27.8 - .05:
    pluck(tb, 293.66 if k % 2 == 0 else 220.0, .14, -.3 if k % 2 else .3)
    per = .5 + .25 * min(1, max(0, (tb - 24.2) / 2.0)); tb += per; k += 1
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
for tt in [8.3, 9.6, 10.9]: thump(tt, .35, 100, 50, .8, -.35)
for tt in [13.3, 14.6, 15.9]: thump(tt, .35, 120, 60, .8, .35)
for tt in [17.6, 18.8, 20.0]: thump(tt, .3, 100, 50, .8, -.35); thump(tt + .01, .3, 120, 60, .8, .35)
thump(17.0, .6, 110, 40, 1.6, 0)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(34.85, .45); whoosh(21.0, .35, .9); whoosh(27.9, .35, .9); whoosh(33.6, .3, .8)
sw = np.zeros(N); n0, n1 = int(14.0 * SR), int(17.0 * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .55)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
