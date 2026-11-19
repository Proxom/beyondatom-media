import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Same shot, four worlds. Three kilometers per second, straight up.",
 'l2': "Which ball never comes back?",
 'l3': "On Earth, it climbs higher than the Space Station,",
 'l4': "then falls back after eleven minutes.",
 'l5': "Mars and Mercury pull almost the same at the ground. So which ball goes higher?",
 'l6': "Mercury! It's smaller, so its pull fades faster as you climb.",
 'l7': "Mars lands after forty-nine minutes. Mercury, after sixty-nine.",
 'l8': "And the Moon's ball? Gone forever. It only needs two point four kilometers per second to escape.",
 'l9': "Where would you launch from?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
