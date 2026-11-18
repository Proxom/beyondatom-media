# miranda-cliff — DONE v2, media/miranda-cliff/. For 21 Nov 2026 01:00 Europe/London (series "What If…?", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: miranda cliff fall — not in registry (checked 60 rows; nearest: "baumgartner jump" #40 (Earth stratosphere jump), "fall into jupiter" #42 — different place and physics)
Verona Rupes ~20 km (NASA APOD 27 Nov 2016, "about 12 minutes"). Miranda GM 4.4 km3/s2 (6.6e19 kg), R 235.8 km: g 0.0791 surface / 0.0672 top. Fall with g(r): 761.1 s = 12 min 41 s, 54.0 m/s = 194 km/h. 5 min: 3.0 km fallen, 73 km/h; 10 min: 7.7 km left, 150 km/h.
## Build
Scene tools/p_miranda-cliff.html (canvas 2-D, no images). BASE=http://127.0.0.1:8765 node tools/render-range.js miranda-cliff 0 930.
VO tools/miranda-cliff.vo.py; bed tools/miranda-cliff.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 31.0 l1=0.1 l2=3.6 l3=6.6 l4=12.4 l5=16.95 l6=19.7 l7=21.7 l8=27.5, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 31.0 s; -15.6 LUFS, -2.2 dBTP; HF 19.7 dB below; first/last YAVG 51/49; text zones {}; spelling clean.
## Review
r1 (v1): numbers PASS (reviewer: 760.7 s, 54.05 m/s, g 0.0792 / 0.0673, 5 min 3.04 km 73 km/h, 10 min 7.68 km; NSSDC + APOD checked live). Avg 6.0 (hook 7, visual 5, clarity 7, payoff 5).
Fixes applied once (v2, 32.0 s): astronaut stands on the ledge and jumps at 3.6 s (clock 0:00, then "?:??" until 6.4 s so the guess is not spoiled); "tallest known cliff ... about twenty kilometers"; "10 MINUTES IN…" card starts when the clock reads 10:00; Uranus fades as the floor nears (no clipped half-disc); astronaut stays visible after landing + 0.35 s camera shake + boulders on the ground; new beat "ON EARTH (NO AIR): JUST 64 SECONDS" + VO l7b.
Mix v2: l1=0.1 l2=4.3 l3=7.2 l4=12.4 l5=17.7 l6=19.8 l7=21.7 l7b=24.6 l8=28.95.
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 32.0 s; -15.6 LUFS, -2.3 dBTP; HF 20.6 dB below; first/last YAVG 51/49; text zones {}; spelling clean.
Lesson: when the hook asks for a guess about a duration, hide the running clock until the guess card is gone.
