import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What if Earth suddenly stopped orbiting the Sun?",
 'l2': "We'd fall straight in. Days, weeks, or months? Guess now.",
 'l3': "For a whole month, the Sun barely grows.",
 'l4': "But we keep speeding up.",
 'l5': "Day forty-one: Venus's orbit. Almost twice the sunlight.",
 'l6': "Day fifty-seven: Mercury's orbit. Over six and a half times.",
 'l7': "About sixty-five days. Impact at over six hundred kilometers a second.",
 'l8': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
