# earth-tunnel — DONE v2, media/earth-tunnel/. For 20 Nov 2026 01:00 Europe/London (series "What If…?", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: gravity tunnel through earth — not in registry (checked 58 rows; nearest "iss free fall orbit" #22, "earth falls into sun" #54: different subject)
PREM radial fall pole to pole, no air: CMB (2,891 km) 12.73 min, ICB 17.02 min, centre 19.09 min at 9.92 km/s, far side 38.18 min (38 min 11 s = Klotz, AJP 83, 231 (2015)). Model mass 5.973e24 kg, g 9.821 m/s2.
## Build
Scene tools/p_earth-tunnel.html (canvas 2-D, no images). Serve tools/ (python3 -m http.server 8765 --bind 127.0.0.1); BASE=http://127.0.0.1:8765 node tools/render-range.js earth-tunnel 0 930.
VO tools/earth-tunnel.vo.py (Kokoro am_michael 1.08); bed tools/earth-tunnel.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 31.0 l1=0.1 l2=4.0 l3=6.9 l4=9.6 l5=13.4 l6=19.3 l7=21.5 l8=24.6 l9=27.7, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
Encode: libx264 CRF 18, preset slow, 30 fps, AAC 192k, 31.0 s.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 31.0 s; -15.9 LUFS, -2.4 dBTP; HF (>4 kHz) 20.9 dB below; first/last frame YAVG 98/95; text zones {} (big answer card moved down out of the top zone); spelling clean.
## Review
r1 (v1): physics PASS (reviewer re-ran PREM: 12.72 / 17.02 / 19.09 min, 9.92 km/s, 38 min 10.7 s; mass 5.973e24, g 9.82). Avg 6.75 (hook 6, visual 7, clarity 8, payoff 6).
Fixes applied once (v2): clock rounds to the nearest second (arrival shows 38:11, matching VO/card); core card starts at the boundary time (7.03 s) and no longer carries a depth number that clashes with the readout ("INTO THE LIQUID OUTER CORE"); hook line 2 "MINUTES, HOURS OR DAYS?" + "NORTH POLE" label at the tunnel mouth; new beat 23.6-25.6 "NOT THE TEXTBOOK 42 MIN: THE HEAVY CORE SPEEDS YOU UP" + VO l7b "Not the textbook forty-two!"; description: gravity "at or above" surface strength, ~10.7 m/s² at the top of the core.
Mix v2: l1=0.1 l2=4.0 l3=6.9 l4=9.6 l5=13.4 l6=19.3 l7=21.5 l7b=23.9 l8=25.7 l9=27.75.
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 31.0 s; -15.8 LUFS, -2.5 dBTP; HF 21.0 dB below; first/last YAVG 98/95; text zones {}; spelling clean.
Lesson: a clock and a card that show the same moment must use the same rounding and trigger at the model's own event time.
