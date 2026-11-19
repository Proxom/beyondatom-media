# shout-four-worlds — DONE v2, media/shout-four-worlds/; for 24 Nov 2026 01:00 Europe/London (series "Who Lands / Wins First?", style A, family Q). Run yt-0407-albattani-sgrjtz (19 Nov 04:07)
topic key: speed of sound on planets — not in registry (checked 66 rows incl. synonym groups; nothing about sound)
Facts: Venus ~409 m/s (Petculescu & Lueptow 2007 Icarus model, 100 Hz wavelength 4.09 m), Earth 343 m/s, Mars ~240 m/s (NASA JPL Perseverance 2022), Moon no air -> no sound.
## Build
Scene tools/p_shout-four-worlds.html (canvas 2-D). render-range.js shout-four-worlds 0 765 (3 chunks, ~20 s).
VO tools/shout-four-worlds.vo.py (python3.13); bed tools/shout-four-worlds.sound.py.
Mix: mix-vo.py vo bed mix0.wav 25.5 l1=0.1 l2=5.2 l3=11.4 l4=17.4 l5=21.9 (v2; race starts T0=-1.0 so waves show in frame 0; arrivals 3.89/4.83/7.33 s), then highshelf -4 @3.8k, measured gain to -15.3, afade in 0.06 / out 0.08, alimiter 0.63.
(Single-pass loudnorm on an already normalized mix pushed it to -11 LUFS; a hard onset at sample 0 made AAC overshoot to -0.9 dBTP -> fade-in fixed it.)
## Gate (v1)
1080x1920, 30 fps, H.264 (encode.sh 2-pass), AAC, 25.5 s; -15.5 LUFS, -3.9 dBTP; HF 22.5 dB below; first/last YAVG 52.9/52.9; text zones {}; spelling clean.
## Review
r1: FACTS FAIL on framing only: "thick, hot air = fastest" (sound speed depends on temperature/composition, not density; Petculescu & Lueptow credit temperature). All numbers and arithmetic correct. Avg 6.75 (hook 6, visual 7, clarity 7, payoff 7).
v2 fixes (once): "HOT AIR = FASTEST", tags "very hot air"/"cold air", VO "scorching hot"/"freezing cold", description explains temperature; "!" moved beside the friend; stray Earth glow removed from the Moon row; people 0.8 scale, rows 203 px; race starts 0.6 s earlier so the first frame already moves.
## Gate (v2)
1080x1920, 30 fps, AAC, 25.5 s; -15.5 LUFS, -3.8 dBTP; HF 22.2 dB below; first/last YAVG 53.3/53.4; text zones {}; spelling clean.
