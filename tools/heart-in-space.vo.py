import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/claude-0/kokoro/kokoro-v1.0.onnx', '/tmp/claude-0/kokoro/voices-v1.0.bin')
L = {
 'l1': "What happens to your heart in space? Guess: bigger, smaller, or rounder?",
 'l2': "Rounder, and smaller. In a NASA study of twelve astronauts, it became about nine percent more spherical.",
 'l3': "In weightlessness, it no longer pumps blood uphill from your feet. So it works less.",
 'l4': "On his year in space, Scott Kelly's main pumping chamber lost about three quarters of a gram a week, even with exercise six days a week.",
 'l5': "The surprise? A swimmer who spent a hundred fifty-nine days in the Pacific lost it just as fast. Floating takes away the uphill too.",
 'l6': "Back on Earth, the shape returns to normal.",
}
for n, s in L.items():
    a, sr = k.create(s, voice='am_michael', speed=1.08, lang='en-us')
    sf.write(f'{n}.wav', a, sr); print(n, round(len(a)/sr, 2))
