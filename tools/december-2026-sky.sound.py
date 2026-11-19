# Original bed for "December 2026 Sky: Dates to Save" (26.2 s). Calm night pads, soft low whooshes for meteors, low thumps on each date. Warm low pad on the Earth side, cooler pad in orbit,
# a soft low crackle-free "breath" texture for rising air (6.4-11.3 s), a slow airy drift (11.3-15.2 s), a gentle low thump
# at the 45-minute answer (18 s), a 1 Hz low pulse while the orbit flame pulses (22-24.8 s), a soft hush when it goes out, a low whoosh on the loop.
# No beeps, chimes, crackles or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 space-flame.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 26.2; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(1226)
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
P = pad([73.42, 110.0, 146.83], 0, 4.4, .05) + pad([65.41, 98.0, 130.81], 4.0, 8.1, .05) + pad([82.41, 123.47, 164.81], 7.7, 16.2, .05, 700)
P += pad([61.74, 92.5, 123.47], 15.8, 21.9, .05, 650) + pad([73.42, 110.0, 146.83, 196.0], 21.5, D, .05, 700)
add(P, -.25); add(np.roll(P, 900), .25)
for m, a in [(1, .4), (2, .14)]:
    add(env([(0, .3), (D, .3)]) * a * np.sin(2 * np.pi * 41.2 * m * t + m), 0)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
for t0 in (4.1, 7.8, 15.9, 21.6): thump(t0, .55)
def whoosh(tc, amp, dur=.9, pan=0):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 600); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, pan - .3, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, pan + .3, int((tc - dur / 2) * SR))
for k in range(5): whoosh(0.6 + k * 0.8, .12, .5, rng.uniform(-.5, .5))
for k in range(16): whoosh(8.2 + k * 0.48, .1, .45, rng.uniform(-.6, .6))
whoosh(25.95, .45); whoosh(0.0, .3, .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
