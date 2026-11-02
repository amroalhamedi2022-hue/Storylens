#!/usr/bin/env python3
"""Create truthful on-disk review pages for the TWO staged historical colour folios.

Never changes the installed app, publishes a fake English translation or
copies unfinished Kalila into Android APK. Chromium phone screenshots of
these pages are QA artifacts for the user's aesthetic approval only.
"""
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/literature/staging/kalila-arabic-wikisource"
OUT = ROOT / "qa-screenshots"
FOLIOS = json.loads((BASE/"COLOR_FOLIOS.json").read_text(encoding="utf-8"))["images"]
ORIGINAL = (BASE/"kalila.md").read_text(encoding="utf-8")
OUT.mkdir(parents=True,exist_ok=True)
KEYS = {453083:"fox",453084:"lion"}
assert len(FOLIOS)==2

for item in FOLIOS:
    name=KEYS[item["objectID"]]
    spot=ORIGINAL.find(item["sourceTextAnchor"])
    assert spot>=0 and ORIGINAL.count(item["sourceTextAnchor"])==1
    paragraph_end=ORIGINAL.find("\n\n",spot)
    remaining=ORIGINAL[spot:min(spot+360,paragraph_end if paragraph_end!=-1 else len(ORIGINAL))]
    # Excerpt is directly copied from the full original Arabic text;
    # never invent translated prose or present a different recension as facsimile.
    clip=remaining.rfind(" ",145,310)
    excerpt=remaining[:(clip if clip>0 else 280)]+"…"
    imagepath=BASE/"art"/item["file"]
    data=imagepath.read_bytes()
    assert hashlib.sha256(data).hexdigest()==item["webpSha256"]
    image_href="../docs/literature/staging/kalila-arabic-wikisource/art/"+item["file"]
    content=f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>معاينة مخطوطة ملونة — {html.escape(item['titleAr'])}</title>
<link rel="stylesheet" href="../app/src/main/assets/lt-device-acceptance.css">
<style>
:root{{--reader:#f9f6ee;--reader-ink:#2c291f;--card:#fff}}
html,body{{margin:0;padding:0;min-height:100%;background:#f5f1e8;color:#27251f}}
body{{font-family:"Noto Naskh Arabic","Amiri",serif}}
.preview{{max-width:680px;margin:0 auto;padding:16px 18px 26px}}
.preview .eyebrow{{font:700 11px/1.6 system-ui,sans-serif;color:#6d6557;letter-spacing:.03em}}
.preview h1{{font:700 clamp(24px,5vw,35px)/1.45 "Noto Naskh Arabic",serif;
 margin:6px 0 10px;text-align:right}}
.preview .notice{{font:400 12px/1.7 system-ui,sans-serif;color:#635a4c;
 padding:8px 10px;background:#eee6d6;border-radius:7px;margin:0 0 12px}}
.preview .reader{{color:#28241b;background:transparent;display:block}}
.preview .original{{font:400 clamp(17px,4vw,21px)/1.8 "Noto Naskh Arabic",serif;
 margin:0 0 10px;text-align:justify}}
.preview figure{{width:min(100%,430px);margin:10px auto 14px!important}}
.preview figure img{{display:block;width:100%!important;height:auto;max-height:calc(100dvh - 370px);
 object-fit:contain!important;border-radius:2px;filter:none!important}}
.preview figcaption{{font:400 12px/1.5 system-ui,sans-serif!important;
 padding:7px 3px!important;text-align:right}}
.preview .credits{{font:400 11px/1.5 system-ui,sans-serif;color:#685d52}}
</style>
</head>
<body><main class="preview">
<div class="eyebrow">LINGUA TALES · معاينة بصرية لأرشيف مخطوطات تاريخية</div>
<h1>{html.escape(item['titleAr'])}</h1>
<p class="notice">هذه معاينة قبل النشر، وليست صفحة كتاب مكتمل أو ترجمة إنجليزية معتمدة.
 الصورة من مخطوطة تاريخية أخرى تتوافق مع الحدث، وليست من نسختنا النصية نفسها.</p>
<article class="reader">
<p class="original" lang="ar">{html.escape(excerpt)}</p>
<figure class="lt-inline-illustration lt-archive-colour-original">
<img id="folio" src="{html.escape(image_href)}"
 alt="{html.escape(item['altAr'])}" width="{item['width']}" height="{item['height']}">
<figcaption>{html.escape(item['titleAr'])} · القرن السادس عشر ·
 متحف المتروبوليتان · {html.escape(item['accession'])}</figcaption>
</figure>
</article>
<div class="credits">الصورة الأصلية محفوظة بألوانها دون قص أو تلوين حديث ·
 Metropolitan Museum of Art · Public Domain</div>
</main>
<script>
window.addEventListener('load',()=>{{
 const img=document.getElementById('folio');
 const computed=getComputedStyle(img);
 const ok=img.complete&&img.naturalWidth==={item['width']}&&
  img.naturalHeight==={item['height']}&&
  computed.objectFit==='contain'&&computed.filter==='none'&&
  document.querySelector('figure').classList.contains('lt-archive-colour-original');
 document.body.setAttribute('data-lt-colour-qa',ok?'PASS':'FAIL');
}});
</script>
</body></html>"""
    target=OUT/f"kalila-colour-{name}.html"
    target.write_text(content,encoding="utf-8")
    print("STAGED original colour preview only:",target,flush=True)
