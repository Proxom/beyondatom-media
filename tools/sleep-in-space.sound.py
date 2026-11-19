# Original bed for "How Do Astronauts Sleep in Space?" (26.9 s). Soft lullaby-like low pads, a gentle station hum, a low whoosh on the roll, soft low air-flow noise when the fan runs. Warm low pad on the Earth side, cooler pad in orbit,
# a soft low crackle-free "breath" texture for rising air (6.4-11.3 s), a slow airy drift (11.3-15.2 s), a gentle low thump
# at the 45-minute answer (18 s), a 1 Hz low pulse while the orbit flame pulses (22-24.8 s), a soft hush when it goes out, a low whoosh on the loop.
# No beeps, chimes, crackles or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 space-flame.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 26.9; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(404)
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
P = pad([65.41, 98.0, 130.81], 0, 5.8, .05) + pad([73.42, 110.0, 146.83], 5.4, 12.3, .05) + pad([61.74, 92.5, 123.47], 11.9, 18.8, .045, 600)
P += pad([65.41, 98.0, 130.81, 164.81], 18.4, 24.6, .05, 700) + pad([65.41, 98.0, 130.81], 24.3, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
for m, a in [(1, .35), (2, .12)]:
    add(env([(0, .3), (D, .3)]) * a * np.sin(2 * np.pi * 60.0 * m * t + m), 0)
fan = lp(rng.standard_normal(N), 500) * env([(0, 0), (18.8, 0), (19.3, .5), (24.2, .5), (24.6, 0), (D, 0)]); add(fan * .5, -.3); add(np.roll(fan, 700) * .5, .3)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(5.4, .5); thump(12.0, .5); thump(18.45, .6)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(8.7, .4, 4.0); whoosh(26.65, .45); whoosh(0.0, .3, .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
