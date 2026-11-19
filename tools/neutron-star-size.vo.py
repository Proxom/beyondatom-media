import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "This star is heavier than the Sun.",
 'l2': "So how big is it? As big as Earth? The Moon? Or a city?",
 'l3': "Start with the Sun. Now shrink it.",
 'l4': "Past Earth.",
 'l5': "Past the Moon.",
 'l6': "Down to about twenty kilometers across. The size of a city!",
 'l7': "It's a neutron star: the crushed core left after a giant star explodes.",
 'l8': "One sugar cube of it would weigh about a billion tons on Earth. As much as a mountain.",
 'l9': "Did you guess right?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
