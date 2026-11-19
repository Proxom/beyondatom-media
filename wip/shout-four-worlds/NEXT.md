# shout-four-worlds — v1 rendered, gate passed; for 24 Nov 2026 01:00 Europe/London (series "Who Lands / Wins First?", style A, family Q). Run yt-0407-albattani-sgrjtz (19 Nov 04:07)
topic key: speed of sound on planets — not in registry (checked 66 rows incl. synonym groups; nothing about sound)
Facts: Venus ~409 m/s (Petculescu & Lueptow 2007 Icarus model, 100 Hz wavelength 4.09 m), Earth 343 m/s, Mars ~240 m/s (NASA JPL Perseverance 2022), Moon no air -> no sound.
## Build
Scene tools/p_shout-four-worlds.html (canvas 2-D). render-range.js shout-four-worlds 0 765 (3 chunks, ~20 s).
VO tools/shout-four-worlds.vo.py (python3.13); bed tools/shout-four-worlds.sound.py.
Mix: mix-vo.py vo bed mix0.wav 25.5 l1=0.1 l2=5.7 l3=11.7 l4=17.7 l5=22.2, then highshelf -4 @3.8k, measured gain to -15.3, afade in 0.06 / out 0.08, alimiter 0.63.
(Single-pass loudnorm on an already normalized mix pushed it to -11 LUFS; a hard onset at sample 0 made AAC overshoot to -0.9 dBTP -> fade-in fixed it.)
## Gate (v1)
1080x1920, 30 fps, H.264 (encode.sh 2-pass), AAC, 25.5 s; -15.5 LUFS, -3.9 dBTP; HF 22.5 dB below; first/last YAVG 52.9/52.9; text zones {}; spelling clean.
