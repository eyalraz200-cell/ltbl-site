# Figma geometry (1728x1117 stage; calc() resolved: 8.33%=144 16.67%=288 25%=432 33.33%=576 41.67%=720 50%=864 58.33%=1008 66.67%=1152 75%=1296 79.17%=1368 83.33%=1440 91.67%=1584 100%=1728; 50% of H=558.5)
Every fold frame has a full-frame image fill 41a7e.png (grey noise texture, assets/_raw/hero/frame-fill.png) under everything; then רקע groups, then תוכן groups, then סקרולר nav. Darkener rgba(0,0,0,.4) sits on top of רקע (footer: .25).
Text/cutout shadows: cutouts shadow 10px -11px 4px black (poseidon/zeus), 2px -11px 4px (satan, gabriel, god-portrait, guys, fox), -9px -11px 4px (jesus), -8px -11px 4px (girls), 4px -10px 4px (lion), -7px -11px 4px (orangutan), -6px -8px 4px (ostrich). adams: no shadow in Figma (12649:843); site adds 2px -11px 4px at Eyal's request, 2026-10-01.
Fonts: heading/192,128,96,72,60,48,36 (RFC, lh .8); body/36,30,24 (Abyssinica, lh 1.6). Captions under cutouts body/24.

## HERO 12649:1019 (rest = סרטון 5)
clouds group "רקע עננים" (overflow clip, 0,0): sky-rect "שמיים רקע 1" 0,5 1728x1117 (no image → gradient, sample from סרטון 4)
 front-left 347,88 616x309 | bl-back -128,625 890x446 | br-back 1140,627 890x446 | br-front 654,695 2428x569 | bl-front -64,679 964x528 | tiny 854,114 255x175 | left-back -60,119 509x251 | left-far -165,-115 701x395 | top-big -122,-102 1990x466 | small-right 968,190 446x131 | tr-front 1177,5 831x455
content: sub b36 left 50% (translate -50%) top 592 w1060 | title-1 "let there be" h192 top 228 w1060 centered | title-2 "light" top 383 | logo 785,87 w158: img 158x104 (object-contain) + wordmark 35px gap 8 | hands+ticket group 398,751 926.569x241.848 (ticket inset 47.55% 32.81% 11.51% 33.09% → ticket at group x 33.09%*926.569=306.6 → 704.6, y 47.55%*241.848=115 → 866, w 316 h 99; right hand inset 0 0.05% 11.77% 70.65% → box 654.6..926.1 x 0..213.4, rotated -30; left hand inset 29.36% 70.37% 0 0 → box 0..274.6 x 71..241.8, scaleX(-1) rotate 17.53)
 About fold's own hands (12649:423 group, frame coords): ticket 2599-1894=705, 1663+771=2434 (i.e. 1117+1317 below) 316x99 ; right hand box left 5241-1894=3347 top 771 271.569x213.37 rot -30 ; left hand box left -1894 top 793 274.582x170.848 scaleY(-1) rot -162.47
about-peek in hero frame: "about the / festival" h192 nowrap centered at x 864.5, top 1117 ; paragraph b36 w1134 centered x 865, top 1465

## ABOUT 12649:394
sea group "רקע ים" (0,0, with 1px black border): sea-5 -1,1450 863x482 | sea-4 -1,1395 982x390 | sea-2 -1,1173 1112x222 | sea-3 810,1395 917x406 | sea-1 484,1145 1243x305  (all BELOW frame = day2's sea seen from above; day2 shows them at y-816)
clouds group identical to hero (same positions) + darkener.
content about: title "about the / festival" h192 nowrap centered x 864.5 top 170 ; paragraph b36 w1134 centered x 864 top 644
parked hero content: sub top -1127; title-1 top -1699; title-2 left calc(54.17%-58px)=878 top -1402; logo 785,-1873; hands/ticket group (see hero)
parked day2 content ("תוכן יום 2" centered group = 0,0): poseidon box 343,1095 728.443x650.596 scaleY(-1) rot -162.06, inner 608x487 (object-contain) | zeus box -584,-291 559.068x660.44 rot 11.35 inner 453.279x582.634 | day2 text block 1753,324 w922 flex col gap 53 centered: h72 2 lines "Battle of the giants / Poseidon vs. The Almighty!" ; h36(RFC) "Ocean's Wrath vs. Divine Power!" w730 ; b30 w730 h274 "Get ready for the ultimate showdown! On 02.01.0001, witness an incredible battle as Poseidon, the God of the Sea, takes on the Almighty in a mythical contest of strength, will, and supremacy."

## DAY2 12649:438 (Battle of the giants)
רקע is 1737x1908 at 0,0: ground group at 9,791 (clip) → ground pieces (frame coords = +9,+791): mountain-2 900,911 609x174 | ground-8 1377,496 351x388 | mountain-1 0,806 945x316 | ground-5 539,555 461x396 | ground-4 0,470 747x494 | ground-6 880,555 459x399 | ground-3 721,388 777x356 | ground-7 1353,401 375x399 | ground-1 565,423 435x312 | ground-2 0,401 726x512  (group-local; whole ground group offset 9,791 → mostly below frame = day3 ground)
sea group centered at 864-4.5=859.5, 558.5-395.5=163 → group origin (859.5-864, 163-558.5) = (-4.5,-395.5): sea-5 -1,579 | sea-4 -1,685 | sea-2 -1,894 | sea-3 810,608 | sea-1 484,811 (group-local; add -4.5,-395.5 → sea-5 -5.5,183.5 ; sea-4 -5.5,289.5 ; sea-2 -5.5,498.5 ; sea-3 805.5,212.5 ; sea-1 479.5,415.5)
clouds group same origin (-4.5,-395.5): front-left 347,88 | bl-back -950,404 | br-back 1975,568 | br-front 1785,1014 | bl-front -1092,953 | tiny 854,114 | left-back -60,119 | left-far -165,-115 | top-big -122,-102 | small-right 968,190 | tr-front 1177,5 (group-local; add offset)
darkener same offset.
content day2 (group 0,0): text 741,324 w922 (as above) | poseidon box 201,430 728.443x650.596 rot -162.06 then scaleY(-1) (CSS order: rotate(-162.06deg) scaleY(-1) — the other order leans him 36° the wrong way) | zeus box 0,103 559.068x660.44 rot 11.35
parked about: title top 3598, para top 3946
parked day3 content (group 0,0): satan col 90,1194 w265 (img 265x262 contain, caption "Satan") | jesus col 329,1468 w225 gap 9 (img 225x212 cover, scaleY(-1) rot 180, caption "Jesus") | gabriel col 500,1191 w317 gap 18 (img 317x202 cover, caption "Gabriel") | god text 874,-211 w790 items-end gap 24: h48 "“one on one” meetings with yaweh" + b24 2 lines "A once-in-a-lifetime opportunity to learn from a mind like no other, / where you can understand important insights and maybe get the inside scoop" | god-portrait centered at 1265, -227 → box 1094,-419 342x384 (inner img 127.23% w, 113.54% h, left -12.59%, top -5.73%) | celeb text 64,1182: h48 w790 "celebrities meet and greet" + b24 w790 "Get a chance to meet your favorite celebrities, with Autograph Stations, Photo Opportunities, and Live Q&A Sessions" gap 24

## DAY3 12649:499 (celebrities / one on one)
night group (0,0): night-2 1753,411 798x366 | night-4 1827,0 930x745 | night-3 2023,0 874x903 | night-1 2337,0 651x568 | moon 2517,-742 146x177
ground group (centered → 0,0, clip): mountain-2 900,506 | ground-8 1377,496 | mountain-1 0,401 | ground-5 539,555 | ground-4 0,470 | ground-6 880,555 | ground-3 721,557 | ground-7 1353,591 | ground-1 565,576 | ground-2 0,605
sea group (0,0): sea-5 -1,760 | sea-4 -1,773 | sea-2 -15,915 | sea-3 810,807 | sea-1 541,915
clouds (0,0): sky-rect | "ענן אחורה אמצע" 584,135 760x375 (no image, skip) | front-left 347,88 | tiny 854,114 | left-back -60,119 | left-far -165,-115 | sun 0,-259 146x144 | top-big -122,-102 | small-right 968,190 | tr-front 1177,5
darkener.
content day3: celeb text 64,279 | satan 90,474 | jesus 329,748 | gabriel 500,471 | god-portrait center 1265,567 → box 1094,375 | god text 874,829
parked day2: poseidon box 574,2182 | zeus box -1371,-1148 | text 2615,324
parked day4: text col 181,-279 w1365 gap 56 centered: h96 "Be fruitfull and multiply party " + b30 w1060 2 lines "Celebrate from the dusk till dawn in an OFF THE HOOK Mitzvah party / Make your descendants become as numerous as the stars of the sky!" | guys 1782,627 519x270 contain | girls -545,614 520x283 contain

## DAY4 12649:566 (Be fruitfull)
night (0,0): night-2 761,411 | night-4 798,0 | night-3 854,0 | night-1 1077,0 | moon 1424,51
ground (0,0 clip): same as day3 ground
sea (0,0): sea-5 0,760 | whale box 28,891 450.427 sq, inner 344x293 rot 45 | sea-4 -1,787 | sea-2 -15,934 | sea-3 810,787 | fish group box 627,1012 472.413x699.476 rot -107.52, inner 641x293 (fish-1 227,142 103x102 | fish-2 130,132 89x98 | fish-3 404,57 76x39 | fish-4 197,42 69x54 | fish-5 508,51 94x45 | fish-6 102,84 81x81 | fish-7 24,196 88x97 | fish-8 227,58 126x99 | fish-9 382,0 132x66 | fish-10 309,74 120x68 | fish-11 0,164 60x77 | fish-12 283,14 78x50 | fish-13 450,92 75x40 | fish-14 514,98 127x93) | sea-1 541,881
clouds (centered→0,0 clip): front-left 314,-22 | tiny 329,175 | left-back -60,119 | left-far -172,-116 | sun 93,58 | top-big -1133,-356 | small-right 1959,202 | tr-front 1766,5
birds group (0,0): bird-1 -230,291 137x147 | bird-5 -249,83 108x119 | bird-4 -552,337 96x55 | bird-3 -456,143 91x102 | bird-2 -336,291 99x57
darkener.
content day4: text 181,236 w1365 | guys 943,627 519x270 | girls 266,614 520x283
parked day3: satan 90,2729 | jesus 329,3003 | gabriel 500,2726 | god text 938,-1670 | god-portrait center 1329,-1686 → box 1158,-1878 | celeb text 64,2717
parked day5 (group 0,0): text col -849,400 w790 gap 37 centered: headings col (h72 "family activity", h96 "Name the animals!") + b30 2 lines "Use your imagination and creativity in a fantastic Animal Name-a-palooza, invent and name the animals of the world / Fun for the whole family!" | lion col 1873,568 w193 gap 12 (img 193x244 contain scaleY(-1) rot 180, cap "“Lion”") | fox col 1816,244 w202 (img 202x201 contain, "“King Kunta”") | orangutan col 2066,244 w207 (img 191x232 contain, "“Orangutan”") | ostrich col 2103,582 w193 (img 171x211 cover, "“Kalderon”")

## DAY5 12649:664 (Name the animals)
night/ground same as day4. sea (0,0): sea-5 0,760 | whale 164,623 344x293 (no rotation) | sea-4 -1,787 | sea-2 -15,934 | sea-3 810,787 | fish group 984,726 641x293 (no rotation) | sea-1 541,881
clouds same as day4. birds (0,0): bird-1 374,210 186x199 | bird-5 248,49 147x161 | bird-4 49,330 130x74 | bird-3 75,117 124x139 | bird-2 192,263 136x78
hands group (0,0): hand-man -688,1209 865x669 | hand-god 1583,-662 873x698
darkener.
content day5: text 105,400 | lion 1066,568 | fox 1009,244 | orangutan 1342,244 | ostrich 1379,582
parked day4: text 181,-1387 | guys 4018,627 | girls -2453,614
parked day6 (group 0,0): text col centered x864 top 1388 w1600 gap 49: headings gap 21 (h96 "“first-man” sculpting competition", h72 "Design the first human!") + b30 w1056 "Imagine a world where your creative vision shapes humanity’s origins, this competition allows you to become the creator - and see your creations come to life in a fantastical, divine way!" | adams row centered x864 top 1322 gap 105 items-center: bald 173x222 | weird 243x222 | bully 212x218 scaleY(-1) rot 180

## DAY6 12649:759 (first-man)
night/ground/sea/clouds/birds same as day5. hands: hand-man -307,837 | hand-god 1185,-285. darkener.
content day6: text centered x864 top 540 w1600 | adams row centered x863.5 top 301
parked day5: text -2709,400 | lion 4484,568 | fox 4427,244 | orangutan 4677,244 | ostrich 4714,582
parked day7: title h128 w1600 centered x864 top -255 "netflix and chill / at god’s house" | para b30 w1060 centered x 865 top 1117 "This day is not just a break. It is a holy celebration. It is a time to remember that life is a gift, and that love is ever-present, surrounding you with warmth, grace, and joy. The Sabbath is an invitation to celebrate life itself - with rest, with gratitude, and with peace."

## SHABBAT 12649:850 (day 7)
night/ground/sea/clouds/birds same as day5. hands: hand-man -52,519 | hand-god 893,-48. darkener .4
content day7: title top 229 | para top 796
parked day6: text top 2827 | adams top 2761
parked footer (group 0,0): ticket 696,-147 316x99 | logo 785,-152 w158 (img 104 h, mb -28, wordmark) | learn-more col 199,1381 w385 gap 14 (h60 "learn more"; h36 col gap 8: faq / about god / community; aura body) | contact col 1144,1381 w385 gap 28 (h60 "contact"; h36 "just think about it, god will hear you") | big title h192 w1060 centered x864 top 558.5+508.5=1067 "let there be / light"

## FOOTER 12649:939
night/ground/sea/clouds/birds same. hands: hand-man -1,446 | hand-god 855,0. darkener rgba(0,0,0,.25)
content footer: ticket 696,267 | logo 785,73 (gap 8) | learn-more 199,842 | contact 1144,842 | big title top 405 (558.5-153.5) w1060
parked day7: title top -1051 | para top 1964

## NAV סקרולר: w1728 centered, padding 0 199, flex space-between, items 48px RFC lh .8; current has aura body text-shadow, neighbours opacity .5, others opacity 0. Slots: [prev-prev hidden][prev .5][current flex-1 centered][next .5][next-next hidden]

## INTRO (סרטון 1-5). Dark clouds "רקע יום 0" group centered (0,0). Frame fill: step1 white bg (no sky), steps 2-5 sky image.
step1 12649:1136 dark positions: d8 3,0 1721x524 | d10 502,256 1121x523 | d9 520,240 880x615 | d7 0,0 976x1117 | d6 1095,0 633x1034 | d1 0,658 632x459 | d2 0,0 891x358 | d3 934,0 794x478 | d4 551,640 1177x477 | d5 0,175 964x513 ; darkener .4 ; no text (z-order top→bottom listed = d8 first = bottom)
step2 12649:1121: same + title-1 top 228
step3 12649:1105: d8 4,-83 | d10 728,469 | d9 303,377 | d7 -137,51 | d6 1187,0 | d1 -69,709 | d2 0,0 | d3 976,-86 | d4 743,658 | d5 -137,81 ; title-1 + title-2 (383)
step4 12649:1073: light clouds group parked: front-left -59,-500 | bl-back -1003,671 | br-back 1728,448 | br-front 1546,1189 | bl-front -558,1122 | tiny 1291,-454 | left-back -541,-56 | left-far -541,-456 | top-big -59,-500 | small-right 2054,-345 | tr-front 1861,-418 ; dark parked: d8 -675,-544 | d10 1046,1117 | d9 166,1333 | d7 -808,438 | d6 1728,-610 | d1 -446,1117 | d2 -923,-139 | d3 983,-478 | d5 -1223,219 | d4 1701,845 ; titles both ; ticket 705,1135 (below frame) ; left hand box -3101,1372 (far off)
step5 12649:1047: light clouds at hero rest ; titles, sub ; logo 785,-261 (above) ; hands/ticket group -463,710 2535.569x298.848: ticket 705,866 ; right hand box 1801,710 271.569x213.37 rot -30 ; left hand box -463,838 274.582x170.848 scaleY(-1) rot -162.47
hero rest (fold 1): logo 785,87 ; hands in (group 398,751) — so after step 5 the logo drops in and hands fly in.
Hand element: 257x98 img; right: rotate(-30deg); left: scaleY(-1) rotate(-162.47deg) ≡ scaleX(-1) rotate(17.53deg). Box centers: right hand center = box.left+135.8, box.top+106.7 ; left hand center = box.left+137.3, box.top+85.4. Hero rest: right box = 398+654.6=1052.6, 751 → center 1188.4, 857.7 ; left box = 398, 751+71=822 → center 535.3, 907.4
