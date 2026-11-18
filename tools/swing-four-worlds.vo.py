import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Same swing, four worlds. Which one is slowest?",
 'l2': "Earth: one swing every three point two seconds.",
 'l3': "Mars: five point three.",
 'l4': "The Moon: eight.",
 'l5': "Pluto hasn't finished even one. Guess how long it takes.",
 'l6': "Twelve point nine seconds! Earth did four.",
 'l7': "Your weight doesn't matter. Only gravity and the rope.",
 'l8': "Pluto pulls sixteen times weaker, so it swings four times slower.",
 'l9': "Which world would you swing on?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
