# Kokoro narration for "solar-system-helix" (am_michael 1.08). usage: cd <vo dir> && python3 solar-system-helix.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Right now, you're flying through space. But how fast?",
 'l2': "Earth circles the Sun at a hundred and seven thousand kilometers per hour.",
 'l3': "But the Sun isn't standing still.",
 'l4': "It drags every planet around the galaxy, at seven hundred and twenty thousand kilometers per hour.",
 'l5': "So we don't move in circles. We move in spirals.",
 'l6': "And one lap around the galaxy? Two hundred and thirty million years.",
 'l7': "Since you started watching, you've traveled thousands of kilometers.",
 'l8': "Did you feel it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
