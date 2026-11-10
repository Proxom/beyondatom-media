# BeyondAtom: "What If You Fell Into a Black Hole?" remake (10 Nov 2026).
# Main picture: NASA Goddard SVS 14576 (J. Schnittman, B. Powell), the all-sky (equirectangular) plunge movie.
# A virtual vertical camera (ffmpeg v360, animated yaw/pitch/fov via sendcmd) flies through it, then text, counter,
# stretch effect and the original sound bed are added.
# usage: python3 build.py SRC_EQUIRECT.mp4 OUTDIR W H     (preview 540 960, final 1080 1920)
import sys, os, math, subprocess, json
SRC, OUT, W, H = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
os.makedirs(OUT, exist_ok=True)
FPS = 30
# camera keyframes in SOURCE time: (src_t, yaw, pitch, h_fov)
CAM = [(8.0, 0, -10, 24), (10.0, 0, -13, 28), (12.0, 0, -18, 36), (13.0, 0, -20, 40), (15.0, 0, -17, 55),
       (17.0, 0, -12, 85), (20.0, 0, -18, 95), (22.0, 0, 10, 92), (24.0, 0, 28, 85), (27.0, 0, 34, 80),
       (30.0, 0, 36, 80), (34.0, 0, 36, 80), (38.0, 0, 34, 80), (41.0, 0, 34, 75), (42.0, 0, 40, 62),
       (43.0, 0, 42, 52), (44.0, 0, 42, 44), (45.0, 0, 50, 38), (46.0, 0, 56, 36), (47.0, 0, 66, 37),
       (48.0, 0, 76, 39), (49.0, 0, 86, 42), (50.0, 0, 94, 47), (51.0, 0, 99, 52), (52.0, 0, 105, 58),
       (53.0, 0, 111, 64), (54.0, 0, 119, 78), (55.0, 0, 122, 95)]
def cam(ts):
    k = CAM
    if ts <= k[0][0]: return k[0][1:]
    if ts >= k[-1][0]: return k[-1][1:]
    for i in range(len(k) - 1):
        if k[i][0] <= ts <= k[i + 1][0]: break
    p0 = k[max(i - 1, 0)]; p1 = k[i]; p2 = k[i + 1]; p3 = k[min(i + 2, len(k) - 1)]
    u = (ts - p1[0]) / (p2[0] - p1[0]); out = []
    for j in (1, 2, 3):  # Catmull-Rom on non-uniform keys (tangents scaled by segment length)
        m1 = (p2[j] - p0[j]) / max(p2[0] - p0[0], 1e-6) * (p2[0] - p1[0])
        m2 = (p3[j] - p1[j]) / max(p3[0] - p1[0], 1e-6) * (p2[0] - p1[0])
        u2, u3 = u * u, u * u * u
        out.append((2 * u3 - 3 * u2 + 1) * p1[j] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[j] + (u3 - u2) * m2)
    return out
def dfov(hf): return math.degrees(2 * math.atan(math.tan(math.radians(hf / 2)) * math.hypot(W, H) / W))
def vfov(hf): return math.degrees(2 * math.atan(math.tan(math.radians(hf / 2)) * H / W))
# output segments: (name, out_dur, src_t0, src_t1, extra)   src_t1 == src_t0 -> freeze frame with slow push
SEG = [('hook', 3.0, 13.0, 17.0, {}),
       ('mass', 4.0, 17.0, 21.5, {}),
       ('edge', 3.5, 21.5, 28.0, {}),
       ('friend', 1.5, 28.0, 30.0, {}),
       ('freeze', 2.5, 30.0, 30.0, {'push': (80, 70)}),
       ('plunge', 3.5, 30.0, 42.0, {}),
       ('inside', 12.8, 42.0, 54.0, {'stretch': (11.3, 13.8)}),
       ('noodle', 1.1, 54.0, 55.0, {'stretch': (-1.5, 1.0), 'hold': 1}),
       ('payoff', 3.1, 9.2, 13.0, {})]
json.dump([s[:4] for s in SEG], open(os.path.join(OUT, 'segments.json'), 'w'))
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); sys.exit(1)
files = []
for name, od, s0, s1, ex in SEG:
    n = round(od * FPS); cmds = []
    for f in range(n):
        u = f / max(n - 1, 1)
        if s1 == s0:
            y, p, hf = cam(s0); a, b = ex['push']; hf = a + (b - a) * (u * u * (3 - 2 * u))
        else:
            y, p, hf = cam(s0 + (s1 - s0) * f / n)
        cmds.append(f'{f / FPS:.4f} v360@c pitch {p:.3f}, v360@c d_fov {dfov(hf):.3f};')  # 2 commands: each one rebuilds the v360 map
    cf = os.path.join(OUT, f'{name}.cmd'); open(cf, 'w').write('\n'.join(cmds) + '\n')
    y, p, hf = cam(s0)
    v = f"v360@c=input=e:output=flat:yaw={y}:pitch={p}:d_fov={dfov(hf)}:w={W}:h={H}:interp=lanczos:reset_rot=1"
    if s1 == s0:
        inp = ['-ss', f'{s0}', '-i', SRC]; pre = f'trim=end_frame=1,loop=loop={n - 1}:size=1,setpts=N/{FPS}/TB'
    else:
        k = od / (s1 - s0); inp = ['-ss', f'{s0}', '-t', f'{s1 - s0 + 0.1}', '-i', SRC]
        pre = f'setpts=(PTS-STARTPTS)*{k:.6f},fps={FPS}'
    vf = f"{pre},sendcmd=f='{cf}',{v}"
    if 'stretch' in ex:
        a, b = ex['stretch']  # stretch ramps in over segment-local time a..b (seconds), up to 2.6x vertically
        sexp = f"(1+1.6*pow(min(max((t-{a})/({b}-{a}),0),1),2))"
        vf += f",scale=w={W}:h='2*trunc({H}*{sexp}/2)':eval=frame:flags=bicubic,crop={W}:{H}:0:'(ih-{H})/2'"
    vf += ',format=yuv420p'
    o = os.path.join(OUT, f'{name}.mp4'); files.append(o)
    run(['ffmpeg', '-v', 'error', '-y', *inp, '-vf', vf, '-frames:v', str(n), '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '12', o])
    print('seg', name, n, 'frames', flush=True)
lst = os.path.join(OUT, 'list.txt'); open(lst, 'w').write(''.join(f"file '{f}'\n" for f in files))
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', os.path.join(OUT, 'picture.mp4')])
print('picture done')
