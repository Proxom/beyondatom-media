# Place Kokoro VO lines on a timeline, then mix with a bed (standard BeyondAtom chain).
# usage: python3 mix-vo.py <vo_dir> <bed.wav> <out.wav> <duration> l1=0.15 l2=4.9 ...
import sys, subprocess, numpy as np, soundfile as sf
vd, bed, out, D = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
pos = dict((a.split('=')[0], float(a.split('=')[1])) for a in sys.argv[5:])
SR = 24000; N = int(D * SR); v = np.zeros(N)
for k, t in pos.items():
    a, sr = sf.read(f'{vd}/{k}.wav'); assert sr == SR
    i = int(t * SR); n = min(len(a), N - i); v[i:i + n] += a[:n]
    print(k, t, round(t + len(a) / SR, 2))
sf.write(f'{vd}/_vo.wav', v, SR)
fc = ("[0:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=80,deesser=i=0.6,highshelf=f=3500:g=-8,lowpass=f=7000,asplit=2[v][sc];"
      "[1:a]lowpass=f=7000,highshelf=f=5000:g=-4,volume=0.55[b];[b][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[bd];"
      "[v][bd]amix=inputs=2:normalize=0,loudnorm=I=-15.5:TP=-2.5:LRA=9[m]")
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{vd}/_vo.wav', '-i', bed, '-filter_complex', fc, '-map', '[m]', '-ar', '48000', '-t', str(D), out], check=True)
