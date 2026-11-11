import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Drop a ball from a hundred meters on every planet. Which one lands last?",
 'l2': "Jupiter, first!",
 'l3': "But Saturn, ninety-five times heavier than Earth, is slower.",
 'l4': "Round two.",
 'l5': "Mercury and Mars are still falling...",
 'l6': "It's a tie!",
 'l7': "Mars has twice the mass, but it's wider. So the pull comes out the same.",
 'l8': "Which one surprised you?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
