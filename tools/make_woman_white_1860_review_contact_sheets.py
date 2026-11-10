#!/usr/bin/env python3
"""Generate visually reviewable contact sheets from real 1860 Harper scan crops.

Contact sheets are diagnostic review aids, NOT additional source pictures,
not published to the app, and never included in historic art inventory.
"""
from __future__ import annotations
import argparse
from hashlib import sha256
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT=Path(__file__).resolve().parents[1]
FOLDER=ROOT/"docs/literature/staging/woman-white-mclenan-1860-original-scan"
MANIFEST=FOLDER/"manifest.json"
CONTACT=FOLDER/"visual-review-only"
COLUMNS=4
ITEMS_PER_SHEET=16
CELL_W=250
CELL_H=315

def generate()->list[str]:
    manifest=json.loads(MANIFEST.read_text("utf-8"))
    if manifest.get("publicationApproved") is not False:
        raise ValueError("Visually unreviewed historical source claims publication approval")
    CONTACT.mkdir(parents=True,exist_ok=True)
    files=[]
    rows=sorted(manifest["images"],key=lambda x:(x["sourcePageZeroBased"],x["localPath"]))
    for start in range(0,len(rows),ITEMS_PER_SHEET):
        current=rows[start:start+ITEMS_PER_SHEET]
        board=Image.new("RGB",(COLUMNS*CELL_W,4*CELL_H),(247,245,239))
        d=ImageDraw.Draw(board)
        for n,row in enumerate(current):
            path=(FOLDER/row["localPath"]).resolve()
            if not path.is_relative_to(FOLDER.resolve()):
                raise ValueError("Historical image outside original source directory")
            payload=path.read_bytes()
            if sha256(payload).hexdigest()!=row["webpSha256"]:
                raise ValueError("Source crop SHA tampering: "+row["localPath"])
            im=Image.open(path).convert("RGB")
            im.thumbnail((CELL_W-12,CELL_H-54),Image.Resampling.LANCZOS)
            left=(n%COLUMNS)*CELL_W+(CELL_W-im.width)//2
            top=(n//COLUMNS)*CELL_H+10
            board.paste(im,(left,top))
            bx=(n%COLUMNS)*CELL_W
            by=(n//COLUMNS)*CELL_H
            # The short hash is displayed for curation of exactly one binary.
            d.text((bx+12,by+CELL_H-44),
                   "PDF page "+str(row["sourcePageOneBased"])+" | "+row["webpSha256"][:10],
                   fill=(35,35,35))
            d.text((bx+12,by+CELL_H-25),
                   "SOURCE CROP ONLY - NOT APPROVED",fill=(105,80,65))
        name=f"contact-{start//ITEMS_PER_SHEET+1:03d}.webp"
        path=CONTACT/name
        board.save(path,"WEBP",quality=86,method=5)
        files.append(str(path.relative_to(ROOT)))
    allowed={Path(p).name for p in files}
    for old in CONTACT.glob("contact-*.webp"):
        if old.name not in allowed:
            old.unlink()
    note={"schemaVersion":1,"originVerifiedPDFSHA256":manifest.get("sourcePDFSHA256"),
          "historicalArtworkApproval":False,
          "sourceArtworkCountBeforeHumanVisualCuration":len(rows),
          "sheets":files,
          "neverCountTheseFilesAsHistoricalArt":True}
    (CONTACT/"contact-sheets-index.json").write_text(json.dumps(note,indent=2)+"\n","utf-8")
    print("PASS visual contact sheets",len(files),"real source image regions",len(rows),flush=True)
    return files

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.parse_args()
    generate()
