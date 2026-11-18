# earth-falls-sun — for 19 Nov 2026 01:00 Europe/London (series "What If…?", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: earth falls into sun — not in registry (checked 57 rows; nearest: "black hole replaces sun" #39, "sunlight travel time" #2, "sun size" #27 — different subject)
Thought experiment: Earth stops on its orbit and falls radially from 1 AU. Day 30 x=0.86; Venus orbit day 41.2; halfway day 52.8; Mercury orbit day 57.0; Sun surface day 64.6 at 616 km/s (NSSDC GM 132,712e6 km3/s2, R 695,700 km). Sunlight 1.911x (Venus) / 6.674x (Mercury), NSSDC irradiance.
## Build
Scene tools/p_earth-falls-sun.html (canvas 2-D; needs tools/pl/as17-148-22727.jpg from `bash tools/fetch-pl.sh as17-148-22727`; serve tools/ over http: `python3 -m http.server 8765 --bind 127.0.0.1`, then BASE=http://127.0.0.1:8765 node tools/render-range.js earth-falls-sun 0 945).
VO tools/earth-falls-sun.vo.py (Kokoro am_michael 1.08); bed tools/earth-falls-sun.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 31.5 l1=0.1 l2=3.0 l3=7.1 l4=11.7 l5=14.1 l6=19.9 l7=23.9 l8=28.5, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
Encode: libx264 CRF 18, preset slow, 30 fps, AAC 192k, 31.5 s.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 31.5 s; -15.5 LUFS, -2.3 dBTP; HF (>4 kHz) 19.0 dB below; first/last frame YAVG 28/24 (no black frame); text zones {}; spelling clean (only proper nouns/URLs).
