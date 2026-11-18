# Original bed for "What If You Jumped Off the Tallest Cliff?" (32.0 s). Cold, airy low pad (E minor -> C -> A minor -> B),
# a slow low pulse that quickens as the fall speeds up, a wind-like filtered-noise rush that grows with speed (no air on Miranda:
# it is a stylized sense of speed, kept low and dark), a deep impact boom at landing (21.5 s), a calm pad under the answer and a low whoosh on the loop cut.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 miranda-cliff.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 32.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(58)
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
LAND = 21.5
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .7) * np.minimum(1, (tt[-1] - tt) / .5)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([82.41, 98.0, 123.47], 0, 6.8, .05) + pad([65.41, 98.0, 130.81], 6.4, 12.6, .05) + pad([110.0, 130.81, 164.81], 12.2, 17.2, .05)
P += pad([123.47, 155.56, 185.0], 16.8, LAND, .055, 850) + pad([82.41, 123.47, 164.81, 196.0], LAND + .4, 31.5, .05, 650) + pad([82.41, 98.0, 123.47], 31.2, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
da = env([(0, .3), (15, .45), (21.3, .9), (21.6, .2), (32, .3)])
for m, a in [(1, .5), (2, .2), (3, .07)]:
    add(da * a * np.sin(2 * np.pi * 41.2 * m * t + m), 0)
def beat(t0, amp, pan):
    n = int(.4 * SR); tt = np.arange(n) / SR; f = 50 + 40 * np.exp(-tt / .03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .09) * (1 - np.exp(-tt / .004)); add(s * amp, pan, int(t0 * SR))
tb = 0.3
while tb < LAND - .15:
    beat(tb, .3, -.1); tb += 1.0 - .7 * min(1, tb / LAND) ** 1.5
rush = lp(rng.standard_normal(N), 500) * env([(0, 0), (3, .1), (12, .35), (LAND - .2, 1.0), (LAND, 0), (32, 0)]); add(rush * .45, -.2); add(np.roll(rush, 4000) * .45, .2)
def thump(t0, amp, f0=80, f1=30, dur=3.0, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .12)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 300) * 3 * np.exp(-tt / .25)
    add(s * amp, pan, int(t0 * SR))
thump(LAND, 1.0, pan=.1); thump(LAND + .015, .7, 75, 30, 2.8, -.2)
def whoosh(tc, amp, dur=1.0, fc=600):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), fc); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.5, int((tc - dur / 2) * SR)); add(np.roll(nz, 700) * e * amp * 2.5, .5, int((tc - dur / 2) * SR))
whoosh(31.35, .4); whoosh(0.0, .3, .6)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
