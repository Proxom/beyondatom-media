# throw-four-worlds — 19 Nov 2026 17:00 Europe/London (series "Who Lands / Wins First?", style A, family Q). Run yt-0407-dirac-8gbprl (18 Nov 04:07)
topic key: throw on planets — not in registry (checked 55 rows; registry lists "thrown ball" as an allowed NEW experiment for the same-experiment series; jump and ball drop not repeated)
Same throw (10 m/s at 45°, released 1.5 m up, no drag) on Earth 9.82 / Mars 3.73 / Moon 1.62 / Pluto 0.62 m/s² (NSSDC fact sheets). Real time, one shared metre scale, camera zooms out.
Result: 11.5 / 28.2 / 63.2 / 162.8 m; 1.6 / 4.0 / 8.9 / 23.0 s. Pluto 14x Earth.
## Build
Scene tools/p_throw-four-worlds.html (canvas 2-D, fonts/ next to it; no images). Render: node tools/render-range.js throw-four-worlds 0 900.
VO tools/throw-four-worlds.vo.py (Kokoro am_michael 1.08); bed tools/throw-four-worlds.sound.py.
Mix: tools/mix-vo.py vo bed.wav mix0.wav 30.0 l1=0.1 l2=3.25 l3=5.25 l4=6.6 l5=9.3 l6=10.9 l7=14.0 l8=17.6 l9=22.95 l10=26.75, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
Encode: libx264 CRF 18, preset slow, 30 fps, AAC 192k.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 30.0 s; -15.2 LUFS, -2.4 dBTP; HF (>4 kHz) 24.4 dB below; first/last frame YAVG 101; text zones {}; spelling clean (only proper nouns).
