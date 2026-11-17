# starship-launches — 1M+ list #8 for 18 Nov 2026 17:00 Europe/London (style A). DONE v2 by yt-0407-dirac-akhm3l (17 Nov); review r1 avg 6.75 / ref 6 -> top fixes applied once (§6), scheduled
outlier: "Why does Starship need 12+ launches to reach the Moon?" (Everyday Astronaut, ~2.6M) — topic only, nothing copied.
## Reference gate: what made the original work
1. Instant familiar comparison (Saturn V / Apollo = 1 launch) in the first second.
2. A visibly climbing launch count as the hook engine.
3. A simple "why": the lander is a full-size ship that must be refilled in orbit.
4. Big rocket visuals in constant motion. 5. Fast pacing, one clear final number.
## Build
Scene tools/p_starship-launches.html (canvas 2-D; needs sl-earth.jpg = NASA AS17-148-22727 ~large and sl-moon.jpg = GSFC_20171208_Archive_e000868 ~large next to it, fonts/ symlink; chromium --allow-file-access-from-files).
VO tools/starship-launches.vo.py; bed tools/starship-launches.sound.py; mix: tools/mix-vo.py vo bed.wav mix0.wav 36.5 l1=0.15 l2=2.75 l3=6.25 l4=10.15 l5=12.85 l6=21.3 l7=28.5 l8=32.3, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5.
## Review
r1 (v1): avg 6.75 (hook 7, visual 6, clarity 7, payoff 7), reference 6. Fact check OK; flagged: "why" line implied height alone forces refuelling; crew launches separately on SLS; "APOLLO 1" reads like the 1967 mission.
Fixes (v2): VO "It has to refill its tanks in orbit before it can land and climb back up" (OIG-backed); payoff "13+ STARSHIP LAUNCHES" + VO "Thirteen Starship launches"; label SATURN V; fuel bar moved under the counter; counter sub "TANKER n" + pulse on each docking; lunar close-up no longer overlaps; frame 0 rockets already off the pad. SLS crew launch + 22 vs 6-8 estimates in the description.
Gate: 1080x1920, 30 fps, CRF 18, AAC, 36.5 s; -15.7 LUFS, -2.2 dBTP, HF(>4 kHz) 21.8 dB below; first/last frame YAVG 64/65; text zones {}; spelling clean (VO + description; only proper nouns flagged).
