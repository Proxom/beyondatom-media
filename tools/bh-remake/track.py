# find the bright ring direction in the equirect plunge frames: python3 track.py rect.mp4 t0 t1 step
import sys, subprocess, numpy as np
src, t0, t1, st = sys.argv[1], *map(float, sys.argv[2:5])
W, H = 1080, 540
t = t0
while t <= t1 + 1e-6:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', src, '-frames:v', '1', '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(H, W).astype(float)
    ys, xs = np.nonzero(img > 70)
    if len(xs) == 0: print(t, 'none'); t += st; continue
    lon = (xs + .5) / W * 2 * np.pi - np.pi; lat = np.pi / 2 - (ys + .5) / H * np.pi
    v = np.stack([np.cos(lat) * np.sin(lon), np.sin(lat), np.cos(lat) * np.cos(lon)], 1)
    c = v.mean(0); c /= np.linalg.norm(c)
    ang = np.degrees(np.arccos(np.clip(v @ c, -1, 1)))
    print(f'{t:.2f} lon={np.degrees(np.arctan2(c[0], c[2])):7.1f} lat={np.degrees(np.arcsin(c[1])):6.1f} r90={np.percentile(ang, 90):5.1f} rmax={ang.max():5.1f} n={len(xs)}')
    t += st
