# escape-four-worlds — v1 in media/escape-four-worlds/ (review pending). For 22 Nov 2026 17:00 Europe/London (series "Who Lands / Wins First?", style A, family Q). Run yt-0007-albattani-auzo63 (19 Nov 00:07)
topic key: escape velocity — not in registry (checked 62 rows; same-experiment series but a new mechanism: escape speed / gravity fading with height, not a jump/drop/throw/swing/fall)
Same ball straight up at 3 km/s, no air, on Earth / Mars / Mercury / Moon. Radial r'' = -GM/r^2 (NSSDC GM + mean radius). Peaks 493 / 1874 / 2422 km; lands 11.3 / 48.6 / 69.1 min; Moon escapes (ve 2.38).
Twist: Mars and Mercury have ~the same surface g (3.73 / 3.70) but Mercury's ball goes 30 % higher (smaller radius, g fades faster).
## Build
Scene tools/p_escape-four-worlds.html (canvas 2-D, fonts only). Serve tools/ (python3 -m http.server 8765 --bind 127.0.0.1); BASE=http://127.0.0.1:8765 node tools/render-range.js escape-four-worlds 0 1035.
VO tools/escape-four-worlds.vo.py; bed tools/escape-four-worlds.sound.py.
Mix: tools/mix-vo.py vo bed.wav mix0.wav 34.5 l1=0.1 l2=4.25 l3=6.0 l4=8.75 l5=11.2 l6=16.35 l7=20.5 l8=25.2 l9=31.5, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-3 + alimiter limit=0.63 (loudnorm alone gave -0.4 dBTP after AAC).
Encode: libx264 CRF 18 preset slow, 30 fps, AAC 192k.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 34.5 s; -15.6 LUFS, -3.7 dBTP; HF (>4 kHz) 20.5 dB below; first/last YAVG 41.7/39.6 (no black); text zones {}; spelling clean (only proper nouns/units).
