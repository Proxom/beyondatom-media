# Text track for the black-hole remake: one clean line at a time, Anton, white with a soft shadow.
# Writes unique RGBA PNGs + an ffmpeg concat list (with durations) to OUTDIR.
# usage: python3 overlay.py OUTDIR
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1920; CX = 495; MAXW = 800      # safe zones: top 320, bottom 480, left 60, right 150
FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts', 'Anton-Regular.ttf')
def card(lines, size, y0, name, color=(255, 255, 255)):
    f = ImageFont.truetype(FONT, size)
    while max(f.getbbox(l)[2] - f.getbbox(l)[0] for l in lines) > MAXW: size -= 4; f = ImageFont.truetype(FONT, size)
    txt = Image.new('L', (W, H), 0); d = ImageDraw.Draw(txt); y = y0; boxes = []
    for l in lines:
        b = f.getbbox(l); w = b[2] - b[0]; x = CX - w / 2 - b[0]
        d.text((x, y), l, font=f, fill=255); boxes.append((x + b[0], y + b[1], x + b[2], y + b[3])); y += int(size * 1.08)
    glow = txt.filter(ImageFilter.GaussianBlur(22)).point(lambda v: min(255, int(v * 2.2)))
    sh = Image.new('L', (W, H), 0); sh.paste(txt.filter(ImageFilter.GaussianBlur(7)), (0, 7))
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    img.paste(Image.new('RGBA', (W, H), (0, 0, 0, 255)), (0, 0), glow.point(lambda v: int(v * .55)))
    img.paste(Image.new('RGBA', (W, H), (0, 0, 0, 255)), (0, 0), sh.point(lambda v: int(v * .8)))
    img.paste(Image.new('RGBA', (W, H), color + (255,)), (0, 0), txt)
    p = os.path.join(OUT, name + '.png'); img.save(p, optimize=False, compress_level=3)
    return p, boxes, size
def counter(num, sub, name):
    a = card([num], 170, 360, name + '_a')[0]; b = card([sub], 58, 560, name + '_b')[0]
    im = Image.alpha_composite(Image.open(a), Image.open(b)); p = os.path.join(OUT, name + '.png'); im.save(p, compress_level=3)
    os.remove(a); os.remove(b); return p
empty = os.path.join(OUT, 'empty.png'); Image.new('RGBA', (W, H), (0, 0, 0, 0)).save(empty)
TOP = 380
# (start, end, lines, size, y, name)
CARDS = [(0.0, 3.0, ['FALL INTO A', 'BLACK HOLE?'], 132, TOP, 'c_hook'),
         (3.0, 7.0, ['4.3 MILLION', 'SUNS HEAVY'], 118, TOP, 'c_mass'),
         (7.0, 10.0, ['ITS EDGE:', '25 MILLION KM WIDE'], 108, TOP, 'c_edge'),
         (10.0, 12.0, ['YOUR FRIEND', 'WATCHES FROM AFAR'], 104, TOP, 'c_friend'),
         (12.0, 14.5, ['THEY SEE YOU', 'FREEZE AT THE EDGE'], 104, TOP, 'c_freeze'),
         (14.5, 16.6, ['BUT YOU', 'KEEP FALLING'], 118, TOP, 'c_fall'),
         (16.6, 18.0, ['NO WAY BACK'], 124, TOP, 'c_noway'),
         (30.8, 31.9, ['STRETCHED LIKE', 'A NOODLE'], 112, TOP, 'c_noodle'),
         (31.9, 33.8, ['YOUR FRIEND STILL', 'SEES YOU FROZEN'], 100, TOP, 'c_still'),
         (33.8, 35.0, ['FOLLOW FOR MORE'], 64, 1330, 'c_follow')]
FPS = 30; CD0, CD1 = 18.0, 30.8                  # 12.8 s real-time countdown
seq = []; info = {}
def frame_t(i): return i / FPS
for c in CARDS:
    p, boxes, size = card(c[2], c[3], c[4], c[5]); info[c[5]] = dict(lines=c[2], size=size, boxes=boxes)
    seq.append((c[0], c[1], p))
cache = {}
for i in range(round(CD0 * FPS), round(CD1 * FPS)):
    left = max(0.0, 12.8 - (frame_t(i) - CD0)); sub = 'UNTIL YOU ARE TORN APART' if frame_t(i) < 24.6 else 'NOT EVEN LIGHT GETS OUT'
    s = f'{left:.1f} S|{sub}'
    if s not in cache: cache[s] = counter(f'{left:.1f} S', sub, 'n_' + s.replace(' ', '_').replace('.', 'p').replace('|', '_'))
    seq.append((frame_t(i), frame_t(i + 1), cache[s]))
seq.sort(); lst = []; t = 0.0
for a, b, p in seq:
    if a > t + 1e-6: lst.append((empty, a - t))
    lst.append((p, b - a)); t = b
if t < 35.0: lst.append((empty, 35.0 - t))
with open(os.path.join(OUT, 'text.txt'), 'w') as f:
    for p, d in lst: f.write(f"file '{os.path.abspath(p)}'\nduration {d:.4f}\n")
    f.write(f"file '{os.path.abspath(lst[-1][0])}'\n")
import json; json.dump(info, open(os.path.join(OUT, 'cards.json'), 'w'), indent=1)
print('cards', len(CARDS), 'counter states', len(cache))
