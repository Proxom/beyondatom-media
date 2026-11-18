# earth-tunnel — for 20 Nov 2026 01:00 Europe/London (series "What If…?", family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: gravity tunnel through earth — not in registry (checked 58 rows; nearest "iss free fall orbit" #22, "earth falls into sun" #54: different subject)
PREM radial fall pole to pole, no air: CMB (2,891 km) 12.73 min, ICB 17.02 min, centre 19.09 min at 9.92 km/s, far side 38.18 min (38 min 11 s = Klotz, AJP 83, 231 (2015)). Model mass 5.973e24 kg, g 9.821 m/s2.
## Build
Scene tools/p_earth-tunnel.html (canvas 2-D, no images). Serve tools/ (python3 -m http.server 8765 --bind 127.0.0.1); BASE=http://127.0.0.1:8765 node tools/render-range.js earth-tunnel 0 930.
VO tools/earth-tunnel.vo.py (Kokoro am_michael 1.08); bed tools/earth-tunnel.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 31.0 l1=0.1 l2=4.0 l3=6.9 l4=9.6 l5=13.4 l6=19.3 l7=21.5 l8=24.6 l9=27.7, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
Encode: libx264 CRF 18, preset slow, 30 fps, AAC 192k, 31.0 s.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 31.0 s; -15.9 LUFS, -2.4 dBTP; HF (>4 kHz) 20.9 dB below; first/last frame YAVG 98/95; text zones {} (big answer card moved down out of the top zone); spelling clean.
