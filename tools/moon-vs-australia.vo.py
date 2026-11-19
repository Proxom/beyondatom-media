import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Is the Moon bigger than Australia? Guess before it lands.",
 'l2': "The Moon is about three thousand four hundred seventy-five kilometers across. Australia is almost four thousand wide, but only about three thousand two hundred from top to bottom. Wider, not taller!",
 'l3': "But the Moon is a ball. Peel off its whole surface and lay it flat,",
 'l4': "and it covers about as much as Africa and Australia put together. Nearly five Australias!",
 'l5': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
