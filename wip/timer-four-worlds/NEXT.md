# timer-four-worlds — v1 built (run yt-0009-uj6t, 20 Nov). Target slot 25 Nov 2026 21:00 Europe/London (series "Who Lands First?" / same experiment on 4 worlds, family Q)
topic key: sand timer on planets — not in registry (checked 75 rows + synonyms; jump/ball drop/throw/swing/escape/shout/boil = other experiments in the series; no granular-flow topic yet)
Facts: Beverloo et al. 1961 (flow rate ∝ sqrt(g), independent of fill height); Granular Matter 15, 263 (2013) (sqrt(g) scaling holds above and below 1 g); NSSDC gravities. Times 30 / 48.7 / 73.9 / 119.4 s.
## Build
Scene tools/p_timer-four-worlds.html. render-range.js timer-four-worlds 0 1002. VO tools/timer-four-worlds.vo.py; bed tools/timer-four-worlds.sound.py.
Mix: mix-vo.py . bed.wav mix0.wav 33.4 l1=0.1 l2=5.6 l3=9.25 l4=14.2 l5=16.3 l6=21.05 l7=22.7 l8=30.6; afade in 0.06, out at 33.3.
## Gate (v1)
1080x1920, 30 fps, AAC, 33.4 s; -15.8 LUFS, -2.3 dBTP; HF 20.8 dB below; first/last YAVG 49.3/49.3; text zones {}; spelling clean.
