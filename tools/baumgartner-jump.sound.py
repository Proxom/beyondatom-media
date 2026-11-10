# Original bed for "Could You Survive a Jump From 39 km?" (39.6 s). Low drone + warm pad, wind that grows with speed,
# a soft double "sonic boom" thump at Mach 1, pulsing whooshes in the flat spin, a low chute pop, a riser into the twist.
# No beeps, chimes or bright tones: everything sits below ~1.5 kHz before the master low-pass.
# usage: python3 baumgartner-jump.sound.py bed.wav
import numpy as np, wave, sys
SR = 48000; D = 39.6; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(1014)
L = np.zeros(N); R = np.zeros(N)
def env(points):
    ts, vs = zip(*points); return np.interp(t, ts, vs)
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def add(sig, pan=0.0, i0=0):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
# 1. drone (D, 73.4 Hz)
ph = 2 * np.pi * 73.42 * t
da = env([(0, .45), (13.4, .5), (14.6, .7), (23.2, .8), (28.9, .55), (32.6, .4), (34.5, .5), (37.1, .7), (39.6, .45)])
lfo = 1 + .1 * np.sin(2 * np.pi * .17 * t)
for m, a, pan in [(.5, .7, 0), (1, .6, -.2), (1.5, .3, .25), (2, .15, 0)]:
    add(da * lfo * a * np.sin(m * ph + rng.uniform(0, 6)), pan)
# 2. warm pad: Dm -> Bb -> F -> C, filtered saws
def pad(freqs, t0, t1, amp, fc=800):
    n0, n1 = int(t0 * SR), int(min(t1, D) * SR); tt = np.arange(n1 - n0) / SR; s = np.zeros(n1 - n0)
    for f in freqs:
        for det in (-.18, .18):
            x = (tt * (f + det)) % 1.0; s += (2 * x - 1) * .5
    s = lp(s, fc, 2); e = np.minimum(1, tt / 1.0) * np.minimum(1, (tt[-1] - tt) / .8)
    out = np.zeros(N); out[n0:n1] = s * e * amp; return out
P = pad([146.83, 174.61, 220.0], 0, 7.0, .05) + pad([116.54, 146.83, 174.61], 6.4, 13.8, .05)
P += pad([87.31, 130.81, 174.61, 220.0], 13.4, 23.6, .045, 700) + pad([130.81, 164.81, 196.0], 23.2, 29.3, .035, 600)
P += pad([87.31, 130.81, 174.61], 28.9, 34.8, .05) + pad([146.83, 174.61, 220.0, 293.66], 34.4, 39.6, .055, 900)
add(P, -.2); add(np.roll(P, 1100), .2)
# 3. wind: low-passed noise, louder and brighter with speed (cutoff stays below 1.2 kHz)
nz = rng.standard_normal(N); wa = env([(0, .08), (13.4, .1), (14.6, .35), (21.6, 1.0), (23.2, .9), (28.9, .7), (32.6, .55), (32.9, .12), (34.5, .1), (37.1, .25), (39.6, .08)])
w_lo = lp(nz, 220) * 7; w_hi = lp(rng.standard_normal(N), 900) * 2.2
bright = env([(0, 0), (14.6, .1), (21.6, 1), (28.9, .6), (32.6, .4), (33, 0), (39.6, 0)])
buf = 1 + .35 * np.sin(2 * np.pi * 5.3 * t) * bright
add((w_lo + w_hi * bright) * wa * buf * .9, -.1); add((lp(rng.standard_normal(N), 220) * 7 + lp(rng.standard_normal(N), 900) * 2.2 * bright) * wa * buf * .9, .1)
# 4. impacts
def boom(t0, amp, f0=80, f1=32, dur=2.0, pan=0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-tt / .25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (dur / 4)); s += lp(rng.standard_normal(n), 280) * 3 * np.exp(-tt / .1)
    add(s * amp, pan, int(t0 * SR))
boom(0.0, .55); boom(3.5, .3, 70, 40, 1.4); boom(8.7, .3, 70, 40, 1.4); boom(14.6, .8, 85, 30, 2.4)
boom(17.9, 1.0, 75, 28, 2.2); boom(18.15, .8, 70, 28, 2.0)          # soft double thump at Mach 1
boom(23.2, .55, 70, 35, 1.6); boom(32.6, .75, 95, 45, 1.2)           # spin start, chute pop
boom(37.1, .6, 80, 30, 2.4)
# 5. spin whooshes: amplitude pulses following the rotation rate
def rate(tt):
    return np.where(tt < 23.2, 0, np.where(tt < 27.55, .3 + .7 * np.clip((tt - 23.2) / 2.2, 0, 1), np.clip(1 - (tt - 27.55) / 1.35, 0, 1)))
r = rate(t); phs = np.cumsum(r) / SR * 2 * np.pi
puls = (np.maximum(np.sin(phs * 1.0), 0) ** 3) * r
add(lp(rng.standard_normal(N), 600) * 3.5 * puls, -.4); add(lp(rng.standard_normal(N), 600) * 3.5 * np.roll(puls, 2400), .4)
# 6. riser into the twist (low-passed noise swelling, band opening to 1 kHz)
ris = np.zeros(N); n0, n1 = int(34.5 * SR), int(37.1 * SR); rr = rng.standard_normal(n1 - n0)
k = 6
for i in range(k):
    a, b = i * (n1 - n0) // k, (i + 1) * (n1 - n0) // k; ris[n0 + a:n0 + b] = lp(rr, 250 + 750 * (i + .5) / k)[a:b]
ris[n0:n1] *= np.linspace(0, 1, n1 - n0) ** 2 * 4; add(ris * .8)
# 7. heartbeat under the spin
def thump(t0, amp, f=52):
    n = int(.35 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt * (1 - .25 * tt)) * np.exp(-tt / .07) * (1 - np.exp(-tt / .004)); add(s * amp, 0, int(t0 * SR))
tb = 23.6
while tb < 28.6:
    thump(tb, .5); thump(tb + .2, .35, 46); tb += .62
mx = np.stack([L, R], 1); mx /= np.abs(mx).max() * 1.12
f = int(.03 * SR); mx[:f] *= np.linspace(.6, 1, f)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
