# Kokoro narration for "How Old Would You Be on Every Planet?" (am_michael 1.08). usage: cd <vo dir> && python3.13 planet-age.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "You're twenty on Earth. How old are you on every other planet?",
 'l2': "On Mercury? Eighty-three!",
 'l3': "Venus, thirty-two and a half. Mars? Ten and a half.",  # speed 1.15
 'l4': "Now the giants.",
 'l5': "Jupiter? Not even two.",
 'l6': "Saturn, Uranus, Neptune... you're not even one!",
 'l7': "Neptune was discovered in eighteen forty-six.",
 'l8': "Its first full lap around the Sun? Done in twenty eleven.",
 'l9': "On Neptune, you turn one at a hundred and sixty-five!",
 'l10': "How old are you on Mars?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.15 if n == 'l3' else 1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
