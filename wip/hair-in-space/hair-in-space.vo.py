import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "In space, water doesn't run down. So how do astronauts wash their hair?",
 'l2': "Squirt some water on. It doesn't fall. It clings to the hair.",
 'l3': "Then no-rinse shampoo, and lots of work with a towel and a comb.",
 'l4': "Guess: where does the leftover water go? A drain, the towel, or the air?",
 'l5': "The air! It evaporates. The station's air conditioning captures it, and it's purified into drinking water.",
 'l6': "Would you drink it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
