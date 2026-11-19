import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What if you stood on Mercury, the closest planet to the Sun?",
 'l2': "The Sun looks over three times bigger than from Earth, and the ground can reach four hundred thirty degrees Celsius.",
 'l3': "But at night it plunges to minus one hundred eighty. There's almost no air to hold the heat.",
 'l4': "And the craziest part? In polar craters that never see sunlight, there's water ice.",
 'l5': "Would you visit?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
