import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Same shout, four worlds. Who hears it first?",
 'l2': "Venus wins! Its thick, hot air carries sound at about four hundred ten meters per second.",
 'l3': "Earth: three hundred forty-three. Mars, with thin, cold air: just two hundred forty.",
 'l4': "And the Moon? No air, so no sound at all. Your friend never hears you.",
 'l5': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
