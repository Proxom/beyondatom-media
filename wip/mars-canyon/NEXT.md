# mars-canyon — v1 built (review pending). For 21 Nov 2026 21:00 Europe/London (series "How Big Is It?", family Q). Run yt-1814-albattani (19 Nov 18:14)
topic key: valles marineris — not in registry (checked 70 rows + synonyms; olympus mons (rejected) = volcano, mars blue sunset #17, mars surface curiosity 0b = other Mars topics)
Picture: NASA/JPL/USGS PIA00003 (public domain) -> tools/pl/PIA00003.jpg from https://images-assets.nasa.gov/image/PIA00003/PIA00003~large.jpg. Scene needs http (BASE=http://127.0.0.1:8765, python3 -m http.server in tools/) because of the image.
## Build
Scene tools/p_mars-canyon.html. render-range.js mars-canyon 0 870. VO tools/mars-canyon.vo.py; bed tools/mars-canyon.sound.py. Mix: mix-vo.py . bed.wav mix0.wav 29.0 l1=0.1 l2=5.4 l3=7.9 l4=18.0 l5=26.9; afade out at 28.92.
## Gate (v1)
1080x1920, 30 fps, AAC, 29.0 s; -15.7 LUFS, -2.3 dBTP; HF 21.6 dB below; first/last YAVG 85.3/85.4; text zones {}; spelling clean (proper nouns only).
