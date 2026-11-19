# bone-loss-space — DONE v1, media/bone-loss-space/. For 23 Nov 2026 17:00 Europe/London (series "Your Body in Space", style B, family Q). Run yt-0007-albattani-auzo63 (19 Nov 00:07)
topic key: bone loss space — not in registry (checked 64 rows; nearest: astronaut height #30 = spine lengthening, fluid shift #58 = bird legs; different mechanisms)
Facts: 1-1.5 %/month hip+spine in flight (mostly pre-ARED) vs 0.5-1 %/year older people (Orwoll 2013 NASA Bone Summit; NASA Human Body in Space; NASA Risk of Bone Changes); builders slow / removers keep pace; ~2 h exercise a day (NASA Counteracting Bone and Muscle Loss).
## Build
Scene tools/p_bone-loss-space.html (canvas 2-D, fonts only). render-range.js bone-loss-space 0 1059.
VO tools/bone-loss-space.vo.py; bed tools/bone-loss-space.sound.py.
Mix: mix-vo.py vo bed.wav mix0.wav 35.3 l1=0.1 l2=3.3 l3=7.5 l4=12.3 l5=17.1 l6=21.2 l7=28.0 l8=31.7, then highshelf -4 @3.8k + loudnorm I=-15.3 TP=-3 + alimiter 0.63.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 35.3 s; -15.5 LUFS, -3.9 dBTP; HF 22.7 dB below; first/last YAVG 46.5/46.5; text zones {}; spelling clean.
## Review
r1: FACTS PASS (ratio 1-3 years confirmed; cells + 2 h exercise match NASA wording). Avg 7.0 (hook 7, visual 7, clarity 8, payoff 6) -> scheduled as is (rule: 7+). Description tightened: rates mostly pre-ARED.
Not done (ideas for a later remake/Part 2): open on the guess card "1 MONTH IN ORBIT = ? YEARS"; ghost segment on the orbit bar for the 1.5 % end ("or more"); orbit femur dots should not reset at 7.4 s; lattice as a connected mesh where red cells erase and green cells add struts; runner's head overlaps the window frame.
