import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "In orbit, nothing falls down. So how do astronauts use the toilet?",
 'l2': "Guess: a bag, a fan, or magnets?",
 'l3': "It's a fan! Air flow pulls everything away from the body, into a funnel and hose, or into a small seat.",
 'l4': "Foot restraints and handholds keep them from floating away.",
 'l5': "And the urine isn't wasted. It's cleaned and turned back into drinking water. The station can recover ninety-eight percent of the water crews bring.",
 'l6': "Could you go in space?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
