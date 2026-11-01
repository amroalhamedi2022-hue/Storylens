#!/usr/bin/env python3
"""Fetch only individually checked historic images, verify Commons SHA-1 and
produce bounded local WebP for offline Lingua Tales; not used at runtime.
This one-time archival job does not amend story text or grant release rights.
"""
import hashlib, io, json, pathlib, urllib.request
from PIL import Image, ImageOps

OUT=pathlib.Path("/tmp/lt-verne-extra-intake")
OUT.mkdir(parents=True,exist_ok=True)
ITEMS=[
 {"id":"verne-1873-readers","file":"verne-news-readers-1873.webp",
  "url":"https://upload.wikimedia.org/wikipedia/commons/2/29/Around_the_world_in_eighty_days_%281873%29_%2814781086251%29.jpg",
  "commons":"https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14781086251).jpg",
  "expected_sha1":"06e996151ae69a80a4e8d61ec5427c220199dc7b",
  "year":1873,"chapter":4,"afterParagraph":1,"max_width":620,
  "scene":"London readers follow reports of Phileas Fogg's wager; Towle V, paragraph 2"},
 {"id":"verne-1873-tankadere-cabin","file":"verne-tankadere-cabin-1873.webp",
  "url":"https://upload.wikimedia.org/wikipedia/commons/2/27/Around_the_world_in_eighty_days_%281873%29_%2814597542130%29.jpg",
  "commons":"https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14597542130).jpg",
  "expected_sha1":"29162c6b1037af214d1cba85f7939365d60d3259",
  "year":1873,"chapter":19,"afterParagraph":66,"max_width":620,
  "scene":"Fogg and Aouda meet Fix in the Tankadere cabin; Towle XX, paragraph 67"}
]
rows=[]
for item in ITEMS:
 req=urllib.request.Request(item["url"],headers={"User-Agent":"LinguaTalesHistoricArchive/2.0 (https://github.com/amroalhamedi2022-hue/Storylens; authenticity-check)"})
 with urllib.request.urlopen(req,timeout=40) as res:raw=res.read(7_000_000)
 assert hashlib.sha1(raw).hexdigest()==item["expected_sha1"],"Archive source changed: "+item["id"]
 im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
 assert im.width>400 and im.height>400,"Source too small"
 im=im.convert("RGB")
 if im.width>item["max_width"]:
  im=im.resize((item["max_width"],round(im.height*item["max_width"]/im.width)),Image.Resampling.LANCZOS)
 target=OUT/item["file"]
 im.save(target,format="WEBP",quality=62,method=6)
 packed=target.read_bytes()
 assert packed[:4]==b"RIFF" and packed[8:12]==b"WEBP","WEBP packing failed"
 assert len(packed)<270000,"WebP too big: "+item["file"]+" "+str(len(packed))
 row={k:v for k,v in item.items() if k!="max_width"}
 row.update({"source_sha256":hashlib.sha256(raw).hexdigest(),"webp_sha256":hashlib.sha256(packed).hexdigest(),"webp_bytes":len(packed),"width":im.width,"height":im.height,"rights":"1873 Boston original; Wikimedia Commons reviewed 'No known copyright restrictions'; territorial review pending"})
 rows.append(row)
 print("ARCHIVAL SCAN VERIFIED",item["file"],len(raw),len(packed),im.size,flush=True)
(OUT/"new_manifest.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("PASS: two original historic scans verified for source alignment, ready for PR-stage import",flush=True)
