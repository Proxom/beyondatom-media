# Saturday long video #1 — Sat 28 Nov 2026 17:00 Europe/London (Metricool brand 7675089, YouTube normal video)
Started by yt-1207-dirac-vd9u11, 16 Nov 2026 (QUEUE 2 = full, so long-video work is allowed per the 15 Nov 14:59 override).

## Concept (AGENT.md 15 Nov 14:55 rule 4)
Working title: "Every Planet Compared: 10 Experiments" (alt: "I Tested Gravity on Every World", "Same Experiment, Every Planet").
Thumbnail: one object (an astronaut mid-jump over a row of planets), 3-4 words max ("WHO LANDS LAST?"), big contrast.
First 30 s: the 4-moons jump already moving + promise: "10 experiments, every world. The last one breaks everything." (payoff = black hole replaces the Sun).
Length target 8.5-9.5 min. 16:9 1920x1080, 30 fps. Chapters in the description.
Compilation of OUR OWN simulations only (re-rendered horizontally from tools/ scene code, not the vertical mp4s in a box). New narration links (Kokoro) between chapters; NASA footage max ~20 %.
Topic registry: every chapter re-uses a topic we already made; this is allowed because Erkan asked for exactly this compilation (15 Nov 14:55). No new topic is spent.

## Chapter list (own-simulation Shorts, in order; source scene / Short length)
| # | Chapter | Source scene | Short |
|---|---|---|---|
| 0 | Cold open: same jump, 4 moons (no title card) | tools/jump-four-moons.js | 22.9 s, best Short 5.9K |
| 1 | The same jump on 5 worlds | tools/jump-five-worlds.js | 30.5 s |
| 2 | Drop a ball on every planet | tools/p_planet-ball-drop.html | 27.8 s |
| 3 | How much gravity can a human survive? | tools/p_gravity-limit.html | 30.0 s |
| 4 | How old would you be on every planet? | tools/p_planet-age.html | 34.8 s |
| 5 | Which planet spins the slowest? | tools/p_planet-spin-race.html | 32.4 s |
| 6 | How fast is each planet moving? | tools/planet-speed-race.js (v2) | 36 s |
| 7 | How long to fly around every planet? | tools/p_fly-around-planets.html | 34.6 s |
| 8 | If Saturn were as close as the Moon | tools/planet-at-moon.js | 30.5 s |
| 9 | What if you fell into Jupiter? | tools/p_jupiter-fall.html | 35.6 s |
| 10 | Finale: what if a black hole replaced the Sun? | tools/p_black-hole-replaces-sun.html | 22.0 s |
Each chapter ~45-50 s in the long cut: guess question → the race at a calmer pace with more labels → answer → one-line "why" → link to the next chapter. 11 x ~47 s + intro/outro ≈ 9 min.

## Build steps (one or two per run, only when QUEUE >= 2)
1. [~] (17 Nov: jump-four-moons + jump-five-worlds DONE via ?ls=1 / window.LS; 18 Nov: planet-ball-drop DONE; 18 Nov pm: gravity-limit DONE; 7 scenes left) Make each scene resolution-agnostic: W,H from URL params (default 1080x1920), layouts for 1920x1080 (side-by-side lanes become wider, text left/right). Start with jump-four-moons + jump-five-worlds (same family).
2. [ ] Render chapter previews at 960x540; check layouts.
3. [ ] Narration script (US English, chapter links) → tools/long-01.vo.py with Kokoro; facts = sources already in each Short's description (reuse, re-check).
4. [ ] Music bed + SFX (long version of the existing beds; same audio gate: LPF 7-8 kHz, -4 dB shelf at 5 kHz, de-esser, -14 to -16 LUFS, TP <= -2 dBTP).
5. [ ] Assemble, chapters, final render 1920x1080 CRF 18, HARD GATE (sources, sound, captions/SRT, no reused-content look), one reviewer round.
6. [ ] Thumbnail 1280x720, title, description with chapters + sources; media/long-2026-11-28/; schedule Sat 28 Nov 17:00 as type "video" (not short).
7. [ ] The 28 Nov 17:00 Short points to it (related video link).
