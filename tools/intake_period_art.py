#!/usr/bin/env python3
"""Reproducible intake of historic (not AI-generated) Jules Verne illustrations.
Run in GitHub Actions with outbound archive access; never called at Android runtime.
Only individually authenticated Wikimedia Public Domain Mark scans are accepted.
"""
import hashlib
import io
import json
import os
import pathlib
import urllib.request
from PIL import Image, ImageOps

OUT=pathlib.Path(os.environ.get("LT_ART_OUT","/tmp/lt-historic-intake"))
OUT.mkdir(parents=True,exist_ok=True)
ITEMS=[
 {
 "id":"verne-1873-kiouni",
 "file":"verne-kiouni-1873.webp",
 "url":"https://upload.wikimedia.org/wikipedia/commons/1/1c/Around_the_world_in_eighty_days_%281873%29_%2814781095701%29.jpg",
 "commons":"https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14781095701).jpg",
 "expected_sha1":"3e6023d89833734936fd68b8163f5b13252a1339",
 "year":1873,"max_width":720,
 "scene":"Phileas Fogg and Passepartout meet Kiouni, the elephant, chapter XI",
 "chapter":10
 },
 {
 "id":"verne-1872-itinerary",
 "file":"verne-route-map-1872.webp",
 "url":"https://upload.wikimedia.org/wikipedia/commons/d/d7/%27Around_the_World_in_Eighty_Days%27_by_Neuville_and_Benett_01.jpg",
 "commons":"https://commons.wikimedia.org/wiki/File:%27Around_the_World_in_Eighty_Days%27_by_Neuville_and_Benett_01.jpg",
 "expected_sha1":"4dad34a533511ec83929a2a973cfc844a141177a",
 "year":1872,"max_width":880,
 "scene":"Original printed route map for the journey timetable, chapter III",
 "chapter":2
 },
 {
 "id":"verne-1872-tankadere",
 "file":"verne-tankadere-1872.webp",
 "url":"https://upload.wikimedia.org/wikipedia/commons/c/cb/%27Around_the_World_in_Eighty_Days%27_by_Neuville_and_Benett_34.jpg",
 "commons":"https://commons.wikimedia.org/wiki/File:%27Around_the_World_in_Eighty_Days%27_by_Neuville_and_Benett_34.jpg",
 "expected_sha1":"6cede9030b81f8312ace0da3aa3cfda0482328d4",
 "year":1872,"max_width":720,
 "scene":"The small sailing ship Tankadere battles high waves, chapter XXI",
 "chapter":20
 }
]
manifest=[]
for item in ITEMS:
  req=urllib.request.Request(item["url"],headers={"User-Agent":"LinguaTalesLiteraryArchive/1.0 (https://github.com/amroalhamedi2022-hue/Storylens; public-domain-scans)"})
  with urllib.request.urlopen(req,timeout=45) as response: raw=response.read(8_000_000)
  sha1=hashlib.sha1(raw).hexdigest()
  if sha1!=item["expected_sha1"]:
    raise RuntimeError(f"Historic scan hash mismatch: {item['id']} {sha1}")
  original=Image.open(io.BytesIO(raw))
  original=ImageOps.exif_transpose(original)
  if original.width<300 or original.height<300:raise RuntimeError(f"Scan too small: {item['id']}")
  original=original.convert("RGB")
  if original.width>item["max_width"]:
    height=round(original.height*item["max_width"]/original.width)
    original=original.resize((item["max_width"],height),Image.Resampling.LANCZOS)
  dest=OUT/item["file"]
  original.save(dest,format="WEBP",quality=82,method=6)
  contents=dest.read_bytes()
  if not(contents.startswith(b"RIFF") and b"WEBP" in contents[:16]) or len(contents)>270000:
    raise RuntimeError(f"Invalid or oversized WebP {dest}: {len(contents)}")
  record={k:v for k,v in item.items() if k!="max_width"}
  record.update({"source_sha256":hashlib.sha256(raw).hexdigest(),"webp_sha256":hashlib.sha256(contents).hexdigest(),
    "webp_bytes":len(contents),"width":original.width,"height":original.height,"rights":"Wikimedia Commons Public Domain Mark 1.0; per-file scan, verify territorial use"})
  manifest.append(record)
  print("PERIOD ART OK",item["id"],len(contents),str(original.size),flush=True)
(OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("ALL THREE historic illustrations verified, optimized and ready for offline packaging",flush=True)
