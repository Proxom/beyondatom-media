# planet-age (YouTube Short, style A, target slot 15 Nov 2026 01:00 Europe/London)
Run: 14 Nov 12:07 (yt-1207-rubin-6ljgnp). QUEUE was 1 (only 14 Nov 17:00 solar-system-helix), next slot 15 Nov 01:00 empty -> this Short.
Style A (same action on several worlds, live counters, guess), family of planet-spin-race / fly-around-planets. outlier: none (own idea; "age on other planets" is a classic calculator topic).
Images: same 8 NASA public-domain planet images as planet-spin-race, cropped with tools/planet-spin-race.crop.py into /tmp/claude-0/pl (tools/pl symlink); Neptune finale uses PIA01492 orig crop 1868 px at (116,172) scaled to 1400 (pl/PIA01492_big.jpg).
Scene tools/p_planet-age.html (serve tools/ over http on 8765; BASE=http://127.0.0.1:8765 node render-range.js planet-age 0 1044).
Sound tools/planet-age.sound.py (derived from planet-spin-race), VO tools/planet-age.vo.py (Kokoro am_michael 1.08, python3.13).
VO starts: l1 .15, l2 4.25, l3 6.25, l4 9.6, l5 15.2, l6 17.1, l7 21.0, l8 23.8, l9 27.6, l10 31.6 (tools/mix-vo.py, D 34.8).
Clocks: round 1 (rocky) Earth clock 0-20 yr over 0.0-5.0 s; round 2 (giants) 9.6-15.0 s; Jupiter's ring completes at 12.8 s. Neptune ring 1846->2011 over 23.9-26.9 s; "AGE 165" from 27.5 s. Whips 8.9, 20.3, 31.1 (back to round-1 start frame for the loop).
Facts: NSSDC sidereal orbit periods (d): Me 87.969, Ve 224.701, Ea 365.256, Ma 686.980, Ju 4332.589, Sa 10755.699, Ur 30685.4, Ne 60189.018. Ages at 20: 83.0, 32.5, 20, 10.6, 1.69, 0.68, 0.24, 0.12. NASA Neptune Facts: discovered 1846; first 165-year orbit since discovery completed 2011.
