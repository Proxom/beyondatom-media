# space-flame — for 22 Nov 2026 01:00 Europe/London (series "Life in Space", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: fire in space — not in registry (checked 62 rows)
Sources: NASA NTRS 20010074076 (Shuttle + Mir candle flames: ~1.5 cm, dim blue, hemispherical; lifetimes up to 45 min in some tests; ~1 Hz oscillation before extinction), NTRS 20000005087 (Shuttle < 60 s, candle box limited O2), NASA image article "Candle Flame – 1g vs Microgravity".
## Build
Scene tools/p_space-flame.html (canvas 2-D, no images). BASE=http://127.0.0.1:8765 node tools/render-range.js space-flame 0 840.
VO tools/space-flame.vo.py; bed tools/space-flame.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 28.0 l1=0.1 l2=2.9 l3=6.45 l4=11.3 l5=15.25 l6=18.05 l7=22.05 l8=25.3, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 28.0 s; -15.3 LUFS, -2.4 dBTP; HF 19.5 dB below; first/last YAVG 43/42; text zones {}; spelling clean.
