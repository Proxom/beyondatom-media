import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What does fire look like in space?",
 'l2': "Guess how long a candle can burn in orbit.",
 'l3': "On Earth, hot air rises and pulls fresh air in. That stretches the flame.",
 'l4': "In orbit, there is no up. Fresh air only drifts in slowly.",
 'l5': "So the flame is round, small, and dim blue.",
 'l6': "On the Shuttle, under a minute. But on Mir, up to forty-five minutes!",
 'l7': "Before it goes out, it pulses about once a second.",
 'l8': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
