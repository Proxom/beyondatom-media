import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "December's sky: four dates to save. Which one will you watch?",
 'l2': "December ninth: new Moon. The darkest nights of the month.",
 'l3': "The night of the thirteenth: the Geminids peak, one of the best meteor showers of the year. And a thin crescent Moon sets early.",
 'l4': "December twenty-first: the solstice. The longest night of the year in the Northern Hemisphere.",
 'l5': "And on Christmas Eve, a full Moon.",
 'l6': "Save the dates!",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
