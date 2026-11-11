import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'j1': "What if you fell into Jupiter?",
 'j2': "There's no ground to land on.",
 'j3': "In 1995, NASA dropped a probe in. It hit the air at a hundred and seventy thousand kilometers per hour.",
 'j4': "Then it parachuted down, through the clouds.",
 'j5': "The deeper it went, the thicker and hotter the air got.",
 'j6': "After fifty-eight minutes: twenty-three times Earth's air pressure, and about a hundred and fifty degrees Celsius. The probe went silent.",
 'j7': "How deep was that? A hundred and fifty-six kilometers. Not even a quarter of one percent of the way to the center.",
 'j8': "Would you jump?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us'); sf.write(f'/tmp/claude-0/jup/vo/{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
