# hair-in-space — v1 built (run yt-0009-uj6t, 20 Nov 00:09). Target slot 24 Nov 2026 21:00 Europe/London (series "Life in Space", family Q)
topic key: hair washing in space — not in registry (checked 74 rows + synonyms; space toilet #71 / drinking water 0c / salt #31 = other Life-in-Space topics; water recycling only named as the payoff)
Facts: NASA APOD 20 Dec 2017 (Karen Nyberg: squirt package of water, no-rinse shampoo, towel + comb; water evaporates, captured by the station's air conditioning, purified into drinking water); NASA iss072e742508 (water ball held by surface tension).
## Build
Scene tools/p_hair-in-space.html. render-range.js hair-in-space 0 840. VO tools/hair-in-space.vo.py; bed tools/hair-in-space.sound.py.
Mix: mix-vo.py . bed.wav mix0.wav 28.0 l1=0.1 l2=5.0 l3=8.8 l4=13.0 l5=18.1 l6=25.2; afade in 0.06, out at 27.9.
## Gate (v1)
1080x1920, 30 fps, AAC, 28.0 s; -15.8 LUFS, -2.4 dBTP; HF 20.5 dB below; first/last YAVG 89.8/89.7; text zones {}; spelling clean.
