# planet-spin-race (YouTube Short, style A, target slot 14 Nov 2026 01:00 Europe/London)
Run: 13 Nov 20:07 (yt-2007-rubin-lk9k53). No runs between 12 Nov 04:58 and this one; the 13 Nov 17:00 slot was missed and QUEUE was 0, so this Short fills the next slot (14 Nov 01:00).
Style A (side-by-side race with a shared clock), same family as fly-around-planets / planet-ball-drop. outlier: none (own idea).
Real NASA images (public domain), cropped to 900 px disks into /tmp/claude-0/pl (tools/pl symlink) by /tmp crop script: auto-detected disk bbox, except Venus = right part of PIA23791 orig (x>=1175), Saturn = PIA21046 orig c(1006,503) half 800, Jupiter = PIA04866 orig (1920x2400) c(1295,1200) r1100.
Scene tools/p_planet-spin-race.html (serve tools/ over http: `python3 -m http.server 8765`, BASE=http://127.0.0.1:8765 node render-range.js planet-spin-race 0 972).
Sound tools/planet-spin-race.sound.py (derived from fly-around-planets), VO tools/planet-spin-race.vo.py (Kokoro am_michael 1.08).
VO starts: l1 .15, l2 4.05, l3 6.85, l4 9.8, l5 12.4, l6 16.8, l7 18.7, l8 20.3, l9 23.35, l10 25.4, l11 28.4.
Mix: tools/mix-vo.py, then highshelf 4.5 kHz -2.5 dB + loudnorm -15.5 -> -15.8 LUFS, -2.5 dBTP, HP4k 18.9 dB below the mix.
Clocks: round 1 linear (0.35-8.0 s to 17.2 h); round 2 exponential (k=8, 10.0-19.5 s to 5832.5 h): stamps Ju 4.75, Sa 5.11, Ne 7.51, Ur 8.0, Ea 13.06, Ma 13.10, Me 17.81, Ve 19.5; Venus finale count 20.2-22.4.
Facts (NSSDC rotation periods, h): Me 1407.6 (58.6 d), Ve -5832.5 (243 d, retrograde), Ea 23.9, Ma 24.6, Ju 9.9, Sa 10.7, Ur -17.2, Ne 16.1. Venus year 224.7 d. NASA Venus Facts: day longer than year; spins backward.
