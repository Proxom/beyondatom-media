# Kokoro narration for "Fly around every planet" (am_michael 1.08). usage: cd <vo dir> && python3 fly-around-planets.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Fly a jet around every planet, non-stop. Which trip takes the longest?",
 'l2': "Mercury, seventeen hours. Mars, under a day.",
 'l3': "Earth? Almost two days.",
 'l4': "Now the giants.",
 'l5': "Neptune and Uranus, about a week.",
 'l6': "Saturn, seventeen and a half days. Jupiter, almost three weeks!",
 'l7': "But what about the Sun?",
 'l8': "Two hundred and two days. More than half a year, without ever landing.",
 'l9': "Which one surprised you?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
