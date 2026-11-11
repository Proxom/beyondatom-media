# Original bed for "What If You Fell Into Jupiter?" (35.6 s). Deep space pad, an entry roar that builds to the
# heat-shield flash (11.9 s), a slow low rumble that thickens with depth, a muffled drop-out when the probe goes
# silent (24.5 s), then an open pad for the pull-out reveal. No beeps or bright tones; everything below ~1.2 kHz
# before the master low-pass.  usage: python3 jupiter-fall.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 35.6; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(1995)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
def pad(freqs, t0, t1, amp, fc=700):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .8) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad: Dm -> Bb -> Gm -> A -> Dm
P = pad([146.83, 174.61, 220.0], 0, 4.2, .05) + pad([116.54, 146.83, 174.61], 3.8, 12.2, .045, 600)
P += pad([98.0, 116.54, 146.83], 11.8, 24.7, .04, 500) + pad([110.0, 138.59, 164.81], 26.0, 33.6, .05, 800)
P += pad([146.83, 174.61, 220.0], 33.2, D, .05)
add(P, -.25); add(np.roll(P, 1000), .25)
# 2. sub drone (D 36.7 Hz + 73.4) that grows with depth, cut at the signal loss
da = env([(0, .35), (11.9, .5), (12.3, .55), (24.4, .95), (24.6, .25), (26.0, .3), (35.6, .35)])
for m, a in [(1, .5), (2, .35), (3, .1)]:
    add(da * a * np.sin(2 * np.pi * 36.71 * m * t + m), 0)
# 3. entry roar: low-passed noise building to the flash, band opening up to 1.1 kHz
ra = env([(0, 0), (4.2, .05), (8.0, .45), (11.6, 1.0), (11.95, 1.1), (12.4, .2), (13.5, 0), (35.6, 0)])
br = env([(0, 300), (4.2, 300), (11.9, 1100), (12.4, 400), (35.6, 400)])
nz = rng.standard_normal(N); lo = lp(nz, 300); hi = lp(rng.standard_normal(N), 1100)
mixb = np.clip((br - 300) / 800, 0, 1)
add((lo * 5 + hi * 2.2 * mixb) * ra * .55, -.15); add((lp(rng.standard_normal(N), 300) * 5 + lp(rng.standard_normal(N), 1100) * 2.2 * mixb) * ra * .55, .15)
# 4. descent rumble: slow-moving low noise, thicker with depth
rb = env([(0, 0), (11.6, 0), (12.5, .25), (24.4, .8), (24.6, .05), (35.6, 0)])
mod = 1 + .35 * np.sin(2 * np.pi * .23 * t) + .2 * np.sin(2 * np.pi * .61 * t + 1)
add(lp(rng.standard_normal(N), 140) * 7 * rb * mod * .5, -.3); add(lp(rng.standard_normal(N), 140) * 7 * rb * mod * .5, .3)
# 5. impacts: hook, flash, chute snap (low), signal loss (muffled), reveal
def boom(t0, amp, f0=80, f1=32, dur=2.0, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 260) * 3 * np.exp(-tt / .1)
    add(s * amp, pan, int(t0 * SR))
boom(0.0, .5); boom(11.9, 1.0, 90, 30, 2.6); boom(12.6, .35, 70, 40, 1.0); boom(24.45, .8, 60, 28, 2.4); boom(26.1, .6, 80, 35, 2.0); boom(33.3, .4, 70, 40, 1.6)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
