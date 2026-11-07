# Footage Short compositor (real NASA/ESA footage + text cards + counter + optional particles).
# usage: python3 footage-short.py <edit.json> <out.mp4> [--preview] [--stills dir]
# edit.json: {"src": "path.mp4", "fps": 30, "audio": "music.wav",
#   "shots": [{"in": 7.40, "out": 8.85, "dur": 2.0, "cx": 0.36, "z": 1.2}],   # cx = crop centre (0..1 of source width), dur = output length (slow-mo if > out-in)
#   "cards": [{"t0": 0, "t1": 2, "text": "...", "y": 360, "size": 84, "anchor": "top|bottom", "color": "#fff"}],
#   "counter": {"t0": 17.6, "t1": 19.6, "to": 3100, "suffix": "+", "y": 820, "size": 190, "label": "...", "hold": 21.0},
#   "grains": {"t0": 0, "t1": 4.5, "n": 140, "seed": 7}}
# Safe zones (HARD GATE): text stays inside x 60..930, y 320..1440.
import json, sys, subprocess, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

E = json.load(open(sys.argv[1])); OUT = sys.argv[2]
PREVIEW = '--preview' in sys.argv
STILLS = sys.argv[sys.argv.index('--stills') + 1] if '--stills' in sys.argv else None
W, H = 1080, 1920; FPS = E.get('fps', 30)
FONT = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
SAFE_L, SAFE_R, SAFE_T, SAFE_B = 60, W - 150, 320, H - 480

def shot_frames(s):
    """Decode one shot, crop 9:16 around cx, scale to 1080x1920, retime to s['dur']."""
    sw, sh = E.get('srcw', 1920), E.get('srch', 1080)
    cw = int(round(sh * 9 / 16)) // 2 * 2
    z = s.get('z', 1.0)  # static zoom anchored at the bottom (moves faces up, out from under top text)
    ch = int(round(sh / z)) // 2 * 2; cw = int(round(ch * 9 / 16)) // 2 * 2
    x = int(min(max(s['cx'] * sw - cw / 2, 0), sw - cw)); y = int(round(sh * s.get('cy_anchor', 1.0) - ch)) if z > 1 else 0
    n = int(round(s['dur'] * FPS)); speed = (s['out'] - s['in']) / s['dur']
    vf = f"crop={cw}:{ch}:{x}:{max(0, y)},scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6,setpts=PTS/{speed:.5f},fps={FPS}"
    if s.get('zoom'):  # slow push-in: zoom from 1 to s['zoom'] over the shot
        z = s['zoom']; vf += f",zoompan=z='1+({z}-1)*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS}"
    cmd = ['ffmpeg', '-loglevel', 'error', '-ss', str(s['in']), '-t', str(s['out'] - s['in'] + 0.2), '-i', E['src'],
           '-vf', vf, '-frames:v', str(n), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
    if len(fr) < n: fr = np.concatenate([fr, np.repeat(fr[-1:], n - len(fr), 0)])
    return fr[:n]

_fc = {}
def font(sz):
    if sz not in _fc: _fc[sz] = ImageFont.truetype(FONT, sz)
    return _fc[sz]

def wrap(d, text, f, maxw):
    lines = []
    for para in text.split('\n'):
        cur = ''
        for w in para.split(' '):
            t = (cur + ' ' + w).strip()
            if d.textlength(t, font=f) <= maxw or not cur: cur = t
            else: lines.append(cur); cur = w
        lines.append(cur)
    return lines

def ease(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)

def draw_text_block(img, text, y, size, color, alpha, anchor='top', pop=1.0):
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    f = font(int(size * pop)); cx = (SAFE_L + SAFE_R) / 2; maxw = SAFE_R - SAFE_L - 20
    lines = wrap(d, text, f, maxw); lh = int(f.size * 1.12); hgt = lh * len(lines)
    y0 = y if anchor == 'top' else y - hgt
    sw = max(6, f.size // 11)
    # soft dark plate behind the text for legibility on busy footage
    pl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pl)
    wmax = max(d.textlength(l, font=f) for l in lines)
    pd.rounded_rectangle([cx - wmax / 2 - 34, y0 - 22, cx + wmax / 2 + 34, y0 + hgt + 18], 34, fill=(5, 8, 20, int(120 * alpha)))
    pl = pl.filter(ImageFilter.GaussianBlur(14))
    for i, l in enumerate(lines):
        d.text((cx, y0 + i * lh), l, font=f, fill=color + (int(255 * alpha),), anchor='ma',
               stroke_width=sw, stroke_fill=(0, 0, 0, int(230 * alpha)))
    img.alpha_composite(pl); img.alpha_composite(ov)
    return y0, y0 + hgt

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def grains_layer(t, g):
    if not (g['t0'] <= t < g['t1']): return None
    rnd = random.Random(g.get('seed', 7)); ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    fade = min(1, (t - g['t0']) / 0.25, (g['t1'] - t) / 0.3)
    for i in range(g.get('n', 140)):
        # grains start in a loose cloud mid-frame and drift outward slowly, tumbling (no gravity)
        ang = rnd.uniform(0, 2 * math.pi); sp = rnd.uniform(25, 120); r0 = rnd.uniform(0, 160)
        x0 = 520 + math.cos(ang) * r0 + rnd.uniform(-60, 60); y0 = 980 + math.sin(ang) * r0 * 1.2 + rnd.uniform(-80, 80)
        tt = t - g['t0'] + rnd.uniform(0, 1.5)
        x = x0 + math.cos(ang) * sp * tt + 8 * math.sin(tt * rnd.uniform(1, 3)); y = y0 + math.sin(ang) * sp * tt
        s = rnd.uniform(3.0, 7.5); rot = tt * rnd.uniform(-3, 3) + rnd.uniform(0, 6)
        pts = [(x + s * math.cos(rot + k * math.pi / 2), y + s * math.sin(rot + k * math.pi / 2)) for k in range(4)]  # tiny cubes
        c = rnd.randint(225, 255); d.polygon(pts, fill=(c, c, c, int(235 * fade)))
    sh = ov.filter(ImageFilter.GaussianBlur(2.2)); return Image.alpha_composite(sh, ov)

def fmt(n): return f"{int(n):,}"

def main():
    frames = np.concatenate([shot_frames(s) for s in E['shots']])
    N = len(frames); print('frames', N, 'dur', N / FPS)
    ow, oh = (540, 960) if PREVIEW else (W, H)
    enc = ['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{ow}x{oh}', '-r', str(FPS), '-i', '-']
    if E.get('audio'): enc += ['-i', E['audio'], '-c:a', 'aac', '-b:a', '192k', '-shortest']
    enc += ['-c:v', 'libx264', '-preset', 'medium' if PREVIEW else 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT]
    p = subprocess.Popen(enc, stdin=subprocess.PIPE)
    want = set()
    if STILLS:
        os.makedirs(STILLS, exist_ok=True)
        want = {min(N - 1, int(N * q)) for q in (0, .2, .4, .6, .8, 1.0)} | {int(0.5 * FPS)}
    C = E.get('counter'); G = E.get('grains')
    for i in range(N):
        t = i / FPS; img = Image.fromarray(frames[i]).convert('RGBA')
        # gentle vignette top/bottom so text plates read well
        if G:
            gl = grains_layer(t, G)
            if gl: img.alpha_composite(gl)
        for c in E['cards']:
            if c['t0'] <= t < c['t1']:
                a = min(1, (t - c['t0']) / 0.12 if c['t0'] > 0 else 1, (c['t1'] - t) / 0.12 if c.get('fadeout', True) else 1)
                pop = 1 + 0.06 * (1 - ease((t - c['t0']) / 0.18)) if c['t0'] > 0 else 1
                draw_text_block(img, c['text'], c['y'], c['size'], hexrgb(c.get('color', '#ffffff')), a, c.get('anchor', 'top'), pop)
        if C and C['t0'] - 0.3 <= t < C.get('hold', 1e9):
            k = ease((t - C['t0']) / (C['t1'] - C['t0'])); val = C['to'] * k
            done = t >= C['t1']; txt = fmt(round(val / 10) * 10 if not done else C['to']) + (C.get('suffix', '') if done else '')
            pop = 1 + 0.12 * max(0, 1 - (t - C['t1']) / 0.25) if done else 1
            a = min(1, (t - C['t0'] + 0.3) / 0.2)
            draw_text_block(img, txt, C['y'], C['size'], hexrgb(C.get('color', '#ffd54a')), a, 'top', pop)
            if C.get('label'): draw_text_block(img, C['label'], C['y'] + int(C['size'] * 1.25), C.get('label_size', 60), (255, 255, 255), a, 'top')
        out = img.convert('RGB')
        if i in want:
            dbg = out.copy(); dd = ImageDraw.Draw(dbg, 'RGBA')
            if i == int(0.5 * FPS):
                for r in [(0, 0, W, SAFE_T), (0, SAFE_B, W, H), (SAFE_R, 0, W, H), (0, 0, SAFE_L, H)]: dd.rectangle(r, fill=(255, 0, 0, 70))
            dbg.save(f'{STILLS}/f{i:04d}.jpg', quality=88)
        if PREVIEW: out = out.resize((ow, oh), Image.BILINEAR)
        p.stdin.write(out.tobytes())
    p.stdin.close(); p.wait(); print('ok', OUT)

main()
