# astronaut-taller (YouTube Short, target slot 8 Nov 2026 01:00 Europe/London)
Run: 7 Nov 12:10 UTC (yt-1207, session trusting-davinci-da966s).
Done:
- Scene: tools/p_astronaut-taller.html (18 s, 2D canvas, hologram figure to scale 171 cm = 1100 px, zoomed ruler, disc magnifier, space -> Earth -> space loop).
- Sound: tools/astronaut-taller.sound.py -> tools/sound-v2.py; master chain highpass 38, lowpass 7500 p=2, acompressor 2.5:1, highshelf 5k -4 dB, alimiter, 2-pass loudnorm -20 LUFS / TP -3.
  Measured: -20.0 LUFS, peak -5.6 dBFS, highpass-4k version -46.0 LUFS (26 dB below).
- Facts verified this run: NASA NTRS 20110023150, NTRS 20090007782, NASA Mission X "What's Your Space Height?" (171 -> 174.4 cm).
Left:
- Render frames: cd tools && node render-range.js astronaut-taller 0 540 (skips existing frames), encode (tools/encode.sh pattern), QC (frames 2 fps, safe zones, spell check), reviewer pass, host in media/astronaut-taller/, schedule in Metricool.
