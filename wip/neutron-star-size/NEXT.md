# neutron-star-size — DONE v2, media/neutron-star-size/. For 23 Nov 2026 01:00 Europe/London (series "How Big Is It?", style C, family Q). Run yt-0007-albattani-auzo63 (19 Nov 00:07)
topic key: neutron star size — not in registry (checked 63 rows; nearest: black hole interior #50, human g tolerance #32 mentions a neutron star only as a final label; sun size #27 = "109 earths", not repeated: no Earths-across-Sun count here)
Facts: ~20 km across, heavier than the Sun (typ. 1.4, up to ~2 solar masses), sugar cube ~1 billion tons ~ a mountain (NASA Imagine, NASA Science, NASA Universe). Sun 1,391,400 / Earth 12,742 / Moon 3,475 km (NSSDC).
## Build
Scene tools/p_neutron-star-size.html (canvas 2-D; Earth photo tools/pl/as17-148-22727.jpg via `bash tools/fetch-pl.sh as17-148-22727`; serve tools/). render-range.js neutron-star-size 0 870.
VO tools/neutron-star-size.vo.py; bed tools/neutron-star-size.sound.py.
Mix: mix-vo.py vo bed.wav mix0.wav 29.0 l1=0.1 l2=2.2 l3=6.0 l4=8.45 l5=9.5 l6=10.9 l7=15.2 l8=20.3 l9=26.0, then highshelf -4 @3.8k + loudnorm I=-15.3 TP=-3 + alimiter 0.63.
## Gate (v1): 29.0 s, -15.5 LUFS, -3.9 dBTP, HF 21 dB below, YAVG 49/50, zones {} (card baseline 410 so the pop stays below 320), spelling clean.
## Review
r1 (v1): numbers all PASS; FACT FAIL on framing: "SHRINK THE SUN" + the Sun turning into the neutron star implied the Sun can become one. Avg 6.5 (hook 6, visual 6, clarity 7, payoff 7).
Fixes (v2): card "IMAGINE SQUEEZING / THE SUN…", VO "Imagine squeezing the Sun. Shrink it."; card "A NEUTRON STAR / CORE OF AN EXPLODED GIANT STAR"; city fades in from 10.8 s; green 20 km scale bar at 12.0 s; disclaimer line removed from the hook (in description); top shading without a hard edge; card 6 "ONE SUGAR CUBE OF IT… / WOULD WEIGH…"; "~20 km" label hidden before the loop. (Also before review: card/counter mismatch fixed: "ABOUT 20 km" only once the counter reads 20 km.)
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 29.0 s; -15.4 LUFS, -3.9 dBTP; HF 21.1 dB below; YAVG 48.9/49.7; zones {}; spelling clean.
Lesson: a thought-experiment morph (Sun -> neutron star) must be called imaginary on screen and in the voice, not only in the description.
