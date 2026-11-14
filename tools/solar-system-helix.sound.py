# Original bed for "solar-system-helix" (32.0 s). Warm low pad, a steady soft low pulse (motion), low whooshes on the camera moves,
# deep thumps on the 720,000 km/h stamp and the galaxy reveal, a swell into the pull-out. No beeps, chimes or bright tones:
# everything sits below ~1.5 kHz before the master low-pass.  usage: python3 solar-system-helix.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 32.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(417)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
def pad(freqs, t0, t1, amp, fc=750):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.2, .2):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / .8) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
# 1. pad: Dm - Bb - F - C - Dm (slow, cinematic)
P = pad([146.83, 174.61, 220.0], 0, 4.3, .05) + pad([116.54, 146.83, 174.61], 3.9, 9.6, .05)
P += pad([130.81, 174.61, 220.0], 9.2, 17.4, .05, 700) + pad([130.81, 164.81, 196.0, 261.63], 17.0, 20.6, .055, 800)
P += pad([146.83, 174.61, 220.0, 293.66], 20.2, 25.4, .065, 900) + pad([116.54, 146.83, 174.61], 25.0, 30.0, .055) + pad([146.83, 174.61, 220.0], 29.6, D, .05)
add(P, -.25); add(np.roll(P, 900), .25)
# 2. sub drone (D, 73.4 Hz / 36.7 Hz) with swells
da = env([(0, .35), (9.4, .35), (11.0, .6), (13, .4), (20.0, .45), (21.7, .85), (24.5, .45), (32.0, .35)])
for m, a in [(0.5, .45), (1, .3), (2, .08)]:
    add(da * a * np.sin(2 * np.pi * 73.42 * m * t + m), 0)
# 3. soft low pulse (muted pluck), steady, a bit faster in the spiral views
def pluck(t0, f, amp, pan):
    n = int(.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) * (1 - np.exp(-tt / .006)); s += .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / .06)
    add(lp(s, 900) * amp, pan, int(t0 * SR))
tb = 0.0; k = 0
while tb < D - .3:
    if not (20.2 < tb < 24.6):
        pluck(tb, 146.83 if k % 2 == 0 else 110.0, .13, -.3 if k % 2 else .3)
    tb += .48 if (3.8 < tb < 9.4) else .36; k += 1
# 4. deep thumps
def thump(t0, amp, f0=90, f1=40, dur=1.6, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 5)); s += lp(rng.standard_normal(n), 400) * 2.5 * np.exp(-tt / .03)
    add(s * amp, pan, int(t0 * SR))
thump(10.9, .8, pan=-.15); thump(10.91, .6, pan=.15); thump(21.6, .95, 100, 36, 2.6, -.2); thump(21.61, .75, 95, 38, 2.6, .2); thump(25.3, .5)
# 5. whooshes on the camera moves (low-passed noise swell)
def whoosh(tc, amp, dur=1.2):
    n = int(dur * SR); nz = lp(rng.standard_normal(n), 650); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    add(nz * e * amp * 2.5, -.4, int((tc - dur / 2) * SR)); add(np.roll(nz, 500) * e * amp * 2.5, .4, int((tc - dur / 2) * SR))
whoosh(4.6, .45, 1.6); whoosh(10.6, .5, 2.0); whoosh(18.0, .4, 1.6); whoosh(20.8, .6, 1.8); whoosh(25.0, .5, 1.6); whoosh(31.7, .4, .8)
# 6. swell into the galaxy pull-out
sw = np.zeros(N); n0, n1 = int(19.6 * SR), int(21.6 * SR); rr = rng.standard_normal(n1 - n0)
for i in range(5):
    a, b = i * (n1 - n0) // 5, (i + 1) * (n1 - n0) // 5; sw[n0 + a:n0 + b] = lp(rr, 200 + 500 * (i + .5) / 5)[a:b]
sw[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 2.2; add(sw * .55)
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.02 * SR); mx[:f] *= np.linspace(.7, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
