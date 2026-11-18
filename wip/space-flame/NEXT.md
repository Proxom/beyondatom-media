# space-flame — DONE v2, media/space-flame/. For 22 Nov 2026 01:00 Europe/London (series "Life in Space", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: fire in space — not in registry (checked 62 rows)
Sources: NASA NTRS 20010074076 (Shuttle + Mir candle flames: ~1.5 cm, dim blue, hemispherical; lifetimes up to 45 min in some tests; ~1 Hz oscillation before extinction), NTRS 20000005087 (Shuttle < 60 s, candle box limited O2), NASA image article "Candle Flame – 1g vs Microgravity".
## Build
Scene tools/p_space-flame.html (canvas 2-D, no images). BASE=http://127.0.0.1:8765 node tools/render-range.js space-flame 0 840.
VO tools/space-flame.vo.py; bed tools/space-flame.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 28.0 l1=0.1 l2=2.9 l3=6.45 l4=11.3 l5=15.25 l6=18.05 l7=22.05 l8=25.3, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 28.0 s; -15.3 LUFS, -2.4 dBTP; HF 19.5 dB below; first/last YAVG 43/42; text zones {}; spelling clean.
## Review
r1 (v1): FACTS PASS (both NTRS abstracts read). Avg 6.0 (hook 6, visual 6, clarity 7, payoff 5).
Fixes applied once (v2, 28.5 s): baseline for the payoff ("ON THE SHUTTLE: UNDER 1 MINUTE (BOXED IN)" + "< 1:00", then "ON MIR: UP TO 45 MINUTES! / IN SOME TESTS" with the clock to 45:00; VO l6 "On the Shuttle, under a minute. But on Mir, up to forty-five minutes!"); orbit flame drawn as a dim, see-through blue shell (halo halved, small shimmer); dimension lines "~4 cm tall" / "~1.5 cm wide". Did not use "45 times longer" (max vs typical).
Mix v2: l1=0.1 l2=2.9 l3=6.45 l4=11.3 l5=15.25 l6=18.05 l7=22.6 l8=25.8; loudnorm TP -3.2 (first master hit -1.9 dBTP).
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 28.5 s; -15.4 LUFS, -2.4 dBTP; HF 20 dB below; first/last YAVG 42/42; text zones {}; spelling clean.
