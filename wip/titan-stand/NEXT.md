# titan-stand — for 26 Nov 2026 21:00 Europe/London (series "What If…?", family Q). Run yt-1907 (20 Nov 19:07)
topic key: titan surface conditions — not in registry (checked 76 rows + synonym groups; no Titan row at all)
Facts: NASA Titan Facts; NASA press release 19-052 Dragonfly (4x denser air, +50 % pressure, -179 C); NASA "Five reasons" (1/7 g, no oxygen); Planetary Society stand-on-Titan article (1.5x pressure, insulated suit, wings + run + flap could take off) and Titan page (no pressure suit).
## Build
Scene tools/p_titan-stand.html (canvas 2-D, no images). Serve tools/ (python3 -m http.server 8765 --bind 127.0.0.1); BASE=http://127.0.0.1:8765 node tools/render-range.js titan-stand 0 1050 (3 ranges in parallel, ~1 min).
VO tools/titan-stand.vo.py (python3.13, kokoro-onnx, am_michael 1.1); bed tools/titan-stand.sound.py (python3.13).
Mix: mix-vo.py . bed.wav mix0.wav 35.0 l1=0.15 l2=4.9 l3=10.4 l4=18.2 l5=28.3 l6=32.9; then highshelf -4 @3.8k, volume +1.3 dB, afade in 0.06 / out at 34.92, alimiter=limit=0.63:level=false  (NOTE: without level=false the new ffmpeg alimiter auto-gains to -11.7 LUFS / +0.2 dBFS).
## Gate v1
1080x1920, 30 fps, H.264, AAC, 35.0 s; -15.5 LUFS, -3.7 dBTP; HF (>4 kHz) 20.4 dB below; first/last YAVG 118.7/118.4; text zones {}; spelling clean.
## Review r1: avg 6.25 (hook 6, visual 6, clarity 6, payoff 7), no fact errors.
Fixes (v2): density card split ("THICK AIR + LOW GRAVITY = EASY FLYING" over the "4 TIMES DENSER AIR" counter); counters/cards moved up and astronaut down + smaller hop (no helmet/text collision); "AND NO OXYGEN" ice-blue; heated-suit labels earlier/bigger; hook astronaut tilted mid-flap; "the lake" removed from the description.
