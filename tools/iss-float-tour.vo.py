# Kokoro narration for "How Fast Is This Room Moving?" (iss-float-tour, 1M+ #5; am_michael 1.08). usage: cd <vo dir> && python3.13 iss-float-tour.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "Guess how fast this room is moving.",
 'l2': "In here, nobody walks. You push off, and float.",
 'l3': "Six sleeping quarters.",
 'l4': "A gym. Two hours of workouts, every day.",
 'l5': "And it's bigger inside than a six-bedroom house.",
 'l6': "But look out the window.",
 'l7': "This room is flying almost eight kilometers every second.",
 'l8': "Around the whole Earth in about ninety minutes.",
 'l9': "Would you live here?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
