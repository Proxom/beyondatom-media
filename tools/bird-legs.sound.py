# Original bed for "Why Do Astronauts Get Bird Legs?" (28.0 s). Soft, floating low pad (F major -> D minor -> Bb -> C),
# a gentle rising "flow" texture (slowly sweeping filtered noise, low) while the fluid moves up, a soft low thump at the
# 2-liter answer (13.3 s), a downward sweep when gravity returns (20.2 s) and a low whoosh on the loop cut.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 bird-legs.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 28.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(72)
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
P = pad([87.31, 110.0, 130.81], 0, 7.8, .05) + pad([73.42, 110.0, 146.83], 7.4, 13.6, .05) + pad([116.54, 146.83, 174.61], 13.2, 20.5, .05, 850)
P += pad([98.0, 130.81, 164.81], 20.1, 27.4, .05) + pad([87.31, 110.0, 130.81], 27.1, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
for m, a in [(1, .45), (2, .18), (3, .06)]:
    add(env([(0, .3), (13, .45), (20, .35), (28, .3)]) * a * np.sin(2 * np.pi * 43.65 * m * t + m), 0)
nz = rng.standard_normal(N); fl = np.zeros(N); seg = int(.5 * SR)
for i in range(0, N, seg):
    tc = i / SR; fc = 200 + 300 * ((tc % 3.0) / 3.0) if tc < 20.2 else 450 - 300 * min(1, (tc - 20.2) / 3)
    fl[i:i + seg] = lp(nz[max(0, i - 2000):i + seg + 2000], fc)[min(i, 2000):min(i, 2000) + len(fl[i:i + seg])]
add(fl * env([(0, .15), (6, .3), (13, .35), (16, .1), (20.2, .3), (24, .05), (28, .1)]) * .6)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(13.3, .7); thump(20.2, .45, 70, 35, 1.8)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(27.35, .45); whoosh(0.0, .3, .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
