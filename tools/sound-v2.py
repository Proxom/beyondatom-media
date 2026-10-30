# Sound engine v2: modal-synthesis hits + warm pad bed + convolution reverb + equal-power pan.
# usage: python3 sound-v2.py out.wav cfg.json
# cfg: {"dur":30,"seed":1,"root":110,"bed":"space",
#       "hits":[{"t":0.2,"kind":"marimba|wood|bell|glass","note":0..,"vel":0.8,"pan":-1..1}],
#       "swells":[[t0,t1,gain]]}
# notes are degrees on a major-pentatonic scale over cfg.root*2 (kept in a comfortable 300-2000 Hz range)
# The master chain (highpass, lowpass, compressor, limiter, loudnorm -20 LUFS) is applied with ffmpeg afterwards.
import numpy as np, wave, sys, json
cfg = json.load(open(sys.argv[2])); SR = 48000; D = cfg.get('dur', 30.0); N = int(SR * D)
t = np.arange(N) / SR; rng = np.random.default_rng(cfg.get('seed', 1))
L = np.zeros(N); R = np.zeros(N)
PENTA = [0, 2, 4, 7, 9]
def freq(deg):
    o, k = divmod(int(deg), 5); return cfg.get('root', 110.0) * 4 * 2 ** (o + PENTA[k] / 12)
def onepole_lp(x, fc):
    # zero-phase-ish smoothing via FFT brick with soft roll-off
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def pan_add(sig, i0, pan):
    a = (pan + 1) * np.pi / 4; n = min(len(sig), N - i0)
    if n <= 0: return
    L[i0:i0 + n] += sig[:n] * np.cos(a); R[i0:i0 + n] += sig[:n] * np.sin(a)
# material: (partial ratios, relative amps, decay seconds of fundamental, decay falloff per partial, contact brightness)
MAT = {
    'marimba': ([1, 3.99, 9.9, 17.6], [1, .35, .08, .03], 0.55, 1.9, 2500),
    'wood':    ([1, 2.57, 4.21, 6.1, 8.3], [1, .5, .25, .12, .06], 0.09, 1.3, 1800),
    'bell':    ([1, 2.0, 2.76, 3.0, 4.07, 5.4, 6.8], [1, .6, .45, .3, .2, .1, .06], 1.1, 1.35, 3500),
    'glass':   ([1, 2.32, 4.25, 6.63, 9.38], [1, .45, .25, .12, .06], 0.35, 1.6, 4500),
}
def hit(h):
    kind = h.get('kind', 'marimba'); ratios, amps, dec, fall, bright = MAT[kind]
    f0 = h['f'] if 'f' in h else freq(h.get('note', 0)); vel = h.get('vel', .8)
    if kind == 'wood' and 'f' not in h: f0 /= 2
    f0 *= 1 + rng.uniform(-.012, .012)
    n = int(SR * min(dec * 5, 6)); tt = np.arange(n) / SR; s = np.zeros(n)
    for r, a in zip(ratios, amps):
        f = f0 * r
        if f > 5000: continue
        d = dec * (1 + rng.uniform(-.03, .03)) / (r ** (fall - 1)) if r > 1 else dec
        a = a * (vel ** (0.5 + 0.4 * (r > 1)))                    # harder hits are brighter
        s += a * np.sin(2 * np.pi * f * tt + rng.uniform(0, 6.28)) * np.exp(-tt / d)
    att = np.minimum(1, tt / 0.004); s *= att                       # 4 ms soft attack: no click
    m = int(SR * .004); c = rng.standard_normal(m) * np.hanning(m)  # soft band-limited contact
    c = onepole_lp(np.pad(c, (0, 64)), bright)[:m]; s[:m] += c * .08 * vel
    s *= vel * h.get('gain', 1.0) * (0.9 + rng.uniform(-.03, .03))
    pan_add(s, int(h['t'] * SR), h.get('pan', 0.0))
for h in cfg.get('hits', []): hit(h)
FX_L, FX_R = L.copy(), R.copy()
# bed: warm evolving pad (detuned saws through a slowly moving low-pass) on root chord
r0 = cfg.get('root', 110.0); bed = np.zeros(N); bedR = np.zeros(N)
chord = [r0 / 2, r0 * 3 / 4, r0, r0 * 3 / 2] if cfg.get('bed', 'space') == 'space' else [r0, r0 * 5 / 4, r0 * 3 / 2]
for i, f in enumerate(chord):
    for det, side in ((-0.15, 0), (0.15, 1)):
        ph = 2 * np.pi * np.cumsum(np.full(N, f * (1 + det / 100))) / SR + i
        x = sum(np.sin(k * ph) / k for k in range(1, 7)) * (0.8 + 0.2 * np.sin(2 * np.pi * (0.05 + 0.02 * i) * t + i))
        (bed if side == 0 else bedR)[:] += x / len(chord)
w = 0.5 + 0.5 * np.sin(2 * np.pi * t / D * 2)   # slow filter movement, period D/2 so it loops
def moving_lp(x): return onepole_lp(x, 380) * (1 - w) + onepole_lp(x, 900) * w
bed = moving_lp(bed); bedR = moving_lp(bedR)
for a, b, g in cfg.get('swells', []):      # gentle pad swells (no noise)
    e = np.clip((t - a) / max(b - a, .01), 0, 1); e = np.where(t > b, np.exp(-(t - b) / 0.8), np.sin(e * np.pi / 2) ** 2) * (t >= a)
    bed *= 1 + g * e; bedR *= 1 + g * e
fx_rms = np.sqrt(np.mean(FX_L ** 2 + FX_R ** 2) / 2) + 1e-9; bed_rms = np.sqrt(np.mean(bed ** 2)) + 1e-9
k = fx_rms / bed_rms * 10 ** (-cfg.get('bed_db', 16) / 20)   # bed sits well below the hits
L += bed * k; R += bedR * k
# reverb: convolution with exponentially decaying stereo noise IR (~1.0 s), ~20 % wet
def reverb(x, seed):
    g = np.random.default_rng(seed); n = int(SR * 1.0); tt = np.arange(n) / SR
    ir = g.standard_normal(n) * np.exp(-tt / 0.22); ir = onepole_lp(ir, 5000); ir[:int(SR * .012)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    M = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, M) * np.fft.rfft(ir, M), M)[:len(x) + n]
    y[:n] += y[len(x):len(x) + n]; return y[:len(x)]    # wrap the tail to the start: loop-friendly
wet = cfg.get('wet', .2)
L2 = L * (1 - wet) + reverb(L, 11) * wet * 1.0; R2 = R * (1 - wet) + reverb(R, 12) * wet * 1.0
st = np.stack([L2, R2], 1); st /= np.abs(st).max() * 1.12
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
