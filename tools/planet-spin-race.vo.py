# Kokoro narration for "Which Planet Spins the Slowest?" (am_michael 1.08). usage: cd <vo dir> && python3 planet-spin-race.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "One full spin on every planet. Which one is the slowest?",
 'l2': "Jupiter and Saturn, ten and eleven hours.",
 'l3': "Neptune, sixteen. Uranus, seventeen.",
 'l4': "Now the rocky planets.",
 'l5': "Earth, one day. Mars? Almost the same.",
 'l6': "Mercury? Fifty-eight days!",
 'l7': "And Venus...",
 'l8': "Two hundred and forty-three days, for one spin!",
 'l9': "That's longer than its whole year.",
 'l10': "And it spins backwards.",
 'l11': "Which one surprised you?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
