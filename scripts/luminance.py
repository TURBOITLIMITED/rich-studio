import json, subprocess, os, concurrent.futures as cf

ROOT = '/home/ops/repos/rich-studio/public'
d = json.load(open('content/projects.json'))
jobs = []
for p in d:
    for im in p['images']:
        jobs.append(im)

def lum(im):
    # The band sits at the foot of the viewport, but a plate scrolls through
    # it top to bottom, so the whole image can end up behind the text.
    # Mean over the whole frame is the honest number.
    path = os.path.join(ROOT, im['sm'].lstrip('/'))
    if not os.path.exists(path):
        path = os.path.join(ROOT, im['src'].lstrip('/'))
    if not os.path.exists(path):
        return im, None
    try:
        out = subprocess.run(
            ['convert', path, '-colorspace', 'Gray', '-resize', '64x64!', '-format', '%[fx:mean]', 'info:'],
            capture_output=True, text=True, timeout=30)
        return im, round(float(out.stdout.strip()), 3)
    except Exception:
        return im, None

miss = 0
with cf.ThreadPoolExecutor(max_workers=12) as ex:
    for im, v in ex.map(lum, jobs):
        if v is None:
            miss += 1
        else:
            im['lum'] = v

json.dump(d, open('content/projects.json','w'), indent=2)
vals = sorted(im['lum'] for p in d for im in p['images'] if 'lum' in im)
print('images:', len(jobs), 'missing:', miss)
print('luminance min/median/max: %.3f / %.3f / %.3f' % (vals[0], vals[len(vals)//2], vals[-1]))
print('below 0.45 (would need light text):', sum(1 for v in vals if v < 0.45), 'of', len(vals))
