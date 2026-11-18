# Original bed for "What If You Fell Through Earth?" (31.0 s). Deep pad, a low pulse that speeds up toward the centre (10.46 s)
# and slows toward the South Pole (21.0 s), low whooshes at the core-mantle boundary (7.03 s), inner core (9.32 s) and centre,
# a rumble that peaks at the centre, a soft thump on arrival, a slow whoosh while the view turns (24.3-26.9 s) and on the zoom (29-30.2 s).
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 earth-tunnel.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 31.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(38)
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
CEN, ARR = 10.46, 21.0
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.25, .25):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .7) * np.minimum(1, (tt[-1] - tt) / .5)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([98.0, 116.54, 146.83], 0, 7.2, .05) + pad([77.78, 116.54, 155.56], 6.9, CEN + .2, .055, 850)
P += pad([87.31, 130.81, 174.61], CEN, 21.2, .05) + pad([98.0, 123.47, 146.83, 196.0], 20.9, 29.2, .05, 700) + pad([98.0, 116.54, 146.83], 28.9, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
da = env([(0, .3), (CEN - .5, .8), (CEN + .5, .8), (ARR, .25), (31, .3)])
for m, a in [(1, .5), (2, .2), (3, .07)]:
    add(da * a * np.sin(2 * np.pi * 49.0 * m * t + m), 0)
def beat(t0, amp, pan):
    n = int(.4 * SR); tt = np.arange(n) / SR; f = 50 + 40 * np.exp(-tt / .03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .09) * (1 - np.exp(-tt / .004)); add(s * amp, pan, int(t0 * SR))
tb = 0.2
while tb < ARR - .2:
    beat(tb, .32, -.1); sp = 1 - abs(tb - CEN) / CEN; tb += .85 - .55 * max(0, sp) ** 1.3
def whoosh(tc, amp, dur=1.0, fc=600):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), fc); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.5, int((tc - dur / 2) * SR)); add(np.roll(nz, 700) * e * amp * 2.5, .5, int((tc - dur / 2) * SR))
whoosh(7.03, .4, 1.0); whoosh(9.32, .4, .9); whoosh(CEN, .6, 1.4, 700); whoosh(25.6, .35, 2.6, 450); whoosh(29.7, .4, 1.6); whoosh(0.0, .3, .6)
rb = lp(rng.standard_normal(N), 260) * env([(0, 0), (4, .3), (CEN, 1.2), (17, .4), (ARR, 0), (31, 0)]); add(rb * .5)
def thump(t0, amp, f0=80, f1=40, dur=1.6, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .1)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 300) * 2 * np.exp(-tt / .05)
    add(s * amp, pan, int(t0 * SR))
thump(ARR, .5); thump(21.3, .7, 90, 38, 2.2)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
