# andromeda-sky — v2 built, media/andromeda-sky/. For 23 Nov 2026 21:00 Europe/London (series "How Big Is It?", family Q). Run yt-1814-albattani (19 Nov 18:14)
topic key: andromeda size in sky — not in registry (checked 73 rows + synonyms; sun size #27, nearest star #34, moon size #67 = other scale topics; no galaxy Short yet)
Picture: NASA/JPL-Caltech GALEX PIA15416 (public domain, ultraviolet) -> tools/pl/PIA15416.jpg from https://images-assets.nasa.gov/image/PIA15416/PIA15416~large.jpg. Scene needs http (BASE=http://127.0.0.1:8765).
Facts: NASA Hubble Messier 31 page (6x the full Moon's apparent diameter; easily visible with the unaided eye from a dark site; 2.5 million light-years); Smithsonian timeline (oldest Homo sapiens ~300,000 years).
## Build
Scene tools/p_andromeda-sky.html. render-range.js andromeda-sky 0 741. VO tools/andromeda-sky.vo.py; bed tools/andromeda-sky.sound.py.
Mix: mix-vo.py . bed.wav mix0.wav 24.7 l1=0.1 l2=4.4 l3=6.9 l4=16.2 l5=22.6; afade out at 24.62.
## Review
r1 avg 6.75 (hook 7, visual 7, clarity 7, payoff 6). Misleading: "6 Moons wide" + "you can see it with your naked eye" -> eye sees only the bright core, a faint smudge (voice, card "BY EYE, FROM A DARK SKY: ONLY ITS CORE", visual: outer disk fades to a small core); label "NASA UV IMAGE · BRIGHTENED · SIZE TO SCALE" (moved to y 1400); "FULL MOON" label from frame 0; galaxy 25 px left.
## Gate (v2)
1080x1920, 30 fps, AAC, 24.7 s; -15.9 LUFS, -2.3 dBTP; HF 20.5 dB below; first/last YAVG 38.9/39.0 (night sky, not black); text zones {}; spelling clean.
