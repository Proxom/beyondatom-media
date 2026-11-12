# Kokoro narration for "What Happens If You Cry in Space?" (am_michael 1.08). usage: cd <vo dir> && python3 cry-in-space.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What happens if you cry in space?",
 'l2': "On Earth, gravity pulls your tears down your cheeks.",
 'l3': "In space, nothing pulls them down.",
 'l4': "So the tears just stay on your eye, in a ball of water.",
 'l5': "This is real. Water on the Space Station, held in a ball by surface tension.",
 'l6': "Keep crying, and the ball just keeps growing...",
 'l7': "until it crosses your nose, into your other eye!",
 'l8': "Your eyes still cry. The tears just don't fall.",
 'l9': "Would you cry up there?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
