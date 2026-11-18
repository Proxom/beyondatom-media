# Original bed for "Same Swing on 4 Worlds" (30.0 s). Warm low pad (G minor -> Eb -> Bb -> F), a soft low pluck each time
# Earth's swing passes the bottom (every 1.62 s), a slow swell into Pluto's first full swing (12.32 s) with a felt thump,
# soft thumps when Earth, Mars and the Moon finish their first swing (2.65, 4.67, 7.39 s), a low whoosh on the loop cut.
# No beeps, chimes, creaks or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 swing-four-worlds.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 30.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(25)
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
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .6) * np.minimum(1, (tt[-1] - tt) / .6)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([98.0, 116.54, 146.83], 0, 7.8, .05) + pad([77.78, 116.54, 155.56], 7.4, 12.6, .05)
P += pad([116.54, 146.83, 174.61], 12.2, 19.9, .05, 850) + pad([87.31, 130.81, 174.61, 220.0], 19.5, 28.9, .05) + pad([98.0, 116.54, 146.83], 28.6, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
da = env([(0, .35), (9, .4), (12.2, .7), (12.6, .35), (30, .35)])
for m, a in [(1, .5), (2, .2), (3, .07)]:
    add(da * a * np.sin(2 * np.pi * 49.0 * m * t + m), 0)
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
# Earth passes the bottom at s = T/4 + k*T/2 (T = 3.245), s = t + 0.6
k = 0
while True:
    tb = 3.245 / 4 + k * 3.245 / 2 - 0.6
    if tb > 28.6: break
    if tb > 0: pluck(tb, 196.0 if k % 2 == 0 else 146.83, .12, -.3 if k % 2 else .3)
    k += 1
def thump(t0, amp, f0=90, f1=45, dur=1.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
for i, tl in enumerate([2.65, 4.67, 7.39]): thump(tl, .35, pan=(-.4, -.1, .2)[i])
thump(12.32, .9, 100, 40, 2.2, .1); thump(12.335, .5, 95, 42, 2.0, -.2)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(28.85, .45); whoosh(0.0, .3, .5)
sw = np.zeros(N); n0, n1 = int(8.9 * SR), int(12.32 * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
