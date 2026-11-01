# adds a soft Martian wind bed (low-passed noise with slow gusts, loop-friendly) and gentle whooshes to a stereo wav
import numpy as np, wave, sys
src, out = sys.argv[1], sys.argv[2]; SR = 48000
w = wave.open(src); n = w.getnframes(); x = np.frombuffer(w.readframes(n), '<i2').reshape(-1, 2) / 32768.0
t = np.arange(n) / SR; D = n / SR; rng = np.random.default_rng(3)
def lp(sig, fc, order=4):
    X = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR); X *= 1 / (1 + (f / fc) ** order); return np.fft.irfft(X, len(sig))
def bp(sig, lo, hi): return lp(sig, hi) - lp(sig, lo)
gust = 0.6 + 0.25 * np.sin(2 * np.pi * t * 3 / D) + 0.15 * np.sin(2 * np.pi * t * 7 / D + 1)   # whole periods -> loops
wind = np.stack([bp(rng.standard_normal(n), 90, 520), bp(rng.standard_normal(n), 90, 520)], 1) * gust[:, None]
def whoosh(a, b):
    e = np.clip((t - a) / (b - a), 0, 1); env = np.sin(np.pi * e) ** 2 * (t >= a) * (t <= b)
    s = bp(rng.standard_normal(n), 150, 900) * env; return np.stack([s * 0.9, s], 1)
wh = whoosh(1.6, 3.9) + whoosh(30.3, 33.3) + whoosh(36.6, 39.5) * 0.8
rms = lambda s: np.sqrt(np.mean(s ** 2)) + 1e-9
y = x + wind / rms(wind) * rms(x) * 10 ** (-9 / 20) + wh / rms(wh) * rms(x) * 10 ** (-14 / 20)
y /= np.abs(y).max() * 1.1
o = wave.open(out, 'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes((y * 32767).astype('<i2').tobytes()); o.close(); print('ok')
