# europa-water (NOT published; reviewer FAIL v1 6/10, 4 Nov 21:45)
Generator: tools/p_europa-water.html + tools/europa-water.js + tools/europa-water.sound.py (38 s, 1140 frames).
Facts verified 4 Nov (NASA Europa facts, Europa Clipper FAQ, JPL quick facts, USGS): ice 15-25 km, ocean 60-150 km,
about twice Earth's ocean water (NASA: "may"), Europa 3,122 km = 1/4 Earth's width, oceans 1,338e6 km3 -> 1,367 km ball,
2x -> 1,722 km ball, Clipper arrives April 2030.
Fixes needed before v2:
1. 10.0-11.5 s: Europa zooms ~4x while Earth and the 1,370 km ball keep their size -> scale break. Zoom all bodies with one camera scale about Europa (Earth then leaves the frame), or cut/cross-fade to the close-up.
2. 14-22 s: 6-8 stacked copies of the cutaway rim during the push-in/pull-back (blur capped at 8 samples). Use no motion blur on the cut body, or slow the push so <= 2.5 px/frame.
3. 31.5-32.0 s: water balls shrink to dots next to a full-size Europa -> fade them out at constant size instead.
4. Title must hedge: "Europa May Hold More Water Than Earth (To Scale)".
Minor: drained Earth's Africa is a blurry smear at 10-11 s (motion blur); payoff card has no spacecraft visual.
Render cost: frames 369-810 (cutaway) are slow in SwiftShader; no supersampling; render as 4 ranges, resumable.
