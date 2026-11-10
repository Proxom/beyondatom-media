# baumgartner-jump (11 Nov 17:00, 1M+ list #2, style B) — run yt-2007 (10 Nov 20:07)
- Scene: tools/p_baumgartner-jump.html + tools/baumgartner-jump.js (Blue Marble Earth shader with fisheye, procedural terrain/clouds; stylized pressure-suit figure). Sound: tools/baumgartner-jump.sound.py.
- Voice: Kokoro (am_michael, speed 1.08) via kokoro-onnx (python3.13) with model files from GitHub releases (thewh1teagle/kokoro-onnx model-files-v1.0) — HF still blocked, GitHub works.
- Render: NODE_PATH=$(npm root -g) node tools/render-range.js baumgartner-jump A B (3 chunks), then tools/encode.sh-style encode with /tmp/claude-0/aud/baumgartner-jump.wav.
- Outlier: "Felix Baumgartner's jump from the edge of space" (Astro Chronicles, ~10M).
- Reference gate points (what made the 10M original great): 1) real capsule camera: huge curved Earth, black sky, thin blue line = extreme height; 2) a human in a pressure suit at the open door, the step-off moment; 3) rising danger: speed of sound, the violent spin; 4) tight pacing with numbers on screen and tense, sparse sound; 5) relief payoff when the parachute opens.
- Footage check: no NASA/ESA public-domain footage of the jump exists (Red Bull owns the Stratos footage) -> own animation with NASA Blue Marble Earth.
