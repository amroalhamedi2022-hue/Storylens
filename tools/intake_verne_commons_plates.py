#!/usr/bin/env python3
"""Acquire genuine Commons-hosted Verne period plates into quarantine; never publish."""
import hashlib, io, json, os, re, time
from urllib.error import HTTPError, URLError
from pathlib import Path
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"docs/literature/staging/verne-commons-plates-20261105"
API="https://commons.wikimedia.org/w/api.php"
CATEGORY="Category:Illustrations from Around the World in Eighty Days by Neuville and Benett"
UA="LinguaTalesHistoricResearch/1.0 (archival illustration attribution; noncommercial staging)"
MAX=12_000_000
def request(url,limit):
    for attempt in range(3):
        try:
            with urlopen(Request(url,headers={"User-Agent":UA}),timeout=45) as response:
                if urlparse(response.geturl()).scheme!="https": raise ValueError("insecure redirect")
                data=response.read(limit+1)
                if len(data)>limit: raise ValueError("oversized response")
                return data
        except Exception:
            if attempt==2: raise
            time.sleep(2+attempt)
def api(params):
    return json.loads(request(API+"?"+urlencode({"format":"json","formatversion":2,**params}),3_000_000))
def save_manifest(known):
    manifest=OUT/"manifest.json"
    manifest.write_text(json.dumps({"status":"QUARANTINE_NOT_PUBLISHED","sourceCategory":CATEGORY,"images":[known[k] for k in sorted(known)]},ensure_ascii=False,indent=2)+"\n")

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    manifest=OUT/"manifest.json"
    old=json.loads(manifest.read_text()) if manifest.exists() else {"images":[]}
    known={x["commonsTitle"]:x for x in old["images"]}
    members=[]; cont={}
    try:
        while True:
            payload=api({"action":"query","list":"categorymembers","cmtitle":CATEGORY,"cmtype":"file","cmlimit":100,**cont})
            members += [m["title"] for m in payload["query"]["categorymembers"]]
            if "continue" not in payload: break
            cont=payload["continue"]
    except (HTTPError, URLError, TimeoutError) as exc:
        save_manifest(known)
        print("SOURCE_API_UNAVAILABLE; existing verified assets preserved:",repr(exc),flush=True)
        return
    # Keep a reproducible lexicographic source order, no chapter-placement inference.
    added=0
    for title in sorted(set(members)):
        if added>=30: break
        if title in known: continue
        try:
            record=api({"action":"query","titles":title,"prop":"imageinfo","iiprop":"url|size|mime|extmetadata","iiurlwidth":1200})
        except (HTTPError, URLError, TimeoutError) as exc:
            print("SOURCE_METADATA_UNAVAILABLE; preserving progress:",repr(exc),flush=True)
            break
        pages=record.get("query",{}).get("pages",[])
        info=pages[0].get("imageinfo",[{}])[0] if pages else {}
        url=info.get("url","")
        host=urlparse(url).hostname or ""
        if host not in ("upload.wikimedia.org",) or info.get("mime") not in ("image/jpeg","image/png","image/webp"): continue
        if info.get("size",MAX+1)>MAX: continue
        download_url=info.get("thumburl") or url
        try:
            raw=request(download_url,MAX)
        except HTTPError as exc:
            if exc.code in (429,503):
                print("RATE_LIMIT_STOP; preserving verified files",flush=True)
                break
            print("SKIP_HTTP",title,exc.code,flush=True)
            continue
        with Image.open(io.BytesIO(raw)) as im:
            im.verify()
        with Image.open(io.BytesIO(raw)) as im:
            width,height=im.size
        if min(width,height)<300: continue
        sha=hashlib.sha256(raw).hexdigest()
        ext={"image/jpeg":".jpg","image/png":".png","image/webp":".webp"}[info["mime"]]
        name=sha[:24]+ext
        target=OUT/name
        if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest()!=sha: raise ValueError("hash mismatch")
        if not target.exists(): target.write_bytes(raw)
        meta=info.get("extmetadata",{})
        known[title]={"commonsTitle":title,"commonsDescriptionPage":"https://commons.wikimedia.org/wiki/"+title.replace(" ","_"),"sourceUrl":url,"downloadUrl":download_url,"sourceSha256":sha,"localFile":name,"bytes":len(raw),"width":width,"height":height,"mime":info["mime"],"licenseShortName":meta.get("LicenseShortName",{}).get("value","UNVERIFIED"),"artistMetadata":meta.get("Artist",{}).get("value",""),"creditMetadata":meta.get("Credit",{}).get("value",""),"rightsStatus":"PENDING_INDIVIDUAL_AND_TERRITORIAL_REVIEW","chapterAnchorStatus":"NOT_REVIEWED","publicationStatus":"STAGED_ONLY_NOT_IN_APP"}
        added+=1
        save_manifest(known)
        print("STAGED",title,sha,flush=True)
        time.sleep(0.4)
    save_manifest(known)
    print("NEW_REAL_IMAGE_FILES",added,"TOTAL",len(known),flush=True)
if __name__=="__main__": main()
