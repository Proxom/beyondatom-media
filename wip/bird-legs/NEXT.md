# bird-legs — DONE v2, media/bird-legs/. For 21 Nov 2026 17:00 Europe/London (series "Your Body in Space", style B, family Q). Run yt-2207-albattani-itah06 (18 Nov 22:07)
topic key: fluid shift space — not in registry (checked 61 rows; nearest "astronaut height" #30 = spine lengthening, "crying in space" #45 = tears; different mechanism)
Source: NASA NTRS 19750006319 (Thornton, Hoffler, Rummel 1974, Skylab 4): >2 L extravascular fluid lost from calf + thigh by the first in-flight measurement (day 3); puffy facies + bird legs photographed; after recovery a major portion of the reversal completed in a few hours.
## Build
Scene tools/p_bird-legs.html (canvas 2-D; needs tools/pl/as17-148-22727.jpg via `bash tools/fetch-pl.sh as17-148-22727`; serve tools/ over http). BASE=http://127.0.0.1:8765 node tools/render-range.js bird-legs 0 840.
VO tools/bird-legs.vo.py; bed tools/bird-legs.sound.py.
Mix: tools/mix-vo.py . bed.wav mix0.wav 28.0 l1=0.1 l2=3.0 l3=7.65 l4=10.9 l5=13.35 l6=16.5 l7=20.3 l8=24.3, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Gate (v1)
1080x1920, 30 fps, CRF 18, AAC, 28.0 s; -15.3 LUFS, -2.4 dBTP; HF 22.3 dB below; first/last YAVG 63/62; text zones {}; spelling clean.
## Review
r1 (v1): FACT FAIL on screen (description passed): (A) day counter + shape change implied a day-by-day course the source does not have; (B) "GRAVITY: OFF/ON" wrong (orbit = free fall, ~90% g); (C) bottle "2 L" vs "more than 2 L"; (D) "most ... within hours" stronger than "a major portion ... a few hours". Avg 5.75 (hook 5, visual 6, clarity 7, payoff 5).
Fixes (v2): body shape changes only at the day-3 reveal (13.35 s); days 1-2 show "…"; "WEIGHTLESS IN ORBIT" / "BACK TO 1 G"; bottle "2+ L", bigger; quiz chips A CUP / 1 LITER / 2 LITERS on screen, answer chip "2+ LITERS" in green; hook opens on the day-3 result with PUFFY FACE / BIRD LEGS labels + "WHY DO ASTRONAUTS GET BIRD LEGS?", then rewinds; "MUCH FLOWS BACK IN A FEW HOURS" (VO "much of it flows back within a few hours"); description says free fall. Earth photo clipped to a circle (no square edge).
Mix v2: l1=0.1 l2=2.4 l3=7.65 l4=10.9 l5=13.35 l6=16.5 l7=20.3 l8=24.3.
Gate v2: 1080x1920, 30 fps, CRF 18, AAC, 28.0 s; -15.3 LUFS, -2.3 dBTP; HF 22.4 dB below; first/last YAVG 63/63; text zones {}; spelling clean.
Lesson: when a source gives only one measurement, never animate a time course toward it; reveal it at the measured moment.
