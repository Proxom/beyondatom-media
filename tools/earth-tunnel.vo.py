import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What if you jumped into a tunnel from the North Pole to the South Pole?",
 'l2': "How long to fall through? Guess now.",
 'l3': "Thirteen minutes: you reach the core.",
 'l4': "At the center, almost ten kilometers per second.",
 'l5': "Now gravity pulls you back, and you slow down.",
 'l6': "You stop right at the South Pole.",
 'l7': "Thirty-eight minutes, eleven seconds.",
 'l7b': "Not the textbook forty-two!",
 'l8': "Then you fall all the way back.",
 'l9': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
