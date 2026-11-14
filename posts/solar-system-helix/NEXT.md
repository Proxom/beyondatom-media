# solar-system-helix (YouTube Short, 1M+ list #4, style C, target slot 14 Nov 2026 17:00 Europe/London)
Run: 14 Nov 04:07 (yt-0407-rubin-gvo58k). QUEUE was 0 and the next slot (14 Nov 17:00) was empty.
outlier: One Speck "Our ENTIRE Solar System Is Racing Through the Galaxy" (KLqKzPDvbIA, 5.3M on 9 Nov). Topic only; visuals, script, title and sound are ours.
Length: 32 s narrated version (cinematic standard: every 1M+ Short gets narration). The approved a-001 7-10 s loop test was NOT used here (one Short per run); it can be a later variant of this scene.

## Reference gate: what made the original work (from the 9 Nov market scan; nothing copied)
1. One mesmerizing image: the planets' glowing paths twisting behind the moving Sun, filling the frame.
2. Continuous motion, no cuts, loops cleanly.
3. One mind-blowing idea in one sentence (you are racing through the galaxy right now).
4. Dark space with colourful light trails (high contrast, readable at phone size).
5. Very short and rewatchable.

## Our twist
- A live "since you started watching" counter (200 km per second of video, NASA 720,000 km/h) on screen from frame 1.
- Circles -> spirals: the camera turns to the Sun's frame (circles, Earth 107,000 km/h), then the paths unroll into spirals.
- Correct geometry: the planets circle the Sun in a plane tilted to its path (they do not trail behind it, the common mistake of the viral "vortex" animations).
- Pull-out to the Milky Way (NASA/JPL-Caltech artist's concept PIA10748) with YOU ARE HERE and clockwise motion (trailing arms; seen from the north).

## Build
Scene tools/p_solar-system-helix.html (canvas 2D with own 3D projection). Images in tools/hx -> /tmp/claude-0/hx: hx/sun.jpg = SDO GSFC_20171208_Archive_e000790 ~large, disk auto-cropped (threshold 45) to 900 px; hx/galaxy.jpg = PIA10748 ~large (1920x1920).
Render: serve tools/ (`python3 -m http.server 8765`), BASE=http://127.0.0.1:8765 node render-range.js solar-system-helix 0 960 (3 parallel ranges ~10 min).
Sound tools/solar-system-helix.sound.py; VO tools/solar-system-helix.vo.py (Kokoro am_michael 1.08).
VO starts: l1 .15, l2 3.9, l3 9.0, l4 10.9, l5 17.1, l6 20.6, l7 25.3, l8 29.5. Mix: tools/mix-vo.py, then highshelf 4.5 kHz -2.5 dB + loudnorm -15.5 -> -15.5 LUFS, -2.5 dBTP, HP4k 19.1 dB below the mix.
Facts: NASA Science Sun facts (450,000 mph / 720,000 km/h; ~230 million years per lap); NSSDC Earth fact sheet (29.78 km/s = 107,208 km/h).
