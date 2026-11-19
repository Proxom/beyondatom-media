# heart-in-space — v1 built, media/heart-in-space/. For 25 Nov 2026 17:00 Europe/London (series "Your Body in Space", style B, family Q). Run yt-1410-albattani- (19 Nov 14:10)
topic key: heart in space — not in registry (checked 65 rows + synonym groups; nearest: bone loss space #62, fluid shift space #58 (bird legs), astronaut height #30, human g tolerance #32 — different organ/mechanism)
Facts: ACC 2014 (NASA, 12 astronauts, 9.4% more spherical, returns to normal); NASA cardiovascular risk page; Circulation 2021 (Kelly 340 d, LV -0.74 g/wk, exercise 6 d/wk; Lecomte 159 d, -0.72 g/wk); UTSW 2021 (no pumping uphill from the feet).
## Build
Scene tools/p_heart-in-space.html (canvas 2-D; Earth photo tools/pl/as17-148-22727.jpg via `PATH=<dir with python3->python3.13>:$PATH bash tools/fetch-pl.sh as17-148-22727` (needs numpy); serve tools/). render-range.js heart-in-space 0 978.
VO tools/heart-in-space.vo.py; bed tools/heart-in-space.sound.py (lub-dub heartbeat at 1.15 Hz synced to beatOf()).
Mix: mix-vo.py . bed.wav mix0.wav 32.6 l1=0.1 l2=4.7 l3=10.5 l4=15.6 l5=24.5 l6=28.9; highshelf -4 @3.8k, +1.2 dB, afade 0.06 / out at 32.52, alimiter 0.63.
## Gate (v1)
1080x1920, 30 fps, H.264, AAC, 32.6 s; -15.4 LUFS, -3.7 dBTP; HF 19.4 dB below; first/last YAVG 68.8/69.2; text zones {}; spelling clean.
