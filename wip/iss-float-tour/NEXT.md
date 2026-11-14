# iss-float-tour — 15 Nov 2026 17:00 Europe/London, 1M+ list #5 (style B, human / what it's like), run yt-2007-rubin-qc962z
outlier: Astronaut flying through the ISS (NASA, ~4.3M views) — topic only, nothing copied. Our twist: guess hook "How fast is this room moving?", house-tour cards, payoff at the Dragon window (8 km every second, 90-minute lap).

## Reference gate: what made the original work (3-5 points)
1. First-person float through the station: constant forward motion, hatch after hatch, no cuts that stop the movement.
2. Real footage, wide lens, frame full of detail (cables, racks, people floating), so every second has something to look at.
3. People floating in odd orientations (upside down, sideways): the instant "this is not Earth" signal.
4. Fast pace (footage sped up), short length, an Earth-window moment as the visual payoff.
5. Calm music under it; the feeling of living there.

## Footage
NASA "Step Inside the International Space Station" (Step_Inside_the_Station-4K-Clean, JSC, recorded 10 Oct 2022), ~large.mp4 1920x1080 30 fps.
Segments (source seconds): c1 126-142 (US Lab float + loop), c2 38-54 (hatch corridor), c3 117-127 (crew quarters), c4 434-448 (treadmill),
c5 266-282 (crew floating upside down), c6 832-858 (Dragon window, Earth).
Build: tools/footage-short2.py wip/iss-float-tour/edit.json (paths point at the scratchpad clips; re-extract with ffmpeg -ss <s> -t <len> -i <large url>).
VO tools/iss-float-tour.vo.py, bed tools/iss-float-tour.sound.py, mix tools/mix-vo.py (l1 .3, l2 3.35, l3 7.15, l4 9.6, l5 12.75, l6 16.95, l7 19.9, l8 23.6, l9 28.1).
Facts: NASA ISS Facts and Figures (see posts/iss-float-tour/caption.txt).
