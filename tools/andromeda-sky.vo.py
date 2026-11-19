import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "There's a whole galaxy in our night sky, and it's bigger than the full Moon.",
 'l2': "Guess: how many full Moons wide?",
 'l3': "The Andromeda galaxy is about six times wider than the full Moon. From a dark sky, your eye sees only its bright core, a faint smudge.",
 'l4': "It's two and a half million light-years away. The light you see left it long before our species existed.",
 'l5': "Can you find it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
