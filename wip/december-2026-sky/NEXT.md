# december-2026-sky — DONE v2, media/december-2026-sky/. For 26 Nov 2026 17:00 Europe/London (time-bound exception of the 9 Nov block: "December 2026 sky: dates to save"). Run yt-1410-albattani- (19 Nov 14:10)
topic key: december 2026 sky events — not in registry (checked 67 rows; first monthly sky Short)
Facts: New Moon 9 Dec ~00:52 UT, Full Moon 24 Dec 01:28 UT (USNO via several secondary sources; USNO blocked here); Geminids active 4-17 Dec, peak 13-14 Dec, 40-50/h under dark skies (NASA), thin waxing crescent (AMS/IMO); solstice 21 Dec (time left out: sources disagree).
## Build
Scene tools/p_december-2026-sky.html (canvas 2-D; tools/pl/moon-full.jpg + tools/pl/as17-148-22727.jpg). render-range.js december-2026-sky 0 786.
VO tools/december-2026-sky.vo.py; bed tools/december-2026-sky.sound.py. Mix: mix-vo.py . bed.wav mix0.wav 26.2 l1=0.1 l2=4.1 l3=7.8 l4=15.9 l5=21.6 l6=24.0; same master chain (fade out at 26.12).
## Review
r1 avg 6.75 (hook 7, visual 6, clarity 8, payoff 6). Minor description error: "about 15% lit" (other sources 20-22%) -> "thin waxing crescent". Fixes (v2): VO l5 "a full Moon lights up Christmas Eve"; Earth lower/smaller so the axis and N clear the card; active tile text without shadow; tile row centred on the safe zone; twice as many Geminid meteors.
## Gate (v2)
1080x1920, 30 fps, AAC, 26.2 s; -15.5 LUFS, -3.8 dBTP; HF 20.5 dB below; first/last YAVG 22.2/22.2 (night scene, not black); text zones {}; spelling clean.
