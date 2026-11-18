import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "In space, the fluid in your body starts moving up.",
 'l2': "How much leaves your legs in three days? A cup, a liter, or two liters?",
 'l3': "On Earth, gravity pulls fluid down into your legs.",
 'l4': "In space, nothing pulls it back down.",
 'l5': "More than two liters, by day three!",
 'l6': "That's why astronauts get puffy faces and skinny bird legs.",
 'l7': "Back on Earth, most of it flows back down within hours.",
 'l8': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
