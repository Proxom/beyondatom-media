# Original cinematic bed for the black-hole remake (35.0 s). Low drone + soft pad, deep impacts, heartbeat countdown.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 sound.py raw.wav   (master with ffmpeg afterwards, see make.sh)
import numpy as np, wave, sys
SR = 48000; D = 35.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(1307)
L = np.zeros(N); R = np.zeros(N)
def env(points):  # piecewise-linear envelope from [(time, value), ...]
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / hi) ** 8) * (1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 8)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
# --- 1. drone: root 55 Hz, glides down a little during the freeze and an octave during the stretch
glide = env([(0, 1), (12.0, 1), (13.2, .9), (14.5, .9), (14.8, 1), (29.3, 1), (31.8, .5), (32.2, 1), (35, 1)])
ph = 2 * np.pi * np.cumsum(55 * glide) / SR
drone_amp = env([(0, .55), (3, .6), (12, .7), (12.3, .35), (14.5, .35), (14.6, .7), (18, .95), (18.05, .45), (30.8, .9), (31.9, .55), (35, .55)])
lfo = 1 + .12 * np.sin(2 * np.pi * .21 * t)
for mult, a, pan in [(1, 1, 0), (1.5, .45, -.3), (2, .35, .3), (3, .12, 0)]:
    add(drone_amp * lfo * a * np.sin(mult * ph + rng.uniform(0, 6)), pan)
# --- 2. dark rumble (low-passed noise)
rum = lp(rng.standard_normal(N), 160) * 9
rum_amp = env([(0, .25), (14.5, .3), (17.9, 1.0), (18.1, .3), (28, .5), (31.0, 1.2), (31.9, .25), (35, .25)])
add(rum * rum_amp, -.15); add(lp(rng.standard_normal(N), 160) * 9 * rum_amp, .15)
# --- 3. soft pad, A minor -> F major -> A minor, warm saw filtered at 900 Hz, slow swells
def pad(freqs, t0, t1, amp, fc=900):
    n0, n1 = int(t0 * SR), int(t1 * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.15, .15):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / 1.2) * np.minimum(1, (tt[-1] - tt) / 1.0)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([110, 130.81, 164.81], 0, 12.3, .055) + pad([87.31, 130.81, 174.61], 14.4, 18.2, .05, 700)
P += pad([110, 130.81, 164.81, 220], 18.0, 31.0, .05, 800) + pad([110, 130.81, 164.81], 31.6, 35.0, .055)
P[-int(.4 * SR):] = P[-int(.4 * SR):]  # keep tail for the loop
add(P, -.2); add(np.roll(P, 900), .2)
# --- 4. impacts (sine drop + short low noise burst)
def boom(t0, amp, f0=80, f1=32, dur=2.2, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4))
    s += lp(rng.standard_normal(n), 300) * 3 * np.exp(-tt / .12)
    add(s * amp, pan, int(t0 * SR))
boom(0.0, .7); boom(3.0, .25, 70, 40, 1.4); boom(7.0, .25, 70, 40, 1.4); boom(10.5, .25, 70, 40, 1.4)
boom(18.0, 1.0, 90, 28, 3.0); boom(30.8, .9, 85, 26, 2.6); boom(31.9, .35, 70, 40, 1.4)
# --- 5. whoosh riser into the crossing (band-passed noise opening up), and short whooshes on card changes
def whoosh(t0, t1, lo, hi0, hi1, amp, pan=0):
    n0, n1 = int(t0 * SR), int(t1 * SR); n = n1 - n0; tt = np.linspace(0, 1, n)
    nz = rng.standard_normal(n); parts = []
    seg = 8; out = np.zeros(n)
    for k in range(seg):  # step the band upwards
        a, b = k * n // seg, (k + 1) * n // seg
        hi = hi0 + (hi1 - hi0) * (k + .5) / seg
        out[a:b] = bp(nz, lo, hi)[a:b]
    out *= amp * np.sin(np.pi * tt) ** 1.5 * 4
    add(out, pan, n0)
whoosh(14.5, 18.05, 120, 300, 1300, .9); whoosh(2.4, 3.3, 150, 400, 700, .35, -.3)
whoosh(6.4, 7.3, 150, 400, 700, .35, .3); whoosh(9.9, 10.8, 150, 400, 700, .35, -.2)
# --- 6. heartbeat during the 12.8 s countdown (lub-dub, very low), slowly faster
def thump(t0, amp, f=52):
    n = int(.35 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt * (1 - .25 * tt)) * np.exp(-tt / .07) * (1 - np.exp(-tt / .004))
    add(s * amp, 0, int(t0 * SR))
tb = 18.6; gap = 1.0; k = 0
while tb < 30.6:
    a = .55 + .03 * k; thump(tb, a); thump(tb + .22, a * .7, 46); tb += gap; gap = max(.62, gap * .965); k += 1
# --- mix and write
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
fade = int(.03 * SR); mx[:fade] *= np.linspace(0.6, 1, fade)[:, None]
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
