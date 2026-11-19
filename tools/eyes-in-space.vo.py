import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Spend months in space, and your eyes can change shape.",
 'l2': "Guess: how many space station crew members show signs of it?",
 'l3': "In orbit, body fluids shift up toward the head. Scientists think this likely raises the pressure in the head.",
 'l4': "The back of the eyeball can flatten, and the optic disc, where the nerve enters the eye, can swell.",
 'l5': "Signs show up in roughly seventy percent of crew members. Some astronauts needed slightly stronger glasses.",
 'l6': "Would you risk it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
