import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "This scar across Mars is a canyon. And it makes our Grand Canyon look tiny.",
 'l2': "Guess: how many times longer is it?",
 'l3': "Valles Marineris is about four thousand kilometers long. Nearly ten times longer! On Earth, it would stretch across the United States, coast to coast.",
 'l4': "And in places, its walls rise over seven and a half kilometers. More than four times deeper, and nearly as tall as Mount Everest.",
 'l5': "Would you hike it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
