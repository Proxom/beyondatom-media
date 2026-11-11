# Kokoro narration for "How Small Can Things Get?" (planck-length). usage: python3 planck-length.vo.py
import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'p1': "How small can things get?",
 'p2': "Let's zoom into your fingertip. Every step, ten times smaller.",
 'p3': "Skin cells.",
 'p4': "DNA.",
 'p5': "One atom.",
 'p6': "Its nucleus.",
 'p7': "One proton.",
 'p8': "That took thirteen zooms. Now, twenty more. Into a scale no one has ever seen.",
 'p9': "The Planck length. A proton is a hundred billion billion times bigger.",
 'p10': "Physicists suspect this is where gravity and quantum physics meet. Nobody knows what's down here.",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us'); sf.write(f'/tmp/claude-0/pl/vo/{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
