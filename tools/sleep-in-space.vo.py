import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "How do astronauts sleep in space? Lying down, standing up, or upside down?",
 'l2': "Any way they like! In orbit there is no up or down. They zip into a sleeping bag tied to the wall.",
 'l3': "But there's a danger. Without moving air, the carbon dioxide they breathe out can collect around their head.",
 'l4': "Astronauts can wake up gasping for air. So their sleeping cabins have air blowing through them.",
 'l5': "Could you sleep like that?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
