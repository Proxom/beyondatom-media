import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "In space, your bones get weaker. But how fast?",
 'l2': "One month in orbit equals how many years of aging? Guess.",
 'l3': "On Earth, an older person's hips lose up to one percent of their bone a year.",
 'l4': "In orbit, astronauts lose about one to one and a half percent. Every month.",
 'l5': "So one month up there is like a year or more of aging bones.",
 'l6': "Floating, your bones carry no weight. The cells that build bone slow down, but the ones that remove it don't.",
 'l7': "That's why astronauts exercise about two hours a day.",
 'l8': "Would you trade some bone for this view?",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
