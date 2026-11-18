import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Same throw, four worlds. Who throws farthest?",
 'l2': "Earth: eleven and a half meters.",
 'l3': "Mars: twenty-eight.",
 'l4': "On the Moon, it stays up for nine seconds.",
 'l5': "Sixty-three meters.",
 'l6': "But on Pluto, the ball is still flying.",
 'l7': "Guess where it lands.",
 'l8': "Pluto pulls sixteen times weaker than Earth.",
 'l9': "A hundred and sixty-three meters. Fourteen times farther!",
 'l10': "Which world would you throw on?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
