# Original bed for "What If You Stood on Titan?" (35 s). Soft low pads per scene, gentle wing-flap puffs (low-passed noise,
# 1.2 per second) while flying, low thumps when a counter lands, low whooshes on cuts. No beeps or bright tones.
# usage: python3 titan-stand.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 35.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(31)
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
P = pad([73.42, 110.0, 146.83], 0, 5.0, .05) + pad([65.41, 98.0, 130.81], 4.6, 10.6, .05, 600) + pad([55.0, 82.41, 110.0], 10.2, 18.3, .055, 450)
P += pad([73.42, 92.5, 138.59], 18.0, 28.5, .05, 650) + pad([82.41, 123.47, 164.81], 28.1, D, .055, 800)
add(P, -.25); add(np.roll(P, 900), .25)
for m, a in [(1, .4), (2, .14)]:
    add(env([(0, .3), (10.3, .3), (13.5, .55), (18.1, .3), (35.0, .3)]) * a * np.sin(2 * np.pi * 41.2 * m * t + m), 0)
rum = lp(rng.standard_normal(N), 200) * env([(0, .08), (4.75, .1), (7.75, .4), (8.4, .12), (13.5, .45), (14.2, .12), (35.0, .1)]); add(rum * .6, -.3); add(np.roll(rum, 700) * .6, .3)
def thump(t0, amp, f0=90, f1=45, dur=1.4, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.0 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(7.75, .65); thump(13.5, .7); thump(24.7, .65); thump(26.4, .55)
def whoosh(tc, amp, dur=.9):
    n = int(dur * SR); w = lp(rng.standard_normal(n), 700); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(w * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(w, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(4.75, .5); whoosh(10.3, .4); whoosh(18.1, .35); whoosh(28.25, .4); whoosh(34.95, .3, .5); whoosh(0.0, .25, .5)
# wing flaps: one soft low puff per downstroke (1.2 Hz) while flying
def flap(tc, amp):
    n = int(.32 * SR); w = lp(rng.standard_normal(n), 450); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 3
    add(w * e * amp, 0, int(tc * SR))
k = 0
while k / 1.2 < D:
    tc = k / 1.2 + .1
    if tc < 4.6: flap(tc, .9)
    elif tc > 29.0: flap(tc, .9 * min(1, (tc - 29.0) / .8))
    k += 1
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
