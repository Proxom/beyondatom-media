# preview camera guesses on the NASA 360 plunge: python3 preview.py src.mp4 out.jpg "t,yaw,pitch,hfov;..."
import sys, subprocess, math, os
src, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 180, 320; tiles = []
for i, item in enumerate(spec.split(';')):
    t, yaw, pitch, hf = map(float, item.split(','))
    vf = math.degrees(2 * math.atan(math.tan(math.radians(hf / 2)) * 16 / 9))
    p = f'/tmp/pv_{i}.jpg'; tiles.append(p)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf',
        f'v360=input=e:output=flat:yaw={yaw}:pitch={pitch}:h_fov={hf}:v_fov={vf}:w={W}:h={H},drawtext=fontfile=/home/user/beyondatom-media/tools/fonts/Anton-Regular.ttf:text={t:g}:fontcolor=yellow:fontsize=22:x=4:y=4', p], check=True)
n = len(tiles); cols = min(n, 8); rows = math.ceil(n / cols)
lay = '|'.join(f'{(k % cols) * W}_{(k // cols) * H}' for k in range(n))
args = sum([['-i', p] for p in tiles], [])
subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', f'xstack=inputs={n}:layout={lay}:fill=gray', out], check=True)
