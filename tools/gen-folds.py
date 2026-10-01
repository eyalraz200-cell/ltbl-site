# Generates a fold's markup from the Figma geometry (docs/figma-geometry.md). Run: python3 tools/gen-folds.py <day2..day6|shabbat|footer> → prints the <section> pasted into index.html.
import sys
def img(cls, src, x, y, w, h, extra=''):
    return f'<img class="{cls}" src="assets/img/{src}.webp" alt="" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px{extra}">'
SKY = '<img class="sky" src="assets/img/shared/sky.webp" alt="" style="left:0;top:0;width:1728px;height:1117px">'
def group(cls, items, clip=False):
    return f'<div class="{cls}" style="left:0;top:0;width:1728px;height:1117px{";overflow:hidden" if clip else ""}">\n      ' + '\n      '.join(items) + '\n    </div>'
GROUND = group('ground', [img('g','shared/mountain-2',900,506,609,174), img('g','shared/ground-8',1377,496,351,388), img('g','shared/mountain-1',0,401,945,316), img('g','shared/ground-5',539,555,461,396), img('g','shared/ground-4',0,470,747,494), img('g','shared/ground-6',880,555,459,399), img('g','shared/ground-3',721,557,777,356), img('g','shared/ground-7',1353,591,375,399), img('g','shared/ground-1',565,576,435,312), img('g','shared/ground-2',0,605,726,512)], clip=True)
NIGHT = group('night', [img('n','shared/night-2',761,411,798,366), img('n','shared/night-4',798,0,930,745), img('n','shared/night-3',854,0,874,903), img('n','shared/night-1',1077,0,651,568), img('n moon','shared/moon',1424,51,146,177)])
CLOUDS_D4 = group('clouds', [img('cloud c-front-left','shared/cloud-front-left',314,-22,616,309), img('cloud c-tiny','shared/cloud-tiny',329,175,255,175), img('cloud c-left-back','shared/cloud-left-back',-60,119,509,251), img('cloud c-left-far','shared/cloud-left-far',-172,-116,701,395), img('cloud sun','shared/sun',93,58,146,144), img('cloud c-top-big','shared/cloud-top-big',-1133,-356,1990,466)], clip=True)
BIRDS = group('birds', [img('bird','shared/bird-1',374,210,186,199), img('bird','shared/bird-5',248,49,147,161), img('bird','shared/bird-4',49,330,130,74), img('bird','shared/bird-3',75,117,124,139), img('bird','shared/bird-2',192,263,136,78)])
FISH = [(1,227,142,103,102),(2,130,132,89,98),(3,404,57,76,39),(4,197,42,69,54),(5,508,51,94,45),(6,102,84,81,81),(7,24,196,88,97),(8,227,58,126,99),(9,382,0,132,66),(10,309,74,120,68),(11,0,164,60,77),(12,283,14,78,50),(13,450,92,75,40),(14,514,98,127,93)]
def fishgroup(x,y):
    return f'<div class="fish" style="left:{x}px;top:{y}px;width:641px;height:293px">\n        ' + '\n        '.join(img('f',f'shared/fish-{i}',fx,fy,fw,fh) for i,fx,fy,fw,fh in FISH) + '\n      </div>'
def sea_d5(hands=None):
    return group('sea', [img('s','shared/sea-5',0,760,863,482), img('s whale','shared/whale',164,623,344,293), img('s','shared/sea-4',-1,787,982,390), img('s','shared/sea-2',-15,934,1112,222), img('s','shared/sea-3',810,787,917,406), fishgroup(984,726), img('s','shared/sea-1',541,881,1243,305)])
def cap(cls, src, x, y, w, ih, text, iw=None, gap=12, mirror=False, shadow='2px -11px 4px #000', travel='', cover=False):
    iw = iw or w
    tf = ';transform:scaleX(-1)' if mirror else ''
    fit = ';object-fit:cover' if cover else ''
    return f'<div class="cap cutout {cls}"{travel} style="left:{x}px;top:{y}px;width:{w}px;gap:{gap}px"><img src="assets/img/{src}.webp" alt="" style="width:{iw}px;height:{ih}px;filter:drop-shadow({shadow}){tf}{fit}"><p class="bd b24">{text}</p></div>'
def tr(frm, to):
    return (f' data-from="{frm}"' if frm else '') + (f' data-to="{to}"' if to else '')

def day2():
    sea = group('sea', [img('s','shared/sea-5',-1,579,863,482), img('s','shared/sea-4',-1,685,982,390), img('s','shared/sea-2',-1,894,1112,222), img('s','shared/sea-3',810,608,917,406), img('s','shared/sea-1',484,811,1243,305)])
    clouds = group('clouds', [img('cloud c-front-left','shared/cloud-front-left',347,88,616,309), img('cloud c-tiny','shared/cloud-tiny',854,114,255,175), img('cloud c-left-back','shared/cloud-left-back',-60,119,509,251), img('cloud c-left-far','shared/cloud-left-far',-165,-115,701,395), img('cloud c-top-big','shared/cloud-top-big',-122,-102,1990,466), img('cloud c-small-right','shared/cloud-small-right',968,190,446,131), img('cloud c-tr-front','shared/cloud-top-right-front',1177,5,831,455)], clip=True)
    text = f'''<div class="col day2-text"{tr("1753,324","2615,324")} style="left:741px;top:324px;width:922px;gap:53px">
      <h2 class="hd h72" style="width:100%">Battle of the giants<br>Poseidon vs. The Almighty!</h2>
      <p class="hd h36x" style="width:730px">Ocean's Wrath vs. Divine Power!</p>
      <p class="bd b30" style="width:730px;height:274px">Get ready for the ultimate showdown! On 02.01.0001, witness an incredible battle as Poseidon, the God of the Sea, takes on the Almighty in a mythical contest of strength, will, and supremacy.</p>
    </div>'''
    poseidon = f'<div class="box cutout poseidon"{tr("343,1095","574,2182")} style="left:201px;top:430px;width:728.443px;height:650.596px"><img src="assets/img/shared/poseidon.webp" alt="" style="width:608px;height:487px;transform:scaleY(-1) rotate(-162.06deg);filter:drop-shadow(10px -11px 4px #000)"></div>'
    zeus = f'<div class="box cutout zeus"{tr("-584,-291","-1371,-1148")} style="left:0;top:103px;width:559.068px;height:660.44px"><img src="assets/img/shared/zeus.webp" alt="" style="width:453.279px;height:582.634px;transform:rotate(11.35deg);filter:drop-shadow(10px -11px 4px #000)"></div>'
    return section('day2','2',[SKY,sea,clouds,'<div class="darkener"></div>',text,poseidon,zeus])

def day3():
    sea = group('sea', [img('s','shared/sea-5',-1,760,863,482), img('s','shared/sea-4',-1,773,982,390), img('s','shared/sea-2',-15,915,1112,222), img('s','shared/sea-3',810,807,917,406), img('s','shared/sea-1',541,915,1243,305)])
    clouds = group('clouds', [img('cloud c-front-left','shared/cloud-front-left',347,88,616,309), img('cloud c-tiny','shared/cloud-tiny',854,114,255,175), img('cloud c-left-back','shared/cloud-left-back',-60,119,509,251), img('cloud c-left-far','shared/cloud-left-far',-165,-115,701,395), img('cloud c-top-big','shared/cloud-top-big',-122,-102,1990,466), img('cloud c-small-right','shared/cloud-small-right',968,190,446,131), img('cloud c-tr-front','shared/cloud-top-right-front',1177,5,831,455)])
    celeb = f'''<div class="col celeb-text"{tr("64,1182","64,2717")} style="left:64px;top:279px;width:790px;gap:24px;align-items:flex-start">
      <h2 class="hd h48x" style="width:790px">celebrities meet and greet</h2>
      <p class="bd b24" style="width:790px">Get a chance to meet your favorite celebrities, with Autograph Stations, Photo Opportunities, and Live Q&amp;A Sessions</p>
    </div>'''
    satan = cap('satan','day3/satan',90,474,265,262,'Satan',gap=0,travel=tr("90,1194","90,2729"))
    jesus = cap('jesus','day3/jesus',329,748,225,212,'Jesus',gap=9,mirror=True,shadow='-9px -11px 4px #000',travel=tr("329,1468","329,3003"),cover=True)
    gabriel = cap('gabriel','day3/gabriel',500,471,317,202,'Gabriel',gap=18,travel=tr("500,1191","500,2726"),cover=True)
    god = f'<div class="crop cutout god-portrait"{tr("1094,-419","1158,-1878")} style="left:1094px;top:375px;width:342px;height:384px;filter:drop-shadow(2px -11px 4px #000)"><img src="assets/img/day3/god-portrait.webp" alt="" style="position:absolute;left:-12.59%;top:-5.73%;width:127.23%;height:113.54%"></div>'
    godtext = f'''<div class="col god-text"{tr("874,-211","938,-1670")} style="left:874px;top:829px;width:790px;gap:24px;align-items:flex-end">
      <h2 class="hd h48x" style="width:100%">“one on one” meetings with yaweh</h2>
      <p class="bd b24" style="width:100%">A once-in-a-lifetime opportunity to learn from a mind like no other,<br>where you can understand important insights and maybe get the inside scoop</p>
    </div>'''
    return section('day3','3',[SKY,GROUND,sea,clouds,'<div class="darkener"></div>',celeb,satan,jesus,gabriel,god,godtext])

def day4():
    sea = group('sea', [img('s','shared/sea-5',0,760,863,482), img('s whale','shared/whale',81.2,969.7,344,293,';transform:rotate(45deg)'), img('s','shared/sea-4',-1,787,982,390), img('s','shared/sea-2',-15,934,1112,222), img('s','shared/sea-3',810,787,917,406), img('s','shared/sea-1',541,881,1243,305)])
    text = f'''<div class="col day4-text"{tr("181,-279","181,-1387")} style="left:181px;top:236px;width:1365px;gap:56px">
      <h2 class="hd h96" style="width:100%">Be fruitfull and multiply party </h2>
      <p class="bd b30" style="width:1060px">Celebrate from the dusk till dawn in an OFF THE HOOK Mitzvah party<br>Make your descendants become as numerous as the stars of the sky!</p>
    </div>'''
    guys = f'<img class="cutout guys"{tr("1782,627","4018,627")} src="assets/img/day4/guys.webp" alt="" style="left:943px;top:627px;width:519px;height:270px;object-fit:contain;filter:drop-shadow(2px -11px 4px #000)">'
    girls = f'<img class="cutout girls"{tr("-545,614","-2453,614")} src="assets/img/day4/girls.webp" alt="" style="left:266px;top:614px;width:520px;height:283px;object-fit:contain;filter:drop-shadow(-8px -11px 4px #000)">'
    return section('day4','4',[SKY,NIGHT,GROUND,sea,CLOUDS_D4,'<div class="darkener"></div>',text,guys,girls])

def animals(prefix_from, prefix_to):
    f,t = prefix_from, prefix_to
    return [cap('lion','day5/lion',1066,568,193,244,'“Lion”',mirror=True,shadow='4px -10px 4px #000',travel=tr(f'{f[0]},568',f'{t[0]},568')),
            cap('fox','day5/fox',1009,244,202,201,'“King Kunta”',travel=tr(f'{f[1]},244',f'{t[1]},244')),
            cap('orangutan','day5/orangutan',1342,244,207,232,'“Orangutan”',iw=191,shadow='-7px -11px 4px #000',travel=tr(f'{f[2]},244',f'{t[2]},244')),
            cap('ostrich','day5/ostrich',1379,582,193,211,'“Kalderon”',iw=171,shadow='-6px -8px 4px #000',travel=tr(f'{f[3]},582',f'{t[3]},582'),cover=True)]

def day5():
    hands = group('bighands', [img('bh hand-god','shared/hand-god',1583,-662,873,698)])
    text = f'''<div class="col day5-text"{tr("-849,400","-2709,400")} style="left:105px;top:400px;width:790px;gap:37px">
      <div class="col" style="width:100%;align-items:flex-start"><h2 class="hd h72" style="width:100%">family activity</h2><h2 class="hd h96" style="width:100%">Name the animals!</h2></div>
      <p class="bd b30" style="width:100%">Use your imagination and creativity in a fantastic Animal Name-a-palooza, invent and name the animals of the world<br>Fun for the whole family!</p>
    </div>'''
    return section('day5','5',[SKY,NIGHT,GROUND,sea_d5(),CLOUDS_D4,BIRDS,hands,'<div class="darkener"></div>',text]+animals((1873,1816,2066,2103),(4484,4427,4677,4714)))

def day6():
    hands = group('bighands', [img('bh hand-man','shared/hand-man',-307,837,865,669), img('bh hand-god','shared/hand-god',1185,-285,873,698)])
    text = f'''<div class="col day6-text"{tr("64,1388","64,2827")} style="left:64px;top:540px;width:1600px;gap:49px">
      <div class="col" style="width:100%;gap:21px"><h2 class="hd h96" style="width:100%">“first-man” sculpting competition</h2><h2 class="hd h72" style="width:100%">Design the first human!</h2></div>
      <p class="bd b30" style="width:1056px">Imagine a world where your creative vision shapes humanity’s origins, this competition allows you to become the creator - and see your creations come to life in a fantastical, divine way!</p>
    </div>'''
    adams = f'''<div class="row adams cutout"{tr("444.5,1322","444.5,2761")} style="left:444.5px;top:301px;gap:105px">
      <img src="assets/img/day6/adam-bald.webp" alt="" style="width:173px;height:222px;object-fit:contain">
      <img src="assets/img/day6/adam-weird.webp" alt="" style="width:243px;height:222px;object-fit:contain">
      <img src="assets/img/day6/adam-bully.webp" alt="" style="width:212px;height:218px;object-fit:contain;transform:scaleX(-1)">
    </div>'''
    return section('day6','6',[SKY,NIGHT,GROUND,sea_d5(),CLOUDS_D4,BIRDS,hands,'<div class="darkener"></div>',text,adams])

def section(slug, day, parts):
    return f'<section class="fold fold--{slug}" id="fold-{slug}" data-day="{day}">\n  <div class="stage">\n    ' + '\n    '.join(parts) + '\n  </div>\n</section>'


def shabbat():
    hands = group('bighands', [img('bh hand-man','shared/hand-man',-52,519,865,669), img('bh hand-god','shared/hand-god',893,-48,873,698)])
    title = f'<h2 class="hd h128 day7-title"{tr("64,-255","64,-1051")} style="left:64px;top:229px;width:1600px">netflix and chill<br>at god’s house</h2>'
    para = f'<p class="bd b30 day7-para"{tr("335,1117","335,1964")} style="left:335px;top:796px;width:1060px">This day is not just a break. It is a holy celebration. It is a time to remember that life is a gift, and that love is ever-present, surrounding you with warmth, grace, and joy. The Sabbath is an invitation to celebrate life itself - with rest, with gratitude, and with peace.</p>'
    return section('shabbat','7',[SKY,NIGHT,GROUND,sea_d5(),CLOUDS_D4,BIRDS,hands,'<div class="darkener"></div>',title,para])

def footer():
    hands = group('bighands', [img('bh hand-man','shared/hand-man',-1,446,865,669), img('bh hand-god','shared/hand-god',855,0,873,698)])
    ticket = f'<a class="ticket" href="#"{tr("696,-147","")} style="left:696px;top:267px;width:316px;height:99px"><img src="assets/img/shared/ticket.webp" alt="Tickets" style="position:static;width:100%;height:100%"></a>'
    logo = f'''<div class="logo"{tr("785,-152","")} style="left:785px;top:73px;width:158px">
      <img src="assets/img/shared/logo-god.webp" alt="Jehova Events" style="position:static;width:158px;height:104px;object-fit:contain">
      <p class="logo__word">jehova events</p>
    </div>'''
    learn = f'''<div class="col footer-learn"{tr("199,1381","")} style="left:199px;top:842px;width:385px;gap:14px">
      <a class="hd h60 aura-body" href="#fold-about" style="width:100%">learn more</a>
      <div class="col" style="width:100%;gap:8px"><p class="hd h36x aura-body" style="width:100%">faq</p><p class="hd h36x aura-body" style="width:100%">about god</p><p class="hd h36x aura-body" style="width:100%">community</p></div>
    </div>'''
    contact = f'''<div class="col footer-contact"{tr("1144,1381","")} style="left:1144px;top:842px;width:385px;gap:28px">
      <p class="hd h60 aura-body" style="width:100%">contact</p>
      <p class="hd h36x aura-body" style="width:100%;white-space:normal">just think about it, god will hear you</p>
    </div>'''
    big = f'<h2 class="h192 footer-title"{tr("334,1067","")} style="left:334px;top:405px;width:1060px">let there be<br>light</h2>'
    return section('footer','contact',[SKY,NIGHT,GROUND,sea_d5(),CLOUDS_D4,BIRDS,hands,'<div class="darkener darkener--25"></div>',ticket,logo,learn,contact,big])

if __name__ == '__main__':
    print({'day2':day2,'day3':day3,'day4':day4,'day5':day5,'day6':day6,'shabbat':shabbat,'footer':footer}[sys.argv[1]]())
