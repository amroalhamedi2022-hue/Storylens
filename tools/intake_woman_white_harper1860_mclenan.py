#!/usr/bin/env python3
"""Archive genuine 1860 John McLenan illustrations FROM THE FIRST US BOOK SCAN.

IMPORTANT distinction: extracted patches are exact, unchanged *scan pixels*
from public-domain Harper & Brothers original book, not AI art, but numerical
image-region detection alone cannot certify that each patch is an illustration
rather than print text or damaged halftones. Visual inspection and caption/scene
matching are a separate necessary gate. Do not promote these to reader cards.

Wikimedia Commons source:
File:The woman in white. A novel .. (IA womaninwhitenove00collrich).pdf
Original 1860 Harper & Brothers volume, illustrated by John McLenan, IA scan
University of California Berkeley (Bancroft Library), 278 PDF pages.
See https://commons.wikimedia.org/wiki/Category:The_Woman_in_White
"""
from __future__ import annotations

import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path
import re
import sys
import time
from urllib.parse import urlparse

import cv2
import fitz
import numpy as np
from PIL import Image
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/literature/staging/woman-white-mclenan-1860-original-scan"
ART = DEST / "scan-art-crops"
MANIFEST = DEST / "manifest.json"
TITLE = "File:The woman in white. A novel .. (IA womaninwhitenove00collrich).pdf"
PDF_URL = ("https://upload.wikimedia.org/wikipedia/commons/a/a3/"
           "The_woman_in_white._A_novel_.._%28IA_womaninwhitenove00collrich%29.pdf")
COMMONS_PAGE = "https://commons.wikimedia.org/wiki/" + TITLE.replace(" ", "_")
API = "https://commons.wikimedia.org/w/api.php"
SOURCE_IA = "https://archive.org/details/womaninwhitenove00collrich"
ORIGINAL_ARTIST = "John McLenan (illustrator, 1860)"
PUBLISHER = "Harper & Brothers, New York, 1860"
SOURCE_EDITION = "The Woman in White, 1860 first illustrated American edition, Harper & Brothers"
MAX_BYTES = 40_000_000
MAX_CROP_BYTES = 260_000
MIN_WIDTH = 84
MIN_HEIGHT = 78
EXPECTED_PAGES = 278
# Three actual rendered source patches were personally visually checked and
# found to be ONLY historical typeset prose, not McLenan artwork.
REJECTED_PROSE_CROP_SHA256 = {
    'd51d7dcd1bb0955b30f545b4e4c1c950f54b62b2313be9b528a1bac6393728ea',
    '5845b35b9fe98446428aa36f41f87dbe32ad808fbd222fa7daaebfdeb45861fc',
    'd925646661906d327231bd96793168af08fa8a68fd1245f132f47a18f2983edd',
}

def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()

def session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": "LinguaTalesPublicDomainMcLenan1860Archive/1.0 (https://github.com/amroalhamedi2022-hue/Storylens)",
                      "Accept": "application/pdf,application/json"})
    s.mount("https://", HTTPAdapter(max_retries=Retry(total=3, backoff_factor=1.4,
              status_forcelist=[429,500,502,503,504], respect_retry_after_header=True)))
    return s

def validate_source_metadata(record: dict) -> dict:
    pages = record.get("query", {}).get("pages", [])
    if len(pages) != 1 or pages[0].get("title") != TITLE:
        raise ValueError("Historical 1860 Commons source title mismatch")
    info = pages[0].get("imageinfo", [])
    if len(info) != 1:
        raise ValueError("Commons historical PDF metadata missing")
    a = info[0]
    if a.get("mime") != "application/pdf":
        raise ValueError("Commons archive is not original 1860 printed scan PDF")
    if not re.fullmatch("[a-f0-9]{40}", a.get("sha1", "")):
        raise ValueError("Missing independently registered Commons PDF SHA1")
    if not 1_000_000 < a.get("size",0) < MAX_BYTES:
        raise ValueError("Unexpected historical 1860 volume scan size")
    original_url = a.get("url", "")
    parsed = urlparse(original_url)
    if parsed.scheme != "https" or parsed.hostname != "upload.wikimedia.org":
        raise ValueError("Commons full source URL left controlled HTTPS origin")
    metadata = a.get("extmetadata", {})
    license_text = metadata.get("LicenseShortName", {}).get("value", "")
    if not re.search(r"public\s*domain|^pd(?:-|$)|cc0", license_text, re.IGNORECASE):
        raise ValueError("Historical book page is not individually Commons-public-domain marked")
    if metadata.get("Copyrighted", {}).get("value", "").lower() not in ("", "false", "0"):
        raise ValueError("Commons metadata marks original PDF copyrighted")
    return {"commonsOriginalSHA1": a["sha1"],
            "commonsRegisteredBytes": a["size"],
            "individualCommonsLicense":license_text,
            "originalSourceURL":original_url,
            "commonsFilePage":a.get("descriptionurl", COMMONS_PAGE)}

def get_pdf(s: requests.Session, metadata: dict) -> bytes:
    chunks, total = [],0
    with s.get(metadata["originalSourceURL"],stream=True,timeout=(22,150),allow_redirects=True) as r:
        r.raise_for_status()
        p = urlparse(r.url)
        if p.scheme != "https" or p.hostname != "upload.wikimedia.org":
            raise ValueError("Historical full PDF download redirected outside Commons")
        for chunk in r.iter_content(chunk_size=262144):
            if not chunk: continue
            total+=len(chunk)
            if total > MAX_BYTES:
                raise ValueError("Oversized historical source PDF")
            chunks.append(chunk)
    data=b"".join(chunks)
    if not data.startswith(b"%PDF-") or len(data)!=metadata["commonsRegisteredBytes"]:
        raise ValueError("Original full PDF corrupt or size differs from Commons")
    if hashlib.sha1(data).hexdigest()!=metadata["commonsOriginalSHA1"]:
        raise ValueError("PDF does not match independently pinned Wikimedia original SHA1")
    return data

def detect_original_engraving_regions(gray: np.ndarray, max_per_page: int=3) -> list[tuple[int,int,int,int,float]]:
    """Conservative local engraving texture test, not visual editorial approval.

    High-contrast artwork typically forms connected 130px+ patches with much
    denser crossing strokes than original 19th-century double-column letters.
    Reject global page borders, bleed, any >50% page patch, and tiny noise.
    """
    if gray.dtype!=np.uint8 or gray.ndim!=2 or min(gray.shape)<450:
        raise ValueError("Original scan raster invalid")
    H,W=gray.shape
    low=(gray < 175).astype(np.float32)
    # The print text is thin widely spaced rows, unlike dense engraving hatch.
    smooth=cv2.blur(low,(33,33))
    dense=(smooth>0.098).astype("uint8")*255
    # Closed original texture patches with a minimum genuine illustration area.
    dense=cv2.morphologyEx(dense,cv2.MORPH_CLOSE,np.ones((27,17),np.uint8))
    count,_,stats,_=cv2.connectedComponentsWithStats(dense,connectivity=8)
    boxes=[]
    for x0,y0,bw,bh,area in stats[1:]:
        if int(area)<1000:continue
        x0,y0,bw,bh=map(int,(x0,y0,bw,bh))
        x1,y1=x0+bw,y0+bh
        if bw<MIN_WIDTH or bh<MIN_HEIGHT or bw>W*.57 or bh>H*.64:continue
        if x0<W*.010 or x1>W*.995 or y0<H*.006 or y1>H*.994:continue
        img=gray[y0:y1,x0:x1]
        ink=float((img<175).mean())
        if ink <.095:continue
        # Stroke clusters in genuine lithography/wood engravings; ordinary
        # prose glyphs do NOT have the same large connected hatch structure.
        if bw*bh<8_000:continue
        if engraving_stroke_signature(img)<0.10:continue
        margin_x=max(10,round(.07*bw))
        margin_y=max(10,round(.07*bh))
        x0=max(0,x0-margin_x);x1=min(W,x1+margin_x)
        y0=max(0,y0-margin_y);y1=min(H,y1+margin_y)
        boxes.append((x0,y0,x1,y1,ink))
    boxes.sort(key=lambda b:(-(b[2]-b[0])*(b[3]-b[1]),b[1],b[0]))
    unique=[]
    for b in boxes:
        if any(intersection_over_union(b,c)>.23 for c in unique):continue
        unique.append(b)
    return sorted(unique[:max_per_page],key=lambda b:(b[1],b[0]))

def engraving_stroke_signature(gray: np.ndarray) -> float:
    """Measure larger connected hatch/figure strokes, not typeset glyph rows.

    Prose text appears as many small glyph components in 1860 typeset scans;
    19th-century line drawings include interconnected original engraver strokes.
    This is a *source prefilter*, never legal/editorial image approval.
    """
    ink=(gray<171).astype("uint8")
    total=int(ink.sum())
    if total<300:
        return 0.0
    count,_,stats,_=cv2.connectedComponentsWithStats(ink,connectivity=8)
    qualified=sum(int(area) for x,y,w,h,area in stats[1:]
                  if (int(area)>=45 and int(w)>=12 and int(h)>=12)
                  or (int(area)>=95 and int(w)>=7 and int(h)>=19))
    return round(qualified/total,5)


def intersection_over_union(a,b):
    xa,ya,xb,yb=max(a[0],b[0]),max(a[1],b[1]),min(a[2],b[2]),min(a[3],b[3])
    if xb<=xa or yb<=ya:return 0
    inter=(xb-xa)*(yb-ya)
    area=lambda q:(q[2]-q[0])*(q[3]-q[1])
    return inter/(area(a)+area(b)-inter)

def rendered_page(doc: fitz.Document, pagenum: int) -> tuple[np.ndarray,str]:
    p=doc[pagenum]
    pix=p.get_pixmap(matrix=fitz.Matrix(1.45,1.45),colorspace=fitz.csGRAY,alpha=False)
    a=np.frombuffer(pix.samples,dtype=np.uint8).reshape((pix.height,pix.width))
    if (a.shape[0]<600 or a.shape[1]<400
        or a.shape[0]>3200 or a.shape[1]>2200):
        raise ValueError("Unexpected digitized 1860 source physical page dimensions")
    return a,sha(pix.samples)

def encode_scan_region(gray:np.ndarray, b:tuple[int,int,int,int,float]) -> bytes:
    x0,y0,x1,y1,_=b
    crop=Image.fromarray(gray[y0:y1,x0:x1],"L")
    if crop.width<MIN_WIDTH or crop.height<MIN_HEIGHT:
        raise ValueError("Too-small historical book scan illustration")
    output=BytesIO()
    crop.save(output,"WEBP",quality=88,method=5)
    packed=output.getvalue()
    if (packed[:4]!=b"RIFF" or packed[8:12]!=b"WEBP"
        or len(packed)>MAX_CROP_BYTES):
        raise ValueError("Unexpected extracted book-scan binary encoding")
    return packed

def existing_doc() -> dict:
    if not MANIFEST.is_file():
        return {"schemaVersion":1,
          "sourceWork":"The Woman in White — Wilkie Collins",
          "edition":SOURCE_EDITION,
          "originalIllustrator":ORIGINAL_ARTIST,
          "originalPublisher":PUBLISHER,
          "sourceIA":SOURCE_IA,
          "commonsSource":COMMONS_PAGE,
          "sourceFileTitle":TITLE,
          "sourcePDFYear":1860,
          "imageClassification":"UNREVIEWED_REAL_PRINT_SCAN_TEXTURE_CROPS__NOT_CHAPTER_ILLUSTRATIONS_UNTIL_VISUAL_REVIEW",
          "publicationApproved":False,"chapterSceneMatchingComplete":False,
          "humanVisualReviewComplete":False,
          "rightsStatus":"PER_IMAGE_TERRITORIAL_AND_EDITORIAL_APPROVAL_PENDING",
          "images":[]}
    j=json.loads(MANIFEST.read_text("utf8"))
    if (j.get("sourceFileTitle")!=TITLE or j.get("publicationApproved") is not False
        or j.get("chapterSceneMatchingComplete") is not False
        or j.get("humanVisualReviewComplete") is not False):
        raise ValueError("Wrong publisher source manifest or unauthorized editorial flags")
    if len({x["localPath"] for x in j["images"]})!=len(j["images"]):
        raise ValueError("Original crop archive paths have duplicates")
    before=len(j["images"])
    disqualified=[x for x in j["images"] if x["webpSha256"] in REJECTED_PROSE_CROP_SHA256]
    if disqualified:
        j["images"]=[x for x in j["images"] if x["webpSha256"] not in REJECTED_PROSE_CROP_SHA256]
        for x in disqualified:
            file=DEST/x["localPath"]
            if not file.is_file() or sha(file.read_bytes())!=x["webpSha256"]:
                raise ValueError("Cannot safely prune audited prose image without SHA match")
            file.unlink()
        j.setdefault("visuallyRejectedProseScans",[])
        j["visuallyRejectedProseScans"].extend({
            "sha256":x["webpSha256"],"sourcePageOneBased":x["sourcePageOneBased"],
            "review":"ONLY_TYPESET_PROSE__NOT_AN_ORIGINAL_ENGRAVING"}
            for x in disqualified)
        j["visuallyRejectedProseScans"]=list({
            x["sha256"]:x for x in j["visuallyRejectedProseScans"]}.values())
        write_json(j)
        print(f"DISCARDED {len(disqualified)} visually verified prose-only scan regions; "
              f"no fictitious illustration count",flush=True)
    for x in j["images"]:
        file=DEST/x["localPath"]
        if not file.is_file() or sha(file.read_bytes())!=x["webpSha256"]:
            raise ValueError("Existing historical crop altered or missing "+x["localPath"])
    return j

def write_json(data:dict):
    DEST.mkdir(parents=True,exist_ok=True)
    tmp=MANIFEST.with_suffix(".tmp")
    tmp.write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n","utf8")
    tmp.replace(MANIFEST)

def run(max_new:int=80,start:int=8,stop:int=278)->dict:
    if not 1<=max_new<=150 or not 1<=start<stop<=EXPECTED_PAGES:
        raise ValueError("invalid bounded original page scan limits")
    s=session()
    metadata_response=s.get(API,params={"action":"query","titles":TITLE,
       "prop":"imageinfo","iiprop":"url|size|sha1|mime|extmetadata",
       "format":"json","formatversion":"2"},timeout=(16,40))
    metadata_response.raise_for_status()
    meta=validate_source_metadata(metadata_response.json())
    doc=existing_doc()
    if doc["images"] and doc.get("sourcePDFSHA1")!=meta["commonsOriginalSHA1"]:
        raise ValueError("Current Commons PDF changed since archived crop source")
    data=get_pdf(s,meta)
    source_sha=sha(data)
    pdf=fitz.open(stream=data,filetype="pdf")
    if len(pdf)!=EXPECTED_PAGES:
        raise ValueError("Wrong full first-edition 1860 book scanned page count")
    if doc["images"] and doc.get("sourcePDFSHA256")!=source_sha:
        raise ValueError("Prior scan image provenance cannot be silently replaced")
    doc.update({"sourcePDFSHA1":meta["commonsOriginalSHA1"],
      "sourcePDFSHA256":source_sha,
      "sourcePDFBytes":len(data),
      "sourcePDFPageCount":len(pdf),
      "individualCommonsSourceLicense":meta["individualCommonsLicense"]})
    existing_by_page={}
    for entry in doc["images"]:
        existing_by_page.setdefault(entry["sourcePageZeroBased"],[]).append(entry)
    seen_hash={x["webpSha256"] for x in doc["images"]}
    new=0;pages_scanned=0;regions_reviewed=0
    ART.mkdir(parents=True,exist_ok=True)
    for pg in range(start,stop):
        if new>=max_new:break
        gray,pagehash=rendered_page(pdf,pg)
        boxes=detect_original_engraving_regions(gray)
        pages_scanned+=1
        for n,b in enumerate(boxes):
            regions_reviewed+=1
            if any(intersection_over_union(b, old["sourceOriginalPixelRectXYXY"])>.24
                   for old in existing_by_page.get(pg,[])):
                continue
            packed=encode_scan_region(gray,b)
            digest=sha(packed)
            if digest in seen_hash or digest in REJECTED_PROSE_CROP_SHA256:continue
            relative=f"scan-art-crops/harper1860-p{pg+1:03d}-{digest[:16]}.webp"
            file=DEST/relative
            if file.exists() and sha(file.read_bytes())!=digest:
                raise ValueError("Source crop path collision, refusing alteration")
            file.write_bytes(packed)
            x0,y0,x1,y1,ink=b
            doc["images"].append({
              "localPath":relative,
              "webpSha256":digest,
              "webpBytes":len(packed),
              "sourcePDFSHA256":source_sha,
              "sourcePageZeroBased":pg,
              "sourcePageOneBased":pg+1,
              "sourcePageRasterSHA256":pagehash,
              "sourceOriginalPixelRectXYXY":[x0,y0,x1,y1],
              "pixelWidth":x1-x0,"pixelHeight":y1-y0,
              "originalRasterInkFraction":round(ink,5),
              "engraverStrokeComponentRatio":engraving_stroke_signature(gray[y0:y1,x0:x1]),
              "sourceUrl":meta["commonsFilePage"]+"?page="+str(pg+1),
              "sourceEdition":SOURCE_EDITION,
              "sourceArtist":ORIGINAL_ARTIST,
              "sourceOriginalPublisher":PUBLISHER,
              "individualCommonsSourceLicense":meta["individualCommonsLicense"],
              "sourceClassification":"AUTO_DETECTED_HISTORICAL_SCAN_REGION__PENDING_VISUAL_CONFIRMATION_AS_ENGRAVING",
              "actualHistoricalIllustrationVisuallyConfirmed":False,
              "chapterOneBased":None,
              "humanSceneReviewApproved":False,
              "editoriallyApproved":False,
              "territorialRightsApproved":False,
              "publishedToApp":False,
              "altAr":None,"altEn":None,
            })
            seen_hash.add(digest)
            existing_by_page.setdefault(pg,[]).append(doc["images"][-1])
            new+=1
            write_json(doc)
            print(f"Original source page {pg+1}/{len(pdf)} region {n+1}: actual scan crop SHA256={digest} ({x1-x0}x{y1-y0}); NOT APPROVED",flush=True)
            if new>=max_new:break
    doc["lastRunPagesInspected"]=pages_scanned
    doc["lastRunImageRegionsPassingStrictComputerVision"]=regions_reviewed
    doc["localImageRegionCropsBeforeHumanVerification"]=len(doc["images"])
    write_json(doc)
    print(f"DONE source PDF verified SHA256={source_sha}; new real scan pixels {new}, total {len(doc['images'])}, "
          "0 automatically approved artwork/chapter placements",flush=True)
    if not doc["images"]:
        raise RuntimeError("No actual 1860 scan imagery extracted; inspect first-edition scan carefully")
    return doc

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--max-new",type=int,default=80)
    ap.add_argument("--start",type=int,default=8)
    ap.add_argument("--stop",type=int,default=278)
    args=ap.parse_args()
    try:run(args.max_new,args.start,args.stop)
    except Exception as e:
        print("SOURCE INTAKE FAILED SAFELY: "+str(e),file=sys.stderr)
        raise
