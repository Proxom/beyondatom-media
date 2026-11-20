import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "The same thirty-second sand timer, on four worlds. How long will it take on Pluto?",
 'l2': "Earth: thirty seconds.",
 'l3': "Mars: forty-nine.",
 'l4': "The Moon: one minute, fourteen.",
 'l5': "Pluto is still going. Guess: one, two, or five minutes?",
 'l6': "About two minutes!",
 'l7': "Sand flows slower in weaker gravity. Pluto pulls sixteen times weaker, so its timer runs four times slower.",
 'l8': "Would you wait that long?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
