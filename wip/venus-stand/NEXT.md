# venus-stand — v1 built, media/venus-stand/. For 24 Nov 2026 17:00 Europe/London (series "What If…?" / Your Body, family Q). Run yt-1410-albattani- (19 Nov 14:10)
topic key: venus surface conditions — not in registry (checked 63 rows + synonym groups; nearest "venus day length" #3 = rotation, "speed of sound on planets" #63 = sound; different subject)
Facts: NASA Venus Facts (~93x pressure = >930 m underwater, hot enough to melt lead), NASA temps page 464 °C, NSSDC Venera 13 2 h 7 min, Beyond Earth planned 32 min, RSC lead 327.5 °C.
## Build
Scene tools/p_venus-stand.html (canvas 2-D, no images). Serve tools/ (python3 -m http.server 8765 --bind 127.0.0.1); BASE=http://127.0.0.1:8765 node tools/render-range.js venus-stand 0 765 (link /tmp/claude-0/pl/f_venus-stand -> tools/f_venus-stand for encode.sh).
VO tools/venus-stand.vo.py (python3.13); bed tools/venus-stand.sound.py (python3.13).
Mix: mix-vo.py . bed.wav mix0.wav 25.5 l1=0.15 l2=4.5 l3=11.4 l4=17.2 l5=22.75; then highshelf -4 @3.8k, volume +1.3 dB, afade in 0.06 / out 0.08, alimiter 0.63.
## Gate (v1)
1080x1920, 30 fps, H.264 (encode.sh 2-pass), AAC, 25.5 s; -15.6 LUFS, -3.8 dBTP; HF (>4 kHz) 20.6 dB below; first/last YAVG 94.0/94.0; text zones {}; spelling clean. Anton has no '×' glyph look -> "PRESSURE: 93 TIMES".
