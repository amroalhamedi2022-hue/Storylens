#!/usr/bin/env python3
"""One-time original 1873 Towle-era plate intake, never called by Android.
Verify Wikicommons original SHA-1 before reversible archival conversion.
"""
import hashlib, io, json, pathlib, urllib.request
from PIL import Image, ImageOps
OUT=pathlib.Path('/tmp/lt-verified-1873-third')
OUT.mkdir(parents=True,exist_ok=True)
ITEMS=[
 {"id":"verne-1873-calcutta-court","file":"verne-calcutta-court-1873.webp",
  "url":"https://upload.wikimedia.org/wikipedia/commons/7/79/Around_the_world_in_eighty_days_%281873%29_%2814781888384%29.jpg",
  "commons":"https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14781888384).jpg",
  "expected_sha1":"c4fffab7167cda36e68f5e505578f90829b204d0",
  "year":1873,"chapter":14,"afterParagraph":19,
  "scene":"Calcutta courtroom: Passepartout's abandoned shoes are presented as evidence, Towle XV"},
 {"id":"verne-1873-singapore-carriage","file":"verne-singapore-carriage-1873.webp",
  "url":"https://upload.wikimedia.org/wikipedia/commons/e/e7/Around_the_world_in_eighty_days_%281873%29_%2814804101583%29.jpg",
  "commons":"https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14804101583).jpg",
  "expected_sha1":"3a7368c6cdd1a021493effb5a00f603abff6fe22",
  "year":1873,"chapter":16,"afterParagraph":7,
  "scene":"Fogg and Aouda ride a horse-drawn carriage among tropical plants at Singapore, Towle XVII"}
]
out=[]
for item in ITEMS:
 req=urllib.request.Request(item['url'],headers={'User-Agent':'LinguaTalesHistoricArchive/2.0 (https://github.com/amroalhamedi2022-hue/Storylens; provenance audit)'})
 with urllib.request.urlopen(req,timeout=45) as response:
  original=response.read(6500000)
 assert hashlib.sha1(original).hexdigest()==item['expected_sha1'],'Commons original mismatch: '+item['id']
 image=ImageOps.exif_transpose(Image.open(io.BytesIO(original))).convert('RGB')
 assert image.width>1000 and image.height>1000,'unexpected small scanned image'
 if image.width>620:image=image.resize((620,round(image.height*620/image.width)),Image.Resampling.LANCZOS)
 target=OUT/item['file']
 image.save(target,format='WEBP',quality=63,method=6)
 encoded=target.read_bytes()
 assert encoded[:4]==b'RIFF' and encoded[8:12]==b'WEBP','offline WebP invalid'
 assert len(encoded)<270000,'compressed image exceeds phone size cap'
 manifest={k:v for k,v in item.items() if k not in ('url',)}
 manifest.update({'url':item['url'],'source_sha256':hashlib.sha256(original).hexdigest(),
   'webp_sha256':hashlib.sha256(encoded).hexdigest(),'webp_bytes':len(encoded),
   'width':image.width,'height':image.height,
   'rights':"1873 Boston print; Commons: no known copyright restrictions (territorial clearance pending)"})
 out.append(manifest)
 print('VERIFIED',item['id'],image.size,len(encoded),flush=True)
(OUT/'manifest.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS two source-matched nineteenth-century engravings',flush=True)
