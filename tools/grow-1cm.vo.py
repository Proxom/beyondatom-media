# Kokoro narration for "What If You Grew 1 cm Every Second?" (grow-1cm, 1M+ #7; am_michael 1.08).
# usage: cd <vo dir> && python3.13 grow-1cm.vo.py <kokoro dir>
import sys, soundfile as sf
from kokoro_onnx import Kokoro
K = sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/kokoro'
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
L = {
 'l1': "What if you grew one centimeter every second?",
 'l2': "After one minute, you're already too tall for the door.",
 'l3': "After one hour, thirty-eight meters.",
 'l4': "After one day, you're taller than the tallest building on Earth.",
 'l5': "So when do you pass Mount Everest? Guess now.",
 'l6': "Just ten days.",
 'l7': "After about fifteen months, your head reaches the space station's orbit.",
 'l8': "And after eighty years, you'd be almost twice as tall as Earth is wide.",
 'l9': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
