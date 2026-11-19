import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Same pot, same stove, four worlds. Which one boils last?",
 'l2': "Mars is already boiling! Its air is so thin, water boils barely above freezing.",
 'l3': "Earth boils at one hundred degrees.",
 'l4': "Titan's thicker air pushes it to about one hundred eleven.",
 'l5': "And Venus? Its crushing air holds the water back until about three hundred five degrees!",
 'l6': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
