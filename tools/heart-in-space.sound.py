# Original bed for "What Happens to Your Heart in Space?" (32.6 s). Soft pads, a low heartbeat (lub-dub) synced to the drawn heart, low whooshes on scene changes. Warm low pad on the Earth side, cooler pad in orbit,
# a soft low crackle-free "breath" texture for rising air (6.4-11.3 s), a slow airy drift (11.3-15.2 s), a gentle low thump
# at the 45-minute answer (18 s), a 1 Hz low pulse while the orbit flame pulses (22-24.8 s), a soft hush when it goes out, a low whoosh on the loop.
# No beeps, chimes, crackles or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 space-flame.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 32.6; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(83)
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
P = pad([65.41, 98.0, 130.81], 0, 4.9, .045) + pad([73.42, 110.0, 146.83], 4.5, 10.7, .045) + pad([61.74, 92.5, 123.47], 10.3, 15.8, .045, 650)
P += pad([55.0, 82.41, 110.0], 15.4, 24.7, .045, 600) + pad([73.42, 110.0, 146.83], 24.3, 29.2, .045) + pad([65.41, 98.0, 130.81], 28.7, D, .045)
add(P, -.25); add(np.roll(P, 900), .25)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 1.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
# heartbeat: beatOf() in the scene peaks at phase 0 and 0.18 of a 1/1.15 s cycle (except the 10.4-15.5 and 24.4-28.8 scenes keep it too: same body)
per = 1 / 1.15; k = 0
while k * per < D - .3:
    t0 = k * per; v = .32 if not (15.5 <= t0 < 24.4) else .26
    thump(t0, v, 70, 42, .5); thump(t0 + .18 * per, v * .6, 64, 40, .45); k += 1
thump(7.6, .5); thump(17.0, .45); thump(24.6, .4); thump(25.6, .4)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(10.4, .4); whoosh(15.5, .4); whoosh(24.4, .4); whoosh(28.8, .4); whoosh(32.35, .45); whoosh(0.0, .3, .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
