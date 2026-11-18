import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "The tallest known cliff in the solar system: about twenty kilometers.",
 'l2': "What if you jumped off? Guess how long you'd fall.",
 'l3': "On Miranda, a moon of Uranus, gravity is over a hundred times weaker.",
 'l4': "No air, so nothing slows you down.",
 'l5': "Ten minutes in, you're still falling.",
 'l6': "Here comes the ground.",
 'l7': "Twelve minutes, forty-one seconds!",
 'l7b': "On Earth, with no air, the same fall takes just sixty-four seconds.",
 'l8': "Would you jump?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
