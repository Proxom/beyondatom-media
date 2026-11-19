# heart-in-space — v1 built, media/heart-in-space/. For 25 Nov 2026 17:00 Europe/London (series "Your Body in Space", style B, family Q). Run yt-1410-albattani- (19 Nov 14:10)
topic key: heart in space — not in registry (checked 65 rows + synonym groups; nearest: bone loss space #62, fluid shift space #58 (bird legs), astronaut height #30, human g tolerance #32 — different organ/mechanism)
Facts: ACC 2014 (NASA, 12 astronauts, 9.4% more spherical, returns to normal); NASA cardiovascular risk page; Circulation 2021 (Kelly 340 d, LV -0.74 g/wk, exercise 6 d/wk; Lecomte 159 d, -0.72 g/wk); UTSW 2021 (no pumping uphill from the feet).
## Build
Scene tools/p_heart-in-space.html (canvas 2-D; Earth photo tools/pl/as17-148-22727.jpg via `PATH=<dir with python3->python3.13>:$PATH bash tools/fetch-pl.sh as17-148-22727` (needs numpy); serve tools/). render-range.js heart-in-space 0 978.
VO tools/heart-in-space.vo.py; bed tools/heart-in-space.sound.py (lub-dub heartbeat at 1.15 Hz synced to beatOf()).
Mix: mix-vo.py . bed.wav mix0.wav 32.6 l1=0.1 l2=4.7 l3=10.5 l4=15.6 l5=24.5 l6=28.9; highshelf -4 @3.8k, +1.2 dB, afade 0.06 / out at 32.52, alimiter 0.63.
## Gate (v1)
1080x1920, 30 fps, H.264, AAC, 32.6 s; -15.4 LUFS, -3.7 dBTP; HF 19.4 dB below; first/last YAVG 68.8/69.2; text zones {}; spelling clean.
## Review
r1 avg 6.25 (hook 7, visual 6, clarity 6, payoff 6). FACT ERROR (framing): "No gravity / Without gravity" -> the ISS has ~90% of g; crew is weightless (free fall) -> "WEIGHTLESS = NO UPHILL" / VO "In weightlessness". Misleading: "swimmer crossing the Pacific" (Lecomte stopped ~1/3) -> "spent 159 days in the Pacific". "heart muscle shrank" -> "main pumping chamber lost". Fixes applied once (v2): answer "Rounder, and smaller"; shape change drawn 3x and labelled; cyan thicker Earth outline; atria disc behind the body; astronaut up; "UPHILL" right; real minus avoided ("LOSES 0.74 g A WEEK"); "FLOATING IN WATER" note. Video 38.4 s.
Mix v2: mix-vo.py . bed.wav mix0.wav 38.4 l1=0.1 l2=4.7 l3=11.6 l4=16.8 l5=26.0 l6=34.7 (+ same master chain, fade out at 38.32).
## Gate (v2)
1080x1920, 30 fps, AAC, 38.4 s; -15.5 LUFS, -3.8 dBTP; HF 20.2 dB below; first/last YAVG 68.3/68.7; text zones {}; spelling clean.
