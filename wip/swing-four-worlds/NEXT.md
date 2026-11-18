# swing-four-worlds — DONE v2, media/swing-four-worlds/. For 20 Nov 2026 17:00 Europe/London (series "Who Lands / Wins First?", style A, family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: swing on planets — not in registry (checked 59 rows; same-experiment series: jump #25/#33, ball drop #41, throw #53 used; pendulum/swing listed as an allowed NEW experiment)
Same swing (2.5 m rope, 35°, no drag) on Earth 9.82 / Mars 3.73 / Moon 1.62 / Pluto 0.62 (NSSDC). Exact periods (RK4): 3.245 / 5.267 / 7.992 / 12.918 s (small-angle 3.17 / 5.14 / 7.81 / 12.62). Pluto/Earth = 3.98.
## Build
Scene tools/p_swing-four-worlds.html (canvas 2-D, no images; release 0.6 s before frame 0). Render: BASE=http://127.0.0.1:8765 node tools/render-range.js swing-four-worlds 0 900.
VO tools/swing-four-worlds.vo.py; bed tools/swing-four-worlds.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 30.0 l1=0.1 l2=3.1 l3=5.9 l4=7.7 l5=8.95 l6=12.4 l7=15.6 l8=19.8 l9=24.9, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 30.0 s; -15.7 LUFS, -2.5 dBTP; HF 21.3 dB below; first/last YAVG 106/106; text zones {} (cards moved to baseline 402 so the "12.9 SECONDS!" pop stays out of the top zone); spelling clean.
## Review
r1 (v1): FACTS PASS (reviewer recomputed exact periods with AGM: 3.246 / 5.267 / 7.991 / 12.918 s; first swings 2.65 / 4.67 / 7.39 / 12.32 s; ratios 15.84 and 3.98). Avg 6.5 (hook 6, visual 6, clarity 8, payoff 6).
Fixes applied once (v2): live "TIME FOR ONE SWING" bar in every lane from frame 0 (grows in real time, freezes at the first full swing, one shared scale, so Pluto's bar is 4x Earth's); Pluto finish = big "12.9 s" stamp + lane flash; "EARTH: 4 SWINGS" card starts at 12.40 s (Earth's 4th swing) so card and counter agree; no stars in Earth's day sky. Bottom UI zone left as ground (no payoff text there, safe-zone rule).
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 30.0 s; -15.7 LUFS, -2.5 dBTP; HF 21.3 dB below; text zones {}; spelling clean.
