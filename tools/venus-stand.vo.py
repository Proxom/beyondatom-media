import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What if you stood on Venus? Guess: how deep in the ocean would it feel?",
 'l2': "The air is so heavy, it squeezes you like the sea, more than nine hundred meters down.",
 'l3': "Then the heat. Over four hundred sixty degrees Celsius. Hot enough to melt lead.",
 'l4': "The longest-lived lander there, Venera thirteen, was built for thirty-two minutes. It lasted two hours and seven.",
 'l5': "How long would you last?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
