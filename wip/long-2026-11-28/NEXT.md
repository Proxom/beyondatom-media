# NEXT (long-2026-11-28)
16 Nov 12:07: plan written.
17 Nov 12:07 (yt-1207-dirac-dz080t): step 1 started. tools/jump-four-moons.js + tools/jump-five-worlds.js (and their p_*.html) now take a landscape flag: open `p_jump-four-moons.html?ls=1` (or set window.LS=true) -> 1920x1080 canvas, 5 lanes of 384 px, GY 960, text rows from the LY object in the .js. Portrait (no flag) renders exactly as before (checked frame by frame).
Previews: previews/ch0-four-moons-16x9.jpg, previews/ch1-five-worlds-16x9.jpg (t = 1/6/12/19.5 s and 1/8/18/26 s).
Stills tool: `node tools/snap-ls.js "<abs path>/tools/p_X.html?ls=1" 1920 1080 <outprefix> t1 t2 ...`
Open points for the long cut (not blocking step 1): figures get small at the zoomed-out recap (16:9 has 460 px of jump height vs 655 in portrait) -> in the long cut, hold the recap longer and add a close-up insert if it reads too small; the Shorts-only follow pill and loop cards stay in the scene but the long cut will cut before them.
18 Nov 04:07 (yt-0407-dirac-8gbprl): chapter 2 DONE. p_planet-ball-drop.html takes ?ls=1 (LY object; 4 columns of 440/520 px, GY 880, drop line 352); portrait output pixel-identical to before (checked t=2/18.5/24, 0 px differ). Preview previews/ch2-ball-drop-16x9.jpg (t=1/6/13/18.5).
NASA planet crops: `bash tools/fetch-pl.sh` rebuilds tools/pl/ (8 disks, git-ignored) for ball-drop, spin-race and fly-around. These scenes load images, so serve over http for canvas export: e.g. a temp dir with symlinks (p_*.html, pl, fonts *.ttf) + `python3 -m http.server`, then `node tools/snap-url.js "http://127.0.0.1:PORT/p_X.html?ls=1" 1920 1080 <outprefix> t...`.
Optional extra chapter: tools/p_throw-four-worlds.html (19 Nov Short, own simulation, no images) if the cut runs short.
Next step: same LY treatment for p_gravity-limit.html (chapter 3), then the rest; then step 2 (960x540 chapter previews). Only in runs with QUEUE >= 2 after Short work. Deadline: schedule by Fri 27 Nov.
