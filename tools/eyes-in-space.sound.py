# Original bed for "What Happens to Your Eyes in Space?" (29.1 s): soft low pads, a slow low pulse while the pressure pushes (11.4-17 s), low thumps on the flattening, the swelling and the 70% answer, low whooshes on scene changes.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# No beeps, chimes, crackles or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 eyes-in-space.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 29.1; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(7070)
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
P = pad([65.41, 98.0, 130.81], 0, 7.4, .05) + pad([55.0, 82.41, 110.0], 7.0, 20.4, .05, 600) + pad([61.74, 92.5, 123.47, 164.81], 20.0, 27.3, .05, 700) + pad([65.41, 98.0, 130.81], 26.9, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
for m, a in [(1, .4), (2, .14)]:
    add(env([(0, .3), (D, .3)]) * a * np.sin(2 * np.pi * 41.2 * m * t + m), 0)
rum = lp(rng.standard_normal(N), 220) * env([(0, .15), (11.2, .15), (11.6, .45)]+[(11.8 + i * .5, .25 + .25 * (i % 2)) for i in range(11)]+[(17.4, .12), (D, .15)]); add(rum * .55, -.3); add(np.roll(rum, 700) * .55, .3)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(15.4, .6); thump(18.2, .6); thump(21.8, .75); thump(24.8, .4)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(7.0, .45, 1.2); whoosh(11.2, .4, 1.0); whoosh(20.1, .45, 1.2); whoosh(28.85, .45); whoosh(0.0, .3, .5)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
