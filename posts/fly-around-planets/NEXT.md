# fly-around-planets (YouTube Short, sprint style A, target slot 12 Nov 2026 21:00 Europe/London)
Run: 12 Nov 04:07 queue-check run (yt-0407-rubin-51rnmg). QUEUE was 1 (12 Nov 17:00 planck-length) -> 2 Shorts this run; this one fills the next slot.
Style A (side-by-side race with live clocks), sequel family of planet-ball-drop / jump-five-worlds. Familiar object: a jet at a fixed 900 km/h (a premise, not a claim).
Real NASA images (public domain), cropped to disks: tools/pl -> /tmp (recreate with the crop script below; ids in caption.txt). Venus = right half of PIA23791 (x>=1175 px); Jupiter = PIA04866 padded square c(1056,960) r884; Saturn = PIA21046 c(1006,503) half 800; Sun = PIA26681 (SDO AIA 171).
Scene tools/p_fly-around-planets.html (serve tools/ over http: `python3 -m http.server 8765` then BASE=http://127.0.0.1:8765 node render-range.js ...; file:// taints the canvas).
Sound tools/fly-around-planets.sound.py, VO tools/fly-around-planets.vo.py (Kokoro am_michael 1.08; models from github.com/thewh1teagle/kokoro-onnx releases model-files-v1.0).
VO starts: l1 .15, l2 4.9, l3 8.4, l4 10.45, l5 13.9, l6 17.9, l7 21.5, l8 27.0, l9 31.0.
Mix: VO HP80, deesser, -8 dB shelf 3.5k, LP 7k; bed LP 7k, -4 dB shelf 5k, sidechain duck; loudnorm -15.5 -> -16.0 LUFS, -2.4 dBTP, HP4k 29 dB below the mix.
Final: 1080x1920 30 fps H.264 High CRF 18, AAC 48 kHz, 34.6 s, first/last YAVG 58.1/58.2.
Facts (NSSDC equatorial diameters; lap = pi*D/900): Me 17.0 h, Ma 23.7 h, Ve 42.3 h, Ea 44.5 h, Ne 7.2 d, Ur 7.4 d, Sa 17.5 d, Ju 20.8 d, Sun (r 695,700 km) 202.4 d.
