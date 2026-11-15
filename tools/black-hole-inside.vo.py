# Kokoro narration for "What's Really Inside a Black Hole?" (black-hole-inside, 1M+ #6; am_michael 1.08).
# usage: cd <vo dir> && python3.13 black-hole-inside.vo.py <kokoro dir>
import sys, soundfile as sf
from kokoro_onnx import Kokoro
K = sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/kokoro'
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
L = {
 'l1': "What's inside a black hole?",
 'l2': "Here's what we know.",
 'l3': "This is not a simulation. It's the first real image of a black hole, released in 2019.",
 'l4': "It has six and a half billion times the mass of our Sun.",
 'l5': "Its edge is called the event horizon. Cross it, and nothing gets back out. Not even light.",
 'l6': "Now, what we don't know.",
 'l7': "Einstein's theory says the center may be a point where matter is crushed to infinite density.",
 'l8': "But that may just be where his theory stops working.",
 'l9': "And nothing from inside can ever reach us to tell.",
 'l10': "So what do you think is in there?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
