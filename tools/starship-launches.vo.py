# Kokoro narration for "How Many Launches to Land Starship on the Moon?" (starship-launches, 1M+ #8; am_michael 1.08).
# usage: cd <vo dir> && python3.13 starship-launches.vo.py <kokoro dir>
import sys, soundfile as sf
from kokoro_onnx import Kokoro
K = sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/kokoro'
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
L = {
 'l1': "Apollo landed on the Moon with one launch.",
 'l2': "How many does Starship need? Guess now.",
 'l3': "Apollo: one rocket, straight to the Moon.",
 'l4': "Starship starts with a fuel depot in orbit.",
 'l5': "Then more than ten tanker launches fill it up. SpaceX aims for one every six days.",
 'l6': "Why? The lander is a whole Starship. It has to refill its tanks in orbit before it can land and climb back up.",
 'l7': "It launches last, fills up at the depot, and heads for the Moon.",
 'l8': "Thirteen Starship launches, at least. Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
