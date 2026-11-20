import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What if you stood on Titan, Saturn's biggest moon? Guess: could you fly there?",
 'l2': "The air presses one and a half times harder than on Earth. So, no pressure suit needed.",
 'l3': "But it's minus one hundred seventy-nine degrees Celsius, with no oxygen. You'd need a very warm suit, and your own air.",
 'l4': "Now the fun part. Gravity is only one seventh of Earth's. A seventy-kilo person would weigh like ten. And the air is four times denser than ours.",
 'l5': "So strap wings to your arms, run, and flap. You might actually take off!",
 'l6': "Would you try it?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.1, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
