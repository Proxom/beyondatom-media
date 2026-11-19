# space-toilet — v2 built, media/space-toilet/. For 20 Nov 2026 21:00 Europe/London (series "Life in Space", family Q). Run yt-1814-albattani (19 Nov 18:14)
topic key: space toilet — not in registry (checked 70 rows + synonym groups; drinking water 0c = how astronauts drink, not the toilet; sleep #69, crying #45, salt #31 = other daily-life topics)
Facts: NASA "Boldly Go!" 2020 (air flow pulls urine and feces away; funnel + hose, seat; lid starts air flow; foot restraints + handholds; pre-treated urine to water recycling); NASA 2023 water recovery milestone (98% of the water crews bring).
## Build
Scene tools/p_space-toilet.html (canvas 2-D, no images). render-range.js space-toilet 0 888.
VO tools/space-toilet.vo.py; bed tools/space-toilet.sound.py (python3.13). Mix: mix-vo.py . bed.wav mix0.wav 29.6 l1=0.1 l2=4.75 l3=7.6 l4=14.45 l5=18.05 l6=27.3; afade in 0.06 / out at 29.52. Encode libx264 CRF 18 slow, AAC 192k.
## Review
r1 avg 7.0 (hook 7, visual 6, clarity 7, payoff 8). Overstated: "recovers 98% of its water" -> "can recover 98% of the water crews bring" (voice, card, description); "LOCKED IN" -> "HELD IN PLACE". Fixes once (v2): labels bigger and on the seat/funnel, 98% counter moved + faster, hook astronaut moved left (foot off the seat, out of the right zone).
## Gate (v2)
1080x1920, 30 fps, AAC, 29.6 s; -16.1 LUFS, -2.3 dBTP; HF 20.8 dB below; first/last YAVG 113.6/113.6; text zones {}; spelling clean.
