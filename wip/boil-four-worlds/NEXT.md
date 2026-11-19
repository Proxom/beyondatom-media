# boil-four-worlds — v1 built, media/boil-four-worlds/. For 25 Nov 2026 01:00 Europe/London (series "Who Lands / Wins First?", style A, family Q; 2nd of the 23-29 Nov week). Run yt-1410-albattani- (19 Nov 14:10)
topic key: boiling point on planets — not in registry (checked 64 rows + synonym groups; nothing about boiling/pressure-boiling; nearest "speed of sound on planets" #63 = sound, "venus surface conditions" #64 = pressure/heat on a person)
Facts: IAPWS-IF97 saturation temperature at NSSDC/Huygens pressures: Mars 6.36 mbar -> 0.55 °C; Earth 1.013 bar -> 100 °C; Titan 1.467 bar -> 110.7 °C; Venus 92 bar -> 304.9 °C.
## Build
Scene tools/p_boil-four-worlds.html (canvas 2-D, no images). render-range.js boil-four-worlds 0 708 (3 chunks). Shared temperature knots (-0.5,20),(10.5,100),(14.5,110.7),(20.2,304.9).
VO tools/boil-four-worlds.vo.py; bed tools/boil-four-worlds.sound.py (python3.13).
Mix: mix-vo.py . bed.wav mix0.wav 23.6 l1=0.1 l2=4.2 l3=9.8 l4=12.0 l5=15.6 l6=21.3; highshelf -4 @3.8k, +1.2 dB, afade in 0.06 / out 0.08 at 23.52, alimiter 0.63.
Anton renders "~" like a minus sign: never use "~" before numbers (use "ABOUT").
## Gate (v1)
1080x1920, 30 fps, H.264 (encode.sh 2-pass), AAC, 23.6 s; -15.1 LUFS, -3.9 dBTP; HF 20.5 dB below; first/last YAVG 62.7/62.7; text zones {}; spelling clean.
