#!/usr/bin/env python3
"""Recover 66 individually visually located ORIGINAL 1860 Harper McLenan plates.

Read the human-inspected original-PDF-page index with all 74 distinct engraved
pages. Eight already existed in the original archive; do not fetch/crop those
again. Recover the other 66 actual monochrome source-ink panels from EXACT
Commons-verified 278-page PDF, preserve SHA256 and source geometry.

This is editorial SOURCE ACQUISITION, NOT approval for app publication or a
machine claim of exact scene-to-chapter matching.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
import fitz

import intake_woman_white_harper1860_mclenan as source

ROOT=source.ROOT
DEST=source.DEST
INDEX=DEST/"original-illustrated-page-index.json"

# Normalized boundaries on actual source raster; figure locations were
# individually observed in page contact sheet, NOT auto-inferred as prose.
# Some artwork includes its original caption, not a false text-only crop.
BOUND={
    "L":(0.045,0.034,0.52,0.565),
    "R":(0.47,0.035,0.955,0.56),
    "F":(0.045,0.025,0.955,0.52),
}
ALREADY_REVIEWED={42,55,129,157,174,195,232,236}

def check_index(raw:dict)->list[dict]:
    rows=raw.get("originalScannedPagesWithWoodcuts",[])
    positions=[a.get("sourcePDFPageOneBased") for a in rows]
    if (raw.get("schemaVersion")!=1
        or raw.get("sourcePDF")!=source.TITLE
        or raw.get("sourcePDFSHA256")!="97c7236c8f6f02d63fa2a11043402f781467ba8c57aad48556be72080f19b854"
        or raw.get("documentedOriginalIllustrationCount")!=74
        or raw.get("visualPageIndicesChecked")!=278
        or raw.get("newOriginalArtworkPagesAwaitingSeparateCrops")!=66
        or set(raw.get("earlierAutoExtractedUniqueDrawingPages",[]))!=ALREADY_REVIEWED
        or raw.get("publicationApproved") is not False
        or len(rows)!=74 or len(set(positions))!=74
        or any(not isinstance(p,int) or p<11 or p>245 for p in positions)
        or any(q.get("visualIllustrationFocus") not in BOUND
               or q.get("originalArtworkPresentOnThisScannedPage") is not True
               or q.get("proposedNarrativeUnit") is not None
               for q in rows)):
        raise ValueError("Original indexed 74 illustrated pages have invalid source/release evidence")
    return sorted(rows,key=lambda r:r["sourcePDFPageOneBased"])

def crop_manually_located_original_source_engraving(
        gray:np.ndarray, focus:str)->tuple[bytes,tuple[int,int,int,int],float]:
    if gray.ndim!=2 or gray.dtype!=np.uint8 or focus not in BOUND:
        raise ValueError("Invalid raw original 1860 PDF raster/focus")
    H,W=gray.shape
    ax,ay,bx,by=BOUND[focus]
    rect=[round(ax*W),round(ay*H),round(bx*W),round(by*H)]
    x0,y0,x1,y1=rect
    if (x1-x0<200 or y1-y0<180 or x1>W or y1>H):
        raise ValueError("Original 1860 source figure crop too small/outside page")
    ink=float((gray[y0:y1,x0:x1]<175).mean())
    if ink<0.028:
        raise ValueError("Selected original engraving crop seems almost blank")
    encoded=source.encode_scan_region(gray,(*rect,ink))
    return encoded,tuple(rect),ink

def run(max_new:int=66)->int:
    if not 1<=max_new<=66:
        raise ValueError("Original 1860 pending source crop budget must be 1..66")
    index=json.loads(INDEX.read_text("utf-8"))
    rows=check_index(index)
    s=source.session()
    req=s.get(source.API,params={
         "action":"query","titles":source.TITLE,"prop":"imageinfo",
         "iiprop":"url|size|sha1|mime|extmetadata",
         "format":"json","formatversion":"2"},timeout=(16,40))
    req.raise_for_status()
    remote=source.validate_source_metadata(req.json())
    full=source.get_pdf(s,remote)
    digest=source.sha(full)
    if digest!=index["sourcePDFSHA256"]:
        raise ValueError("Full Commons 1860 McLenan edition was altered")
    pdf=fitz.open(stream=full,filetype="pdf")
    if len(pdf)!=278:
        raise ValueError("Not the original full 278-page illustrated 1860 volume")
    existing=source.existing_doc()
    if existing.get("sourcePDFSHA256")!=digest:
        raise ValueError("Cropping could mix altered 1860 book scans")
    by_page={}
    by_sha=set()
    for x in existing["images"]:
        by_page.setdefault(x["sourcePageOneBased"],[]).append(x)
        by_sha.add(x["webpSha256"])
    for p in ALREADY_REVIEWED:
        if len(by_page.get(p,[]))!=1:
            raise ValueError("Eight previously checked McLenan original engravings no longer uniquely present")
    count=0
    for row in rows:
        page=row["sourcePDFPageOneBased"]
        if page in ALREADY_REVIEWED: continue
        if page in by_page: continue
        gray,fullpage=source.rendered_page(pdf,page-1)
        packed,rect,ink=crop_manually_located_original_source_engraving(
            gray,row["visualIllustrationFocus"])
        h=source.sha(packed)
        if h in by_sha or h in source.REJECTED_PROSE_CROP_SHA256:
            raise ValueError("Original wood engraving duplicate of another page/pure text source")
        path=f"scan-art-crops/harper1860-p{page:03d}-{h[:16]}.webp"
        file=DEST/path
        if file.exists() and source.sha(file.read_bytes())!=h:
            raise ValueError("Original scan art collision; refusing overwrite")
        file.parent.mkdir(parents=True,exist_ok=True)
        file.write_bytes(packed)
        x0,y0,x1,y1=rect
        existing["images"].append({
            "localPath":path,
            "webpSha256":h,
            "webpBytes":len(packed),
            "sourcePDFSHA256":digest,
            "sourcePageZeroBased":page-1,
            "sourcePageOneBased":page,
            "sourcePageRasterSHA256":fullpage,
            "sourceOriginalPixelRectXYXY":[x0,y0,x1,y1],
            "pixelWidth":x1-x0,"pixelHeight":y1-y0,
            "originalRasterInkFraction":round(ink,5),
            "engraverStrokeComponentRatio":source.engraving_stroke_signature(gray[y0:y1,x0:x1]),
            "visualSourcePageFocus":row["visualIllustrationFocus"],
            "sourceUrl":remote["commonsFilePage"]+"?page="+str(page),
            "sourceEdition":source.SOURCE_EDITION,
            "sourceArtist":source.ORIGINAL_ARTIST,
            "sourceOriginalPublisher":source.PUBLISHER,
            "individualCommonsSourceLicense":remote["individualCommonsLicense"],
            "sourceClassification":"DIRECTLY_VISUALLY_LOCATED_PRINTED_1860_ILLUSTRATED_PAGE_CROP__IMAGE_SCENE_REVIEW_PENDING",
            "actualHistoricalIllustrationVisuallyConfirmed":False,
            "chapterOneBased":None,
            "humanSceneReviewApproved":False,
            "editoriallyApproved":False,
            "territorialRightsApproved":False,
            "publishedToApp":False,
            "altAr":None,"altEn":None
        })
        by_sha.add(h)
        by_page[page]=[existing["images"][-1]]
        source.write_json(existing)
        count+=1
        print(f"REAL HARPER 1860 ORIGINAL #{count}: PDF p{page} focus={row['visualIllustrationFocus']} "
              f"hash={h}; original pixels, scene/rights NOT approved",flush=True)
        if count>=max_new: break
    existing["sourceIllustratedBookPagesVisuallyLocated"]=74
    existing["sourceIllustratedBookPageIndex"]=str(INDEX.relative_to(ROOT))
    existing["all74OriginalIllustratedPageCroppingsPresent"] = (
        set(by_page)=={r["sourcePDFPageOneBased"] for r in rows})
    existing["sourcePreparedOriginalImageRegionCount"]=len(existing["images"])
    source.write_json(existing)
    print(f"PASS: NEW real original scan crops {count}; total {len(existing['images'])}; "
          f"74 illustration-bearing pages visible in source; 0 human-accepted chapter cards",flush=True)
    return count

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--max-new",type=int,default=66)
    a=parser.parse_args()
    try:run(a.max_new)
    except Exception as e:
        print("ORIGINAL HARPER SOURCE CROP RECOVERY FAILED SAFELY: "+str(e),file=sys.stderr)
        raise
