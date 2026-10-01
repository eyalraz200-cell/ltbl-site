# Generates the single-stage "world" markup: every element carries data-k = its left/top (and optionally w,h,rotation,opacity)
# in each of the nine Figma frames (hero, about, day2..day6, shabbat, footer). null = carry the neighbouring value.
# Positions are verbatim from the Figma frames (docs/figma-geometry.md). Run: python3 tools/gen-world.py > /tmp/world.html
import json
N = 9
def K(*pairs):
    """pairs: (frameIndex, [x,y] or [x,y,w,h] or [x,y,w,h,r]) → list of 9 with carry (first defined carried backwards, last forwards)."""
    k = [None] * N
    for i, v in pairs: k[i] = v
    first = next(i for i in range(N) if k[i] is not None)
    for i in range(first): k[i] = k[first]
    for i in range(first + 1, N):
        if k[i] is None: k[i] = k[i - 1]
    return k
def same(i, *frames):
    return [(f, i) for f in frames]
ALL = range(N)
def rng(a, b): return list(range(a, b + 1))

def el(tag, cls, k, w, h, inner='', extra='', attrs=''):
    x, y = k[0][0], k[0][1]
    size = f'width:{w}px;height:{h}px;' if w is not None else ''
    return f'<{tag} class="{cls}" data-k=\'{json.dumps(k, separators=(",",":"))}\' style="left:{x}px;top:{y}px;{size}{extra}"{attrs}>{inner}</{tag}>'
def img(cls, src, k, w, h, extra='', attrs=''):
    x, y = k[0][0], k[0][1]
    return f'<img class="{cls}" src="assets/img/{src}.webp" alt="" data-k=\'{json.dumps(k, separators=(",",":"))}\' style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;{extra}"{attrs}>'

B = []   # backdrop (scenery that bleeds to the window edge)
SC = []  # discrete scenery pieces on the contained stage, behind content (moon, sun, birds, big hands)
S = []   # stage (content)

# ---- sky
B.append(img('sky', 'shared/sky', K((0, [0, 0])), 1728, 1117, attrs=' fetchpriority="high"'))
# ---- night (behind ground)
night = [('night-2', 798, 366, (1753, 411), (761, 411)), ('night-4', 930, 745, (1827, 0), (798, 0)), ('night-3', 874, 903, (2023, 0), (854, 0)), ('night-1', 651, 568, (2337, 0), (1077, 0)), ('moon', 146, 177, (2517, -742), (1424, 51))]
for slug, w, h, p3, p4 in night:
    (SC if slug == 'moon' else B).append(img(('scenery n ' if slug == 'moon' else 'n ') + slug, 'shared/' + slug, K((3, list(p3)), (4, list(p4))), w, h))
# ---- ground: day2 frame has it at group offset (9,791), day3+ in place
ground = [('mountain-2', 609, 174, 900, 506), ('ground-8', 351, 388, 1377, 496), ('mountain-1', 945, 316, 0, 401), ('ground-5', 461, 396, 539, 555), ('ground-4', 747, 494, 0, 470), ('ground-6', 459, 399, 880, 555), ('ground-3', 777, 356, 721, 557), ('ground-7', 375, 399, 1353, 591), ('ground-1', 435, 312, 565, 576), ('ground-2', 726, 512, 0, 605)]
d2local = {'mountain-2': (900, 911), 'ground-8': (1377, 496), 'mountain-1': (0, 806), 'ground-5': (539, 555), 'ground-4': (0, 470), 'ground-6': (880, 555), 'ground-3': (721, 388), 'ground-7': (1353, 401), 'ground-1': (565, 423), 'ground-2': (0, 401)}
for slug, w, h, x, y in ground:
    lx, ly = d2local[slug]
    B.append(img('g ' + slug, 'shared/' + slug, K((2, [lx + 9, ly + 791]), (3, [x, y])), w, h))
# ---- sea
sea = {  # slug: (w,h, f1, f2, f3, f4+)
 'sea-5': (863, 482, (-1, 1450), (-1, 579), (-1, 760), (0, 760)),
 'sea-4': (982, 390, (-1, 1395), (-1, 685), (-1, 773), (-1, 787)),
 'sea-2': (1112, 222, (-1, 1173), (-1, 894), (-15, 915), (-15, 934)),
 'sea-3': (917, 406, (810, 1395), (810, 608), (810, 807), (810, 787)),
 'sea-1': (1243, 305, (484, 1145), (484, 811), (541, 915), (541, 881)),
}
order = ['sea-5', 'whale', 'sea-4', 'sea-2', 'sea-3', 'fish', 'sea-1']
for slug in order:
    if slug == 'whale':
        B.append(img('s whale', 'shared/whale', K((3, [81.2, 2086.7, 344, 293, 45]), (4, [81.2, 969.7, 344, 293, 45]), (5, [164, 623, 344, 293, 0])), 344, 293))
    elif slug == 'fish':
        FISH = [(1,227,142,103,102),(2,130,132,89,98),(3,404,57,76,39),(4,197,42,69,54),(5,508,51,94,45),(6,102,84,81,81),(7,24,196,88,97),(8,227,58,126,99),(9,382,0,132,66),(10,309,74,120,68),(11,0,164,60,77),(12,283,14,78,50),(13,450,92,75,40),(14,514,98,127,93)]
        inner = ''.join(f'<img src="assets/img/shared/fish-{i}.webp" alt="" style="left:{fx}px;top:{fy}px;width:{fw}px;height:{fh}px">' for i, fx, fy, fw, fh in FISH)
        B.append(el('div', 's fish', K((4, [542.5, 1215.5, 641, 293, -107.52]), (5, [984, 726, 641, 293, 0])), 641, 293, inner))
    else:
        w, h, f1, f2, f3, f4 = sea[slug]
        B.append(img('s ' + slug, 'shared/' + slug, K((1, list(f1)), (2, list(f2)), (3, list(f3)), (4, list(f4))), w, h))
# ---- clouds
clouds = [  # slug, file, w, h, frames 0-3 pos, frames 4+ pos (or None = unchanged), f2 override (day2 parked)
 ('c-front-left', 'cloud-front-left', 616, 309, (347, 88), (314, -22), None),
 ('c-bl-back', 'cloud-bottom-left-back', 890, 446, (-128, 625), None, (-950, 404)),
 ('c-br-back', 'cloud-bottom-right-back', 890, 446, (1140, 627), None, (1975, 568)),
 ('c-br-front', 'cloud-bottom-right-front', 2428, 569, (654, 695), None, (1785, 1014)),
 ('c-bl-front', 'cloud-bottom-left-front', 964, 528, (-64, 679), None, (-1092, 953)),
 ('c-tiny', 'cloud-tiny', 255, 175, (854, 114), (329, 175), None),
 ('c-left-back', 'cloud-left-back', 509, 251, (-60, 119), None, None),
 ('c-left-far', 'cloud-left-far', 701, 395, (-165, -115), (-172, -116), None),
 ('sun', 'sun', 146, 144, (0, -259), (93, 58), None),
 ('c-top-big', 'cloud-top-big', 1990, 466, (-122, -102), (-1133, -356), None),
 ('c-small-right', 'cloud-small-right', 446, 131, (968, 190), (1959, 202), None),
 ('c-tr-front', 'cloud-top-right-front', 831, 455, (1177, 5), (1766, 5), None),
]
for slug, file, w, h, p0, p4, p2 in clouds:
    pairs = [(0, list(p0))]
    if p2: pairs.append((2, list(p2)))
    if p4: pairs.append((4, list(p4)))
    (SC if slug == 'sun' else B).append(img(('scenery cloud ' if slug == 'sun' else 'cloud ') + slug, 'shared/' + file, K(*pairs), w, h, attrs=' fetchpriority="high"'))
# ---- birds (smaller and off-left in day4, in place from day5)
birds = [('bird-1', (-230, 291, 137, 147), (374, 210, 186, 199)), ('bird-5', (-249, 83, 108, 119), (248, 49, 147, 161)), ('bird-4', (-552, 337, 96, 55), (49, 330, 130, 74)), ('bird-3', (-456, 143, 91, 102), (75, 117, 124, 139)), ('bird-2', (-336, 291, 99, 57), (192, 263, 136, 78))]
for slug, p4, p5 in birds:
    SC.append(img('scenery bird ' + slug, 'shared/' + slug, K((4, list(p4)), (5, list(p5))), p4[2], p4[3]))
# ---- big hands
SC.append(img('scenery bh hand-man', 'shared/hand-man', K((5, [-688, 1209]), (6, [-307, 837]), (7, [-52, 519]), (8, [-1, 446])), 865, 669))
SC.append(img('scenery bh hand-god', 'shared/hand-god', K((5, [1583, -662]), (6, [1185, -285]), (7, [893, -48]), (8, [855, 0])), 873, 698))
# ---- darkener (opacity .4, footer .25) — opacity is the 6th slot
B.append(el('div', 'darkener', K((0, [0, 0, 1728, 1117, 0, .4]), (7, [0, 0, 1728, 1117, 0, .4]), (8, [0, 0, 1728, 1117, 0, .25])), 1728, 1117))
# ---- intro clouds (removed after the intro; positions = סרטון 1)
dark = [('d-8', 3, 0, 1721, 524), ('d-10', 502, 256, 1121, 523), ('d-9', 520, 240, 880, 615), ('d-7', 0, 0, 976, 1117), ('d-6', 1095, 0, 633, 1034), ('d-1', 0, 658, 632, 459), ('d-2', 0, 0, 891, 358), ('d-3', 934, 0, 794, 478), ('d-4', 551, 640, 1177, 477), ('d-5', 0, 175, 964, 513)]
B.append('<div class="intro-clouds" style="left:0;top:0;width:1728px;height:1117px" aria-hidden="true">' + ''.join(f'<img class="dark {s}" src="assets/img/intro/{s.replace("d-","dark-")}.webp" alt="" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">' for s, x, y, w, h in dark) + '</div>')

# ================= content =================
def tr(x): return x
# hero (frame 0; parked in about frame 1)
S.append(el('div', 'logo', K((0, [785, 87]), (1, [785, -1873])), 158, None, '<img src="assets/img/shared/logo-god.webp" alt="Jehova Events" style="position:static;width:158px;height:104px;object-fit:contain"><p class="logo__word">jehova events</p>'))
S.append(el('h1', 'h192 title-1', K((0, [334, 228]), (1, [334, -1699])), 1060, None, 'let there be'))
S.append(el('h1', 'h192 title-2', K((0, [334, 383]), (1, [348, -1402])), 1060, None, 'light'))
S.append(el('p', 'b36 sub', K((0, [334, 592]), (1, [334, -1127])), 1060, None, 'And god said, let there be an outrageous seven day Freak-Out<br>And god saw that it was good'))
S.append(el('a', 'ticket', K((0, [705, 866]), (1, [705, 2434])), 316, 99, '<img src="assets/img/shared/ticket.webp" alt="Tickets" style="position:static;width:100%;height:100%">', attrs=' href="#"'))
S.append(el('div', 'hand hand--right', K((0, [1052.6, 751]), (1, [3347, 771])), 271.569, 213.37, '<img src="assets/img/shared/hand.webp" alt="">'))
S.append(el('div', 'hand hand--left', K((0, [398, 822]), (1, [-1894, 793])), 274.582, 170.848, '<img src="assets/img/shared/hand.webp" alt="">'))
# about (frame 1)
S.append(el('h2', 'h192 about-title', K((0, [334.5, 1117]), (1, [334.5, 170]), (2, [334.5, 3598])), 1060, None, 'about the<br>festival'))
S.append(el('p', 'b36 about-para', K((0, [298, 1465]), (1, [297, 644]), (2, [298, 3946])), 1134, None, '“LET THERE BE LIGHT” is a unique once in a lifetime experience. There has never been anything like it, because there has never BEEN anything before it!'))
# day2 (frame 2)
S.append(el('div', 'col day2-text', K((1, [1753, 324]), (2, [741, 324]), (3, [2615, 324])), 922, None,
  '<h2 class="hd h72" style="width:100%">Battle of the giants<br>Poseidon vs. The Almighty!</h2><p class="hd h36x" style="width:730px">Ocean\'s Wrath vs. Divine Power!</p><p class="bd b30" style="width:730px;height:274px">Get ready for the ultimate showdown! On 02.01.0001, witness an incredible battle as Poseidon, the God of the Sea, takes on the Almighty in a mythical contest of strength, will, and supremacy.</p>', 'gap:53px;'))
S.append(el('div', 'box cutout poseidon', K((1, [343, 1095]), (2, [201, 430]), (3, [574, 2182])), 728.443, 650.596, '<img src="assets/img/shared/poseidon.webp" alt="" style="width:608px;height:487px;transform:rotate(-162.06deg) scaleY(-1);filter:drop-shadow(10px -11px 4px #000)">'))
S.append(el('div', 'box cutout zeus', K((1, [-584, -291]), (2, [0, 103]), (3, [-1371, -1148])), 559.068, 660.44, '<img src="assets/img/shared/zeus.webp" alt="" style="width:453.279px;height:582.634px;transform:rotate(11.35deg);filter:drop-shadow(10px -11px 4px #000)">'))
# day3 (frame 3)
def cap(cls, src, k, w, ih, text, iw=None, gap=12, mirror=False, shadow='2px -11px 4px #000', cover=False):
    iw = iw or w
    tf = ';transform:scaleX(-1)' if mirror else ''
    fit = ';object-fit:cover' if cover else ''
    return el('div', 'cap cutout ' + cls, k, w, None, f'<img src="assets/img/{src}.webp" alt="" style="width:{iw}px;height:{ih}px;filter:drop-shadow({shadow}){tf}{fit}"><p class="bd b24">{text}</p>', f'gap:{gap}px;')
S.append(el('div', 'col celeb-text', K((2, [64, 1182]), (3, [64, 279]), (4, [64, 2717])), 790, None, '<h2 class="hd h48x" style="width:790px">celebrities meet and greet</h2><p class="bd b24" style="width:790px">Get a chance to meet your favorite celebrities, with Autograph Stations, Photo Opportunities, and Live Q&amp;A Sessions</p>', 'gap:24px;align-items:flex-start;'))
S.append(cap('satan', 'day3/satan', K((2, [90, 1194]), (3, [90, 474]), (4, [90, 2729])), 265, 262, 'Satan', gap=0))
S.append(cap('jesus', 'day3/jesus', K((2, [329, 1468]), (3, [329, 748]), (4, [329, 3003])), 225, 212, 'Jesus', gap=9, mirror=True, shadow='-9px -11px 4px #000', cover=True))
S.append(cap('gabriel', 'day3/gabriel', K((2, [500, 1191]), (3, [500, 471]), (4, [500, 2726])), 317, 202, 'Gabriel', gap=18, cover=True))
S.append(el('div', 'crop cutout god-portrait', K((2, [1094, -419]), (3, [1094, 375]), (4, [1158, -1878])), 342, 384, '<img src="assets/img/day3/god-portrait.webp" alt="" style="position:absolute;left:-12.59%;top:-5.73%;width:127.23%;height:113.54%">', 'filter:drop-shadow(2px -11px 4px #000);'))
S.append(el('div', 'col god-text', K((2, [874, -211]), (3, [874, 829]), (4, [938, -1670])), 790, None, '<h2 class="hd h48x" style="width:100%">“one on one” meetings with yaweh</h2><p class="bd b24" style="width:100%">A once-in-a-lifetime opportunity to learn from a mind like no other,<br>where you can understand important insights and maybe get the inside scoop</p>', 'gap:24px;align-items:flex-end;'))
# day4 (frame 4)
S.append(el('div', 'col day4-text', K((3, [181, -279]), (4, [181, 236]), (5, [181, -1387])), 1365, None, '<h2 class="hd h96" style="width:100%">Be fruitfull and multiply party </h2><p class="bd b30" style="width:1060px">Celebrate from the dusk till dawn in an OFF THE HOOK Mitzvah party<br>Make your descendants become as numerous as the stars of the sky!</p>', 'gap:56px;'))
S.append(img('cutout guys', 'day4/guys', K((3, [1782, 627]), (4, [943, 627]), (5, [4018, 627])), 519, 270, 'object-fit:contain;filter:drop-shadow(2px -11px 4px #000)'))
S.append(img('cutout girls', 'day4/girls', K((3, [-545, 614]), (4, [266, 614]), (5, [-2453, 614])), 520, 283, 'object-fit:contain;filter:drop-shadow(-8px -11px 4px #000)'))
# day5 (frame 5)
S.append(el('div', 'col day5-text', K((4, [-849, 400]), (5, [105, 400]), (6, [-2709, 400])), 790, None, '<div class="col" style="width:100%;align-items:flex-start"><h2 class="hd h72" style="width:100%">family activity</h2><h2 class="hd h96" style="width:100%">Name the animals!</h2></div><p class="bd b30" style="width:100%">Use your imagination and creativity in a fantastic Animal Name-a-palooza, invent and name the animals of the world<br>Fun for the whole family!</p>', 'gap:37px;'))
S.append(cap('lion', 'day5/lion', K((4, [1873, 568]), (5, [1066, 568]), (6, [4484, 568])), 193, 244, '“Lion”', mirror=True, shadow='4px -10px 4px #000'))
S.append(cap('fox', 'day5/fox', K((4, [1816, 244]), (5, [1009, 244]), (6, [4427, 244])), 202, 201, '“King Kunta”'))
S.append(cap('orangutan', 'day5/orangutan', K((4, [2066, 244]), (5, [1342, 244]), (6, [4677, 244])), 207, 232, '“Orangutan”', iw=191, shadow='-7px -11px 4px #000'))
S.append(cap('ostrich', 'day5/ostrich', K((4, [2103, 582]), (5, [1379, 582]), (6, [4714, 582])), 193, 211, '“Kalderon”', iw=171, shadow='-6px -8px 4px #000', cover=True))
# day6 (frame 6)
S.append(el('div', 'col day6-text', K((5, [64, 1388]), (6, [64, 540]), (7, [64, 2827])), 1600, None, '<div class="col" style="width:100%;gap:21px"><h2 class="hd h96" style="width:100%">“first-man” sculpting competition</h2><h2 class="hd h72" style="width:100%">Design the first human!</h2></div><p class="bd b30" style="width:1056px">Imagine a world where your creative vision shapes humanity’s origins, this competition allows you to become the creator - and see your creations come to life in a fantastical, divine way!</p>', 'gap:49px;'))
S.append(el('div', 'row adams cutout', K((5, [444.5, 1322]), (6, [444.5, 301]), (7, [444.5, 2761])), None, None, '<img src="assets/img/day6/adam-bald.webp" alt="" style="width:173px;height:222px;object-fit:contain"><img src="assets/img/day6/adam-weird.webp" alt="" style="width:243px;height:222px;object-fit:contain"><img src="assets/img/day6/adam-bully.webp" alt="" style="width:212px;height:218px;object-fit:contain;transform:scaleX(-1)">', 'gap:105px;'))
# day7 / shabbat (frame 7)
S.append(el('h2', 'hd h128 day7-title', K((6, [64, -255]), (7, [64, 229]), (8, [64, -1051])), 1600, None, 'netflix and chill<br>at god’s house'))
S.append(el('p', 'bd b30 day7-para', K((6, [335, 1117]), (7, [335, 796]), (8, [335, 1964])), 1060, None, 'This day is not just a break. It is a holy celebration. It is a time to remember that life is a gift, and that love is ever-present, surrounding you with warmth, grace, and joy. The Sabbath is an invitation to celebrate life itself - with rest, with gratitude, and with peace.'))
# footer (frame 8)
S.append(el('a', 'ticket ticket--footer', K((7, [696, -147]), (8, [696, 267])), 316, 99, '<img src="assets/img/shared/ticket.webp" alt="Tickets" style="position:static;width:100%;height:100%">', attrs=' href="#"'))
S.append(el('div', 'logo logo--footer', K((7, [785, -152]), (8, [785, 73])), 158, None, '<img src="assets/img/shared/logo-god.webp" alt="Jehova Events" style="position:static;width:158px;height:104px;object-fit:contain"><p class="logo__word">jehova events</p>'))
S.append(el('div', 'col footer-learn', K((7, [199, 1381]), (8, [199, 842])), 385, None, '<a class="hd h60 aura-body" href="#about" style="width:100%">learn more</a><div class="col" style="width:100%;gap:8px"><p class="hd h36x aura-body" style="width:100%">faq</p><p class="hd h36x aura-body" style="width:100%">about god</p><p class="hd h36x aura-body" style="width:100%">community</p></div>', 'gap:14px;'))
S.append(el('div', 'col footer-contact', K((7, [1144, 1381]), (8, [1144, 842])), 385, None, '<p class="hd h60 aura-body" style="width:100%">contact</p><p class="hd h36x aura-body" style="width:100%;white-space:normal">just think about it, god will hear you</p>', 'gap:28px;'))
S.append(el('h2', 'h192 footer-title', K((7, [334, 1067]), (8, [334, 405])), 1060, None, 'let there be<br>light'))

FRAMES = 'hero,about,day2,day3,day4,day5,day6,shabbat,footer'
DAYS = '1,about,2,3,4,5,6,7,contact'
OUT = f'<section class="world" id="world" data-frames="{FRAMES}" data-days="{DAYS}">\n  <div class="backdrop">\n    ' + '\n    '.join(B) + '\n  </div>\n  <div class="stage">\n    ' + '\n    '.join(SC + S) + '\n  </div>\n</section>'
import re as _re
CRIT=('shared/sky','shared/cloud-','intro/dark-','shared/logo-god','shared/ticket','shared/hand.')
def _p(m):
    t=m.group(0).replace(' fetchpriority="high"',''); src=_re.search(r'assets/img/([^"]+)',t).group(1)
    return t.replace('<img ','<img fetchpriority="'+('high' if src.startswith(CRIT) else 'low')+'" ',1)
print(_re.sub(r'<img [^>]*src="assets/img/[^>]*>',_p,OUT))
