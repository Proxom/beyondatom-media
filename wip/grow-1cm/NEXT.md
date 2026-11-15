# grow-1cm — 1M+ list #7 for 17 Nov 2026 17:00 Europe/London (style C). BUILT by yt-1207-dirac-xu8331 (15 Nov), in review
outlier: "What if you grew 1 cm every second?" (What If channel, ~3.3M) — topic only, nothing copied.
## Reference gate: what made the original work
1. One continuous zoom-out from a human: the person stays the subject and keeps filling the frame while the world shrinks around them.
2. A live height counter (and a clock) on screen the whole time: the numbers are the hook.
3. Familiar landmarks as milestones: door, house, tower, skyscraper, mountain, clouds, space, Earth.
4. Escalation to an absurd final scale, then an open question.
## Build
Scene tools/p_grow-1cm.html (canvas 2-D; needs g1-earth.jpg = NASA AS17-148-22727 ~large next to it; launch chromium with --allow-file-access-from-files).
VO tools/grow-1cm.vo.py; bed tools/grow-1cm.sound.py; mix: tools/mix-vo.py vo bed.wav mix.wav 32.5 l1=0.15 l2=3.0 l3=6.5 l4=9.1 l5=13.1 l6=17.2 l7=19.4 l8=24.2 l9=29.9, then highshelf f=3800 g=-4 + loudnorm I=-15.3 TP=-2.5 (HF margin 19.5 dB).
Encode: x264 CRF 18, 30 fps, 32.5 s. -15.6 LUFS, -2.3 dBTP. Text zones clean (check-text-zones.js {}).
