# grow-1cm — 1M+ list #7 for 17 Nov 2026 17:00 Europe/London (style C: scale shock, live height counter). NOT STARTED (prep by yt-0407-dirac-o2rc1n, 15 Nov 05:10)
Why not built at 04:07: queue went 1 -> 2 with black-hole-inside (16 Nov 17:00); ~55 min left in the 2-hour cap, too little for a new animation at the cinematic standard. The 12:07 run builds it (queue is 2, so it must).
outlier: "What if you grew 1 cm every second?" (What If channel, ~3.3M) — topic only, nothing copied.

## Reference gate: what made the original work (3-5 points)
1. One continuous zoom-out from a human: the person stays the subject and keeps filling the frame while the world shrinks around them.
2. A live height counter (and a clock) on screen the whole time: the numbers are the hook.
3. Familiar landmarks as milestones: door, house, tower, skyscraper, mountain, clouds, space, Earth.
4. Escalation to an absurd final scale, then an open question.

## Our twist
Two counters (time, height) + a guess hook: "You grow 1 cm every second. When are you taller than Everest?" (answer: about 10 days). Payoff: in an 80-year life you'd end up almost twice as tall as Earth is wide.

## Numbers (start 1.70 m; 1 cm/s; 1 year = 365.25 days)
- 1 minute: 2.3 m (taller than a door)  · 1 hour: 37.7 m  · 1 day: 865.7 m (taller than Burj Khalifa, 828 m, after ~23 h)
- Everest 8,848.86 m: ~10.2 days  · 1 week: 6.05 km  · 1 year: ~316 km
- ISS (~400 km orbit): ~1.27 years  · Earth's equatorial diameter 12,756 km (NSSDC radius 6,378.137 km): ~40.4 years
- 80 years: ~25,246 km = 1.98x Earth's diameter ("almost twice as tall as Earth is wide")
- Moon (384,400 km): ~1,218 years (optional final shock)
## Sources to cite (verify Burj + Everest + ISS altitude in the build run)
- NASA NSSDC Earth Fact Sheet (equatorial radius 6378.137 km): https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html  (checked 15 Nov)
- Burj Khalifa 828 m: CTBUH Skyscraper Center https://www.skyscrapercenter.com/building/burj-khalifa/3
- Everest 8,848.86 m (2020 China-Nepal survey): e.g. National Geographic / Britannica
- ISS altitude ~400 km (about 250 miles): NASA ISS pages
## Build idea
three.js or canvas 2-D: silhouette human always ~60% of frame height, log-scale camera pull-out; landmark cut-outs (draw our own simple shapes; for Earth use NASA Blue Marble / Apollo 17 AS17-148-22727, public domain). Counters in Anton, one at a time per rule (time small top, height big). Kokoro narration (am_michael 1.08), bed like tools/black-hole-inside.sound.py. Text safe zone x 60..930, y 320..1440. Render: tools/footage-short2.py streams now (OOM fix) if footage is used.
